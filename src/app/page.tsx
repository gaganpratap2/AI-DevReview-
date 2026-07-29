import { Button } from "@/components/ui/button";
import { HealthCheck } from "@/components/health-check";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
     <div className="">
      <h1>Welcome to AicoCodeReviewer!</h1>
      <p>Start reviewing your code Now!</p>
     </div>
     <div className="flex gap-4">
      <Button >
        <Link href="/sign-in">Login</Link>
      </Button>

      <Button>
        <Link href="/sign-up">Sign Up</Link>
      </Button>

     </div>
     <HealthCheck />
    </div>
  );
}
