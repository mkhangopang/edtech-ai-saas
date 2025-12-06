"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  CreditCard,
  Zap,
  Check,
  Loader2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  priceId: string;
  popular?: boolean;
}

const packages: CreditPackage[] = [
  {
    id: "starter",
    name: "Starter Pack",
    credits: 50,
    price: 9,
    priceId: "price_starter_50", // Replace with real Stripe price ID
  },
  {
    id: "pro",
    name: "Pro Pack",
    credits: 200,
    price: 29,
    priceId: "price_pro_200", // Replace with real Stripe price ID
    popular: true,
  },
];

export default function CreditsPage() {
  const [userCredits, setUserCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  useEffect(() => {
    loadUserCredits();
  }, []);

  const loadUserCredits = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("credits")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setUserCredits(data.credits);
    } catch (error: any) {
      console.error("Error loading credits:", error);
      toast.error("Failed to load credits");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (pkg: CreditPackage) => {
    setPurchasing(pkg.id);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Call API to create Stripe checkout session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: pkg.priceId,
          credits: pkg.credits,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create checkout session");
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error: any) {
      console.error("Purchase error:", error);
      toast.error(error.message || "Failed to process payment");
      setPurchasing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
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
              <Zap className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-900">
                {userCredits} credits
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">
              Buy Credits
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Credit Package
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Purchase credits to generate unlimited lesson plans and quizzes.
            Credits never expire.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-xl shadow-lg border-2 p-8 relative ${
                pkg.popular ? "border-blue-500" : "border-gray-200"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {pkg.name}
                </h3>
                <div className="flex items-baseline justify-center gap-2 mb-4">
                  <span className="text-5xl font-bold text-gray-900">
                    ${pkg.price}
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">
                    {pkg.credits} Credits
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">
                    Generate {pkg.credits} lesson plans or quizzes
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">
                    AI-powered content generation
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Credits never expire</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Priority support</span>
                </li>
              </ul>

              <button
                onClick={() => handlePurchase(pkg)}
                disabled={purchasing !== null}
                className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                  pkg.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {purchasing === pkg.id ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Purchase Now
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                How do credits work?
              </h3>
              <p className="text-gray-600">
                Each lesson plan or quiz generation costs 1 credit. Credits are
                deducted from your account immediately after successful
                generation.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Do credits expire?
              </h3>
              <p className="text-gray-600">
                No! Your credits never expire. Use them whenever you need, at
                your own pace.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, debit cards, and digital
                wallets through our secure Stripe payment processor.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I get a refund?
              </h3>
              <p className="text-gray-600">
                Yes! If you're not satisfied with your purchase, contact us
                within 7 days for a full refund of unused credits.
              </p>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Secure payment processing powered by Stripe
          </div>
        </div>
      </main>
    </div>
  );
}




