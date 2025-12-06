import { OpenAI } from 'openai'
import { createServerSupabaseClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const { type, curriculum, gradeLevel, subject } = await req.json()

  // Get user and check auth
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check credits
  const { data: profile } = await supabase.from('profiles').select('credits').eq('id', user.id).single()
  if (!profile || (profile?.credits ?? 0) < 20) {
    return NextResponse.json({ error: 'Not enough credits' }, { status: 402 })
  }

  // Deduct credits
  await supabase.from('profiles').update({ credits: profile.credits - 20 }).eq('id', user.id)

  const prompt = type === 'lesson'
    ? `Create a detailed lesson plan for ${gradeLevel} ${subject} based on: ${curriculum}`
    : `Create 10 multiple-choice quiz questions for ${gradeLevel} ${subject} based on: ${curriculum}`

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

