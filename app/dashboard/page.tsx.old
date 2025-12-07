'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@\/utils\/supabase\/client'
import { toast } from 'sonner'
import Link from 'next/link'
import { Upload, FileText, BookOpen, CreditCard, LogOut, Sparkles } from 'lucide-react'

interface Stats {
  credits: number
  uploads: number
  lessonPlans: number
  quizzes: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<Stats>({
    credits: 0,
    uploads: 0,
    lessonPlans: 0,
    quizzes: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
    fetchStats()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
    }
  }

  const fetchStats = async () => {
    try {
      // Fetch credits
      const creditsRes = await fetch('/api/credits/check')
      const creditsData = await creditsRes.json()

      // Fetch uploads count
      const { count: uploadsCount } = await supabase
        .from('uploads')
        .select('*', { count: 'exact', head: true })

      // Fetch lesson plans count
      const { count: lessonPlansCount } = await supabase
        .from('lesson_plans')
        .select('*', { count: 'exact', head: true })

      // Fetch quizzes count
      const { count: quizzesCount } = await supabase
        .from('quizzes')
        .select('*', { count: 'exact', head: true })

      setStats({
        credits: creditsData.credits || 0,
        uploads: uploadsCount || 0,
        lessonPlans: lessonPlansCount || 0,
        quizzes: quizzesCount || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    toast.success('Signed out successfully')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">EdTech AI</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/credits"
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition"
              >
                <CreditCard className="w-4 h-4" />
                {stats.credits} Credits
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
          </h2>
          <p className="text-gray-600">Transform your curriculum into engaging educational content</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <CreditCard className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">{stats.credits}</span>
            </div>
            <p className="text-sm text-gray-600">Available Credits</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <Upload className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">{stats.uploads}</span>
            </div>
            <p className="text-sm text-gray-600">PDFs Uploaded</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">{stats.lessonPlans}</span>
            </div>
            <p className="text-sm text-gray-600">Lesson Plans</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-orange-600" />
              <span className="text-2xl font-bold text-gray-900">{stats.quizzes}</span>
            </div>
            <p className="text-sm text-gray-600">Quizzes Created</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/upload"
            className="bg-white rounded-xl p-8 shadow-sm border hover:shadow-lg transition group"
          >
            <Upload className="w-12 h-12 text-blue-600 mb-4 group-hover:scale-110 transition" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Upload PDF</h3>
            <p className="text-gray-600">Upload curriculum PDFs and extract text automatically</p>
            <p className="text-sm text-blue-600 font-medium mt-4">Cost: 1 credit</p>
          </Link>

          <Link
            href="/lesson-plans"
            className="bg-white rounded-xl p-8 shadow-sm border hover:shadow-lg transition group"
          >
            <BookOpen className="w-12 h-12 text-purple-600 mb-4 group-hover:scale-110 transition" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Generate Lesson Plan</h3>
            <p className="text-gray-600">Create detailed lesson plans from your curriculum content</p>
            <p className="text-sm text-purple-600 font-medium mt-4">Cost: 5 credits</p>
          </Link>

          <Link
            href="/quizzes"
            className="bg-white rounded-xl p-8 shadow-sm border hover:shadow-lg transition group"
          >
            <FileText className="w-12 h-12 text-orange-600 mb-4 group-hover:scale-110 transition" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Create Quiz</h3>
            <p className="text-gray-600">Generate multiple-choice quizzes to test student knowledge</p>
            <p className="text-sm text-orange-600 font-medium mt-4">Cost: 3 credits</p>
          </Link>
        </div>

        {/* Low Credits Warning */}
        {stats.credits < 5 && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <CreditCard className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-900 mb-1">Low on credits</h3>
                <p className="text-yellow-700 mb-3">
                  You're running low on credits. Purchase more to continue creating amazing content!
                </p>
                <Link
                  href="/credits"
                  className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition"
                >
                  Buy More Credits
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
