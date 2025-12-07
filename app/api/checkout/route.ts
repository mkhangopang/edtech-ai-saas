import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerSupabaseClient } from '@/utils/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

export async function POST(req: Request) {
  try {
    const { priceId, credits } = await req.json()
    
    // Get user from session
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to purchase credits' },
        { status: 401 }
      )
    }
    
    // Get user profile to verify
    const { data: profile } = await supabase
      .from('users')
      .select('email, full_name')
      .eq('id', user.id)
      .single()
    
    if (!profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
        credits: credits.toString(),
      },
      customer_email: profile.email || undefined,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/credits/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/credits`,
    })
    
    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

// Disable body parsing for webhook
export const runtime = 'edge'

