
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {  ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";

const DIFF_PREVIEW = [
  { type: "ctx", code: "function reviewPullRequest(pr) {" },
  { type: "del", code: "  return approve(pr); // no checks" },
  { type: "add", code: "  const issues = aico.scan(pr);" },
  { type: "add", code: "  if (issues.length) return flag(issues);" },
  { type: "ctx", code: "  return approve(pr);" },
  { type: "ctx", code: "}" },
];

export default function SignInPage() {
  return (
    <div className="flex min-h-screen bg-[#0B0E14] font-[Inter,sans-serif] text-[#E6E8EB]">
      {/* Left: brand / diff panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-[#1D2430] p-12 lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(79,214,140,0.08),transparent_45%)]" />

        <Link href="/" className="relative z-10 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#4FD68C] font-mono text-sm font-bold text-[#0B0E14]">
            {"</>"}
          </span>
          <span className="font-mono text-sm font-medium tracking-tight">
            AicoCodeReviewer
          </span>
        </Link>

        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold leading-snug tracking-tight">
              Every pull request,
              <br />
              reviewed before it lands.
            </h1>
            <p className="max-w-sm text-sm text-[#748097]">
              Aico reads the diff, flags what your reviewers would flag, and
              leaves the comment before someone has to ask.
            </p>
          </div>

          {/* Mock diff card */}
          <div className="overflow-hidden rounded-lg border border-[#1D2430] bg-[#10141C] shadow-2xl shadow-black/40">
            <div className="flex items-center gap-1.5 border-b border-[#1D2430] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B6B]/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#F5C451]/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#4FD68C]/70" />
              <span className="ml-2 font-mono text-xs text-[#748097]">
                pr-482.diff
              </span>
            </div>
            <div className="p-1">
              {DIFF_PREVIEW.map((line, i) => (
                <div
                  key={i}
                  className={`flex gap-3 px-3 py-0.5 font-mono text-[13px] leading-6 ${
                    line.type === "add"
                      ? "bg-[#4FD68C]/[0.08] text-[#4FD68C]"
                      : line.type === "del"
                      ? "bg-[#FF6B6B]/[0.08] text-[#FF6B6B]"
                      : "text-[#98A2B3]"
                  }`}
                >
                  <span className="w-3 select-none text-[#4A5468]">
                    {line.type === "add" ? "+" : line.type === "del" ? "−" : " "}
                  </span>
                  <span className="whitespace-pre">{line.code}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="relative z-10 font-mono text-xs text-[#4A5468]">
          // trusted by teams shipping faster reviews
        </p>
      </div>

      {/* Right: sign-in form styled as an editor tab */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#4FD68C] font-mono text-sm font-bold text-[#0B0E14]">
                {"</>"}
              </span>
              <span className="font-mono text-sm font-medium">
                AicoCodeReviewer
              </span>
            </Link>
          </div>

          <div className="overflow-hidden rounded-lg border border-[#1D2430] bg-[#10141C]">
            {/* tab bar */}
            <div className="flex items-center gap-1.5 border-b border-[#1D2430] bg-[#0D1017] px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B6B]/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#F5C451]/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#4FD68C]/70" />
              <span className="ml-2 font-mono text-xs text-[#748097]">
                sign-in.tsx
              </span>
            </div>

            {/* gutter + form */}
            <div className="flex">
              <div className="hidden select-none flex-col items-end gap-4 border-r border-[#1D2430] px-3 py-8 font-mono text-xs text-[#3A4353] sm:flex">
                {Array.from({ length: 8 }, (_, i) => (
                  <span key={i}>{i + 1}</span>
                ))}
              </div>

              <form className="flex-1 space-y-5 p-6 sm:p-8">
                <div className="space-y-1.5">
                  <h2 className="font-mono text-lg font-semibold">
                    Sign in
                  </h2>
                  <p className="text-sm text-[#748097]">
                    Pick up your reviews where you left off.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2 border-[#1D2430] bg-[#0D1017] text-[#E6E8EB] hover:bg-[#161B24] hover:text-[#E6E8EB]"
                >
                  <FaGithub className="h-4 w-4" />
                  Continue with GitHub
                </Button>

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#1D2430]" />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#4A5468]">
                    or
                  </span>
                  <div className="h-px flex-1 bg-[#1D2430]" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs text-[#98A2B3]">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    className="border-[#1D2430] bg-[#0D1017] text-[#E6E8EB] placeholder:text-[#4A5468] focus-visible:ring-[#4FD68C]/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs text-[#98A2B3]">
                      Password
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-[#748097] hover:text-[#4FD68C]"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••••"
                    className="border-[#1D2430] bg-[#0D1017] text-[#E6E8EB] placeholder:text-[#4A5468] focus-visible:ring-[#4FD68C]/40"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2 bg-[#4FD68C] text-[#0B0E14] hover:bg-[#3FC17B]"
                >
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <p className="text-center text-sm text-[#748097]">
                  No account yet?{" "}
                  <Link
                    href="/sign-up"
                    className="font-medium text-[#4FD68C] hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
















// import { Button } from "@/components/ui/button";
// import { HealthCheck } from "@/components/health-check";
// import Image from "next/image";
// import Link from "next/link";

// export default function Home() {
//   return (
//     <div className="flex min-h-screen items-center justify-center">
//      <div className="">
//       <h1>Welcome to AicoCodeReviewer!</h1>
//       <p>Start reviewing your code Now!</p>
//      </div>
//      <div className="flex gap-4">
//       <Button >
//         <Link href="/sign-in">Login</Link>
//       </Button>

//       <Button>
//         <Link href="/sign-up">Sign Up</Link>
//       </Button>

//      </div>
//      <HealthCheck />
//     </div>
//   );
// }
