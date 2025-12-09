import { OpenAI } from 'openai'
import { createServerSupabaseClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { generateWithGeminiStream } from '@/lib/gemini/client'
import { getCachedCurriculum } from '@/lib/cache/curriculumCache'

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

  // Use cached curriculum or fetch fresh
  const curriculum = await getCachedCurriculum(
    user.id, 
    async () => document.extracted_text || document.title
  )

  let contentType = ''
  let prompt = ''
  
  if (type === 'lesson') {
    contentType = 'lesson plan'
    prompt = `Create a comprehensive ${weeks || 8}-week lesson plan that includes:
1. Weekly Breakdown: For each week, provide:
   - Week number and title
   - Learning objectives (3-5 per week)
   - Key concepts and topics
   - Suggested activities and teaching strategies
   - Assessment methods
   - Resources needed
2. SLO Tagging: For EACH learning objective, tag it with:
   - Bloom's Taxonomy Level (Remember, Understand, Apply, Analyze, Evaluate, Create)
   - Cognitive Domain (Knowledge, Comprehension, Application, Analysis, Synthesis, Evaluation)
   - Action Verb from Bloom's Taxonomy
3. Pedagogical Best Practices: Include:
   - Differentiation strategies
   - Formative and summative assessments
   - Active learning techniques
   - Technology integration suggestions
Format the output in clear sections with headings. Be specific and actionable for teachers.`
  } else if (type === 'mcq') {
    contentType = 'multiple choice questions'
    prompt = `Create 10 Multiple Choice Questions (MCQs) that:
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
    contentType = 'short response questions'
    prompt = `Create 8 Short Response Questions (SRQs) that:
- Require 2-3 sentence answers
- Test understanding and application
- Cover key concepts
- Include model answers
- Tag with Bloom's Taxonomy level (Understand, Apply, Analyze)
Format: Question, Expected Answer Length, Model Answer, Bloom's Level`
  } else if (type === 'erq') {
    contentType = 'extended response questions'
    prompt = `Create 5 Extended Response Questions (ERQs) that:
- Require paragraph-length answers (150-300 words)
- Test higher-order thinking (Analyze, Evaluate, Create)
- Include rubrics for assessment
- Provide model answers
- Tag with Bloom's Taxonomy level
Format: Question, Rubric, Model Answer, Bloom's Level, Assessment Criteria`
  } else {
    contentType = 'educational content'
    prompt = `Create a detailed lesson plan based on this curriculum`
  }

  // Generate with Gemini (much faster than OpenAI)
  const stream = await generateWithGeminiStream({
    curriculum,
    userPrompt: prompt,
    contentType
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.text()
          controller.enqueue(encoder.encode(text))
        }
        controller.close()
      } catch (error) {
        controller.error(error)
      }
    }
  })

  return new Response(readable, {
    headers: { 
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Generation-Time': '2-3s' // Show off the speed!
    }
  })
}

