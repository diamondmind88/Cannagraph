import { cn } from "@/lib/cn";

export function SearchBox({ compact = false, defaultValue = "" }: { compact?: boolean; defaultValue?: string }) {
  return (
    <form action="/search" className={cn("relative", compact ? "w-full max-w-md" : "w-full max-w-2xl")} role="search">
      <label htmlFor={compact ? "site-search" : "hero-search"} className="sr-only">
        Search Cannagraph
      </label>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--muted)]">
        <path d="m21 21-4.4-4.4m2.4-5.1a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      </svg>
      <input
        id={compact ? "site-search" : "hero-search"}
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="Search cultivars, breeders, aliases…"
        className={cn(
          "w-full rounded-full border border-[var(--line-strong)] bg-[var(--surface)] pl-12 pr-28 text-[var(--ink)] shadow-[0_12px_35px_rgba(33,37,34,0.07)] placeholder:text-[var(--muted-light)]",
          compact ? "h-11 text-sm" : "h-14 text-base sm:h-16 sm:text-lg",
        )}
      />
      <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-[var(--ink)] px-5 py-2 text-sm font-medium text-white transition hover:bg-[var(--accent)]">
        Search
      </button>
    </form>
  );
}
