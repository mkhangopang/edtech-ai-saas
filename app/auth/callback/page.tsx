"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/utils/supabase/client"
import { Loader2 } from "lucide-react"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    // This runs when user clicks magic link
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Check if user exists in our users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('id', session.user.id)
          .single()

        if (userError) {
          // User doesn't exist, create it
          console.log('Creating user profile for new user')
          const { error: insertError } = await supabase
            .from('users')
            .insert([
              {
                id: session.user.id,
                email: session.user.email,
                full_name: session.user.user_metadata?.full_name || '',
                credits: 10,
              }
            ])
          
          if (insertError) {
            console.error('Error creating user profile:', insertError)
          }
        }
        
        router.push("/dashboard")
      }
    })

    // Also check immediately in case session already exists
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        // Check if user exists in our users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('id', data.session.user.id)
          .single()

        if (userError) {
          // User doesn't exist, create it
          console.log('Creating user profile for existing session')
          const { error: insertError } = await supabase
            .from('users')
            .insert([
              {
                id: data.session.user.id,
                email: data.session.user.email,
                full_name: data.session.user.user_metadata?.full_name || '',
                credits: 10,
              }
            ])
          
          if (insertError) {
            console.error('Error creating user profile:', insertError)
          }
        }
        
        router.push("/dashboard")
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-indigo-600" />
        <p className="text-xl font-medium">Signing you in...</p>
      </div>
    </div>
  )
}
