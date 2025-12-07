"use client";
import { Suspense } from "react";

import { useEffect, useState, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Loader2,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";

function GeneratePageContent() {
  const [document, setDocument] = useState<any>(null);
  const [userCredits, setUserCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [contentType, setContentType] = useState<"lesson" | "mcq" | "srq" | "erq">("lesson");
  const [weeks, setWeeks] = useState(8);
  const [copied, setCopied] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const docId = searchParams.get("docId");
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (docId) {
      loadDocument();
      loadUserCredits();
    }
  }, [docId]);

  const loadDocument = async (retryCount = 0) => {
    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", docId)
        .single();

      if (error) throw error;
      
      if (!data && retryCount < 3) {
        // Retry if document not found (might still be saving)
        setTimeout(() => loadDocument(retryCount + 1), 500);
        return;
      }
      
      setDocument(data);
    } catch (error: any) {
      console.error("Error loading document:", error);
      
      if (retryCount < 3) {
        // Retry on error
        setTimeout(() => loadDocument(retryCount + 1), 500);
        return;
      }
      
      toast.error("Failed to load document");
      router.push("/dashboard");
    } finally {
      if (retryCount >= 3 || document) {
        setLoading(false);
      }
    }
  };

  const loadUserCredits = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("users")
        .select("credits")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setUserCredits(data.credits);
    } catch (error: any) {
      console.error("Error loading credits:", error);
    }
  };

  const handleGenerate = async () => {
    if (userCredits < 1) {
      toast.error("Not enough credits! Please purchase more.");
      router.push("/dashboard/credits");
      return;
    }

    setGenerating(true);
    setGeneratedContent("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Call API to generate content with streaming
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: docId,
          type: contentType,
          weeks: weeks,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate content");
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  setGeneratedContent((prev) => prev + parsed.content);
                  // Auto-scroll to bottom
                  if (outputRef.current) {
                    outputRef.current.scrollTop =
                      outputRef.current.scrollHeight;
                  }
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      // Reload credits after generation
      await loadUserCredits();
      toast.success("Content generated successfully! âœ¨");
    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error(error.message || "Failed to generate content");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-12 w-12 text-gray-300 mx-auto mb-3 animate-spin" />
        <p className="text-gray-500">Loading document...</p>
        <p className="text-sm text-gray-400 mt-2">If this takes too long, the document might still be processing</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Link>
            </div>

            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-900">
                {userCredits} credits
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Document Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {document?.title}
              </h1>
              <p className="text-sm text-gray-500">
                Uploaded on{" "}
                {new Date(document?.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Generation Options */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              Generate Content
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What would you like to generate?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setContentType("lesson")}
                    disabled={generating}
                    className={`p-4 border-2 rounded-lg text-left transition ${
                      contentType === "lesson"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-900 mb-1">
                      Lesson Plan
                    </div>
                    <div className="text-sm text-gray-600">
                      Week-based plans with SLO tagging
                    </div>
                  </button>

                  <button
                    onClick={() => setContentType("mcq")}
                    disabled={generating}
                    className={`p-4 border-2 rounded-lg text-left transition ${
                      contentType === "mcq"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-900 mb-1">MCQs</div>
                    <div className="text-sm text-gray-600">
                      Multiple choice questions
                    </div>
                  </button>

                  <button
                    onClick={() => setContentType("srq")}
                    disabled={generating}
                    className={`p-4 border-2 rounded-lg text-left transition ${
                      contentType === "srq"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-900 mb-1">SRQs</div>
                    <div className="text-sm text-gray-600">
                      Short response questions
                    </div>
                  </button>

                  <button
                    onClick={() => setContentType("erq")}
                    disabled={generating}
                    className={`p-4 border-2 rounded-lg text-left transition ${
                      contentType === "erq"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-semibold text-gray-900 mb-1">ERQs</div>
                    <div className="text-sm text-gray-600">
                      Extended response questions
                    </div>
                  </button>
                </div>
              </div>

              {contentType === "lesson" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Weeks
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="16"
                    value={weeks}
                    onChange={(e) => setWeeks(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <div className="font-semibold mb-1">Cost: 1 Credit</div>
                    <div>
                      Each generation uses 1 credit. You have {userCredits}{" "}
                      credits remaining.
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating || userCredits < 1}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generate {contentType === "lesson" ? "Lesson Plan" : 
                             contentType === "mcq" ? "MCQs" :
                             contentType === "srq" ? "SRQs" : "ERQs"}
                  </>
                )}
              </button>

              {userCredits < 1 && (
                <Link
                  href="/dashboard/credits"
                  className="block w-full text-center bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Buy More Credits
                </Link>
              )}
            </div>
          </div>

          {/* Generated Output */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FileText className="h-6 w-6 text-gray-600" />
                Generated Content
              </h2>
              {generatedContent && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>

            <div
              ref={outputRef}
              className="bg-gray-50 rounded-lg p-6 min-h-[400px] max-h-[600px] overflow-y-auto"
            >
              {generatedContent ? (
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-gray-800">
                    {generatedContent}
                  </pre>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Sparkles className="h-12 w-12 mb-3" />
                  <p className="text-center">
                    Your generated content will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}





export default function GeneratePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <GeneratePageContent />
    </Suspense>
  );
}
