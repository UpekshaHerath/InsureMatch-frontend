import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-white" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm font-medium text-orange-700">
              Powered by AI
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Find Your Perfect{" "}
              <span className="text-primary">Insurance Match</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600">
              Answer a few questions about yourself and our AI will analyze
              available policies, rank them by suitability, and explain exactly
              why each one fits your needs.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link href="/profile" className="w-full sm:w-auto">
                <Button size="lg" className="w-full px-8 text-base sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/policies" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full text-base sm:w-auto">
                  Browse Policies
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-slate-50 py-10 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-xl font-bold text-slate-900 sm:text-3xl">
            How It Works
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <FeatureCard
              step="1"
              title="Complete Your Profile"
              description="Tell us about yourself — your age, occupation, health, goals, and lifestyle in a simple 6-step form."
            />
            <FeatureCard
              step="2"
              title="AI Analyzes & Ranks"
              description="Our ML model scores every policy against your profile and SHAP explains why each policy is a good or bad fit."
            />
            <FeatureCard
              step="3"
              title="Get Recommendations"
              description="See ranked policies with clear explanations. Ask follow-up questions in our AI chat to learn more."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-white sm:text-3xl">
            Ready to find your ideal policy?
          </h2>
          <p className="mt-4 text-slate-300">
            It only takes a few minutes to complete your profile.
          </p>
          <div className="mt-8">
            <Link href="/profile">
              <Button size="lg" className="px-8 text-base">
                Start Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-6 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
        {step}
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}
