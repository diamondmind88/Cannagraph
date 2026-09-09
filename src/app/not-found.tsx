import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
      <p className="font-mono text-xs uppercase tracking-wider text-[var(--muted)]">404 / Not found</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">That research record is not in the archive.</h1>
      <Link href="/" className="mt-8 inline-block text-sm font-semibold text-[var(--accent)] underline underline-offset-4">
        Return to Cannagraph
      </Link>
    </main>
  );
}
