import { OpenAI } from 'openai'
import { createServerSupabaseClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const { documentId, type, weeks } = await req.json()

  // Get user and check auth
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Fetch document
  const { data: document, error: documentError } = await supabase
    .from('documents')
    .select('title, file_url, extracted_text')
    .eq('id', documentId)
    .eq('user_id', user.id)
    .single()

  if (documentError || !document) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  // Check credits
  const { data: profile } = await supabase.from('users').select('credits').eq('id', user.id).single()
  if (!profile || (profile?.credits ?? 0) < 1) {
    return NextResponse.json({ error: 'Not enough credits' }, { status: 402 })
  }

  // Deduct credits
  await supabase.from('users').update({ credits: profile.credits - 1 }).eq('id', user.id)

  let prompt = ''
  
  if (type === 'lesson') {
    prompt = `You are an expert education consultant specializing in curriculum design and lesson planning following pedagogical best practices.

Curriculum Content:
${document.extracted_text || document.title}

Task: Create a comprehensive ${weeks || 8}-week lesson plan that includes:

1. **Weekly Breakdown**: For each week, provide:
   - Week number and title
   - Learning objectives (3-5 per week)
   - Key concepts and topics
   - Suggested activities and teaching strategies
   - Assessment methods
   - Resources needed

2. **SLO (Student Learning Outcomes) Tagging**: For EACH learning objective, tag it with:
   - Bloom's Taxonomy Level (Remember, Understand, Apply, Analyze, Evaluate, Create)
   - Cognitive Domain (Knowledge, Comprehension, Application, Analysis, Synthesis, Evaluation)
   - Action Verb from Bloom's Taxonomy

3. **Pedagogical Best Practices**: Include:
   - Differentiation strategies
   - Formative and summative assessments
   - Active learning techniques
   - Technology integration suggestions

Format the output in clear sections with headings. Be specific and actionable for teachers.`
  } else if (type === 'mcq') {
    prompt = `Based on this curriculum content:
${document.extracted_text || document.title}

Create 10 Multiple Choice Questions (MCQs) that:
- Cover different topics from the curriculum
- Follow Bloom's Taxonomy levels (mix of Remember, Understand, Apply, Analyze)
- Include 4 options each (A, B, C, D)
- Clearly indicate the correct answer
- Add a brief explanation for each answer

For EACH question, tag it with:
- Bloom's Taxonomy Level
- Topic/Concept tested
- Difficulty: Easy/Medium/Hard

Format: Question, Options, Correct Answer, Explanation, Tags`
  } else if (type === 'srq') {
    prompt = `Based on this curriculum:
${document.extracted_text || document.title}

Create 8 Short Response Questions (SRQs) that:
- Require 2-3 sentence answers
- Test understanding and application
- Cover key concepts
- Include model answers
- Tag with Bloom's Taxonomy level (Understand, Apply, Analyze)

Format: Question, Expected Answer Length, Model Answer, Bloom's Level`
  } else if (type === 'erq') {
    prompt = `Based on this curriculum:
${document.extracted_text || document.title}

Create 5 Extended Response Questions (ERQs) that:
- Require paragraph-length answers (150-300 words)
- Test higher-order thinking (Analyze, Evaluate, Create)
- Include rubrics for assessment
- Provide model answers
- Tag with Bloom's Taxonomy level

Format: Question, Rubric, Model Answer, Bloom's Level, Assessment Criteria`
  } else {
    prompt = `Create a detailed lesson plan based on this curriculum: ${document.extracted_text || document.title}`
  }

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    stream: true,
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || ''
        controller.enqueue(encoder.encode(text))
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}

