'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { 
  BookOpen, 
  LogOut, 
  Upload, 
  Zap, 
  CreditCard, 
  FileText,
  Loader2,
  Plus,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { ensureUserExists } from '@/utils/supabase/ensure-user'
import { Badge } from '@/components/ui/badge'

interface UserData {
  id: string
  email: string
  full_name: string
  credits: number
}

interface Document {
  id: string
  title: string
  file_url: string
  created_at: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(() => {
    loadUserData()
    loadDocuments()
  }, [])

  const loadUserData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        router.push('/login')
        return
      }

      // Ensure user exists in our users table
      const { success, error: ensureError } = await ensureUserExists()
      if (!success) {
        console.error('Error ensuring user exists:', ensureError)
        toast.error('Failed to initialize user profile')
        return
      }

      // Get user data
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error) throw error
      setUser(data)
    } catch (error: any) {
      console.error('Error loading user:', error)
      toast.error('Failed to load user data')
    } finally {
      setLoading(false)
    }
  }

  const loadDocuments = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setDocuments(data || [])
    } catch (error: any) {
      console.error('Error loading documents:', error)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    setUploading(true)

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) throw new Error('Not authenticated')

      const fileName = `${authUser.id}/${Date.now()}-${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('curricula')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('curricula')
        .getPublicUrl(fileName)

      console.log('Inserting document with data:', {
        user_id: authUser.id,
        title: file.name,
        file_url: publicUrl,
        file_path: fileName,
      });

      // Ensure user exists in our users table
      const { success, error: ensureError } = await ensureUserExists();
      if (!success) {
        console.error('Error ensuring user exists:', ensureError);
        throw new Error('Failed to initialize user profile. Please refresh the page and try again.');
      }

      const { data: docData, error: docError } = await supabase
        .from('documents')
        .insert([
          {
            user_id: authUser.id,
            title: file.name,
            file_url: publicUrl,
            file_path: fileName,
          },
        ])
        .select('id')
        .single();

      console.log('Document insertion result:', { docData, docError });

      if (docError) throw docError;

      // Trigger PDF text extraction
      if (docData && docData.id) {
        try {
          await fetch('/api/extract-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ documentId: docData.id }),
          });
        } catch (extractionError) {
          console.warn('Failed to trigger text extraction:', extractionError);
        }
      }

      toast.success('PDF uploaded successfully!');
      loadDocuments();
      
      // Small delay to ensure document is saved
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect to generate page with the document ID
      console.log('Checking redirect conditions:', { docData, hasId: docData?.id });
      if (docData && docData.id) {
        const redirectUrl = `/dashboard/generate?docId=${docData.id}`;
        console.log('Redirecting to:', redirectUrl);
        router.push(redirectUrl);
      } else {
        console.log('Redirect failed - no document ID');
        toast.error('Upload completed but redirect failed. Please click "Generate" button below.');
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">EdTech AI</span>
              <Badge variant="success" className="ml-2">Gemini-Powered</Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-900">{user?.credits || 0} credits</span>
              </div>
              
              <Link
                href="/dashboard/credits"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
              >
                <CreditCard className="h-5 w-5" />
                <span>Buy Credits</span>
              </Link>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.full_name || 'Teacher'}! 👋
          </h1>
          <p className="text-gray-600">
            Upload curriculum PDFs to generate AI-powered lesson plans, MCQs, SRQs, and ERQs with Bloom's Taxonomy tagging
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
            <Zap className="h-5 w-5" />
            <span><strong>Lightning Fast:</strong> Powered by Google Gemini 1.5 Flash - Results in 2-3 seconds!</span>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-blue-600">2-3s</div>
            <div className="text-sm text-gray-600">Avg. Generation Time</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-green-600">1M</div>
            <div className="text-sm text-gray-600">Token Context Window</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-purple-600">∞</div>
            <div className="text-sm text-gray-600">Free Generations</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-2xl font-bold text-orange-600">$0</div>
            <div className="text-sm text-gray-600">Monthly API Cost</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col items-center justify-center">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Upload Your Curriculum</h2>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              Upload a curriculum PDF and generate week-based lesson plans, MCQs, SRQs, ERQs with automatic SLO tagging
            </p>
            
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
              <div className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50">
                {uploading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    Choose PDF File
                  </>
                )}
              </div>
            </label>
            
            <p className="text-sm text-gray-500 mt-3">
              Maximum file size: 10MB • PDF format only
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FileText className="h-6 w-6 text-gray-600" />
            Recent Documents
          </h2>
          
          {documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No documents uploaded yet</p>
              <p className="text-sm text-gray-400">Upload your first PDF to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition group">
                  <Link
                    href={`/dashboard/generate?docId=${doc.id}`}
                    className="flex items-center gap-3 flex-1"
                  >
                    <div className="bg-red-100 p-2 rounded">
                      <FileText className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-blue-600">
                        {doc.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                  <Link
                    href={`/dashboard/generate?docId=${doc.id}`}
                    className="flex items-center gap-2 text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
                  >
                    <Sparkles className="h-4 w-4" />
                    Generate
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}