import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4">
      <h1 className="text-5xl font-bold text-primary sm:text-6xl">404</h1>
      <h2 className="mt-4 text-lg font-semibold text-slate-900 sm:text-xl">
        Page Not Found
      </h2>
      <p className="mt-2 text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="mt-8">
        <Button>Go Home</Button>
      </Link>
    </div>
  );
}
