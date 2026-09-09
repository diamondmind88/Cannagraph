"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
      <p className="font-mono text-xs uppercase tracking-wider text-[var(--danger)]">Application error</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">This research view could not be loaded.</h1>
      <p className="mt-4 text-[var(--muted)]">No records were changed. You can safely retry the request.</p>
      <button onClick={reset} className="mt-8 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white">
        Try again
      </button>
    </main>
  );
}
