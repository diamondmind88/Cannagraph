import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({ eyebrow, title, children, className, ...props }: HTMLAttributes<HTMLElement> & { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <article className={cn("min-h-56 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_1px_0_rgba(23,26,24,0.04)]", className)} {...props}>
      <p className="font-mono text-xs tracking-wider text-[var(--muted)]">{eyebrow}</p>
      <h3 className="mt-10 text-xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-3 leading-7 text-[var(--muted)]">{children}</p>
    </article>
  );
}
