import { OpenAI } from 'openai'
import { getUser } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 })

  const { prompt } = await req.json()

  // Simple credit check (replace with real logic later)
  const supabase = (await import('@/utils/supabase/server')).createServerSupabaseClient()
  const { data: profile } = await supabase.from('profiles').select('credits').eq('id', user.id).single()
  if ((profile?.credits ?? 0) < 20) return NextResponse.json({ error: 'Not enough credits' }, { status: 402 })

  // Deduct credits
  await supabase.from('profiles').update({ credits: (profile!.credits - 20) }).eq('id', user.id)

  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    stream: true
  })

  const readable = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder()
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || ''
        if (content) controller.enqueue(encoder.encode(content))
      }
      controller.close()
    }
  })

  return new Response(readable)
}
