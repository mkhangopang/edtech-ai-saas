"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/utils/supabase/client"
import { Loader2 } from "lucide-react"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    // This runs when user clicks magic link
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        router.push("/dashboard")
      }
    })

    // Also check immediately in case session already exists
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
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
