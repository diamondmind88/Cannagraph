import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type BadgeTone = "supported" | "disputed" | "unresolved";

const toneStyles: Record<BadgeTone, string> = {
  supported: "border-[#9fb6aa] bg-[var(--accent-soft)] text-[var(--accent)]",
  disputed: "border-[#d5b990] bg-[#f5ead9] text-[var(--warning)]",
  unresolved: "border-[var(--line)] bg-[var(--surface)] text-[var(--muted)]",
};

export function Badge({ className, tone = "unresolved", ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return <span className={cn("inline-flex rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wider", toneStyles[tone], className)} {...props} />;
}
