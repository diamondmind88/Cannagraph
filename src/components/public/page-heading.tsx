import { Badge } from "@/components/ui/badge";

export function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <header className="border-b border-[var(--line)] pb-10 sm:pb-14">
      <Badge>{eyebrow}</Badge>
      <h1 className="mt-6 max-w-4xl text-balance text-4xl font-semibold leading-none tracking-[-0.045em] sm:text-6xl">{title}</h1>
      <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">{description}</p>
    </header>
  );
}
