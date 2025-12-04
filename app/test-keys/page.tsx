"use client"
import { supabase } from "@/utils/supabase/client"

export default function TestKeys() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <button 
        onClick={async () => {
          const { data, error } = await supabase.auth.getUser()
          if (error || !data.user) {
            alert("KEYS INVALID ?\n" + (error?.message || "No user"))
          } else {
            alert("KEYS 100% WORKING! ?\nLogged in as: " + data.user.email)
          }
        }}
        className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700"
      >
        Click to TEST Supabase Keys
      </button>
    </div>
  )
}
