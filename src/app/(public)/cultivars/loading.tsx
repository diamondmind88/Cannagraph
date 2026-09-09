export default function CultivarsLoading() {
  return <div className="mx-auto min-h-[70vh] max-w-[90rem] animate-pulse px-5 py-16 sm:px-8 lg:px-12"><div className="h-5 w-32 rounded bg-[var(--line)]" /><div className="mt-7 h-16 max-w-xl rounded bg-[var(--line)]" /><div className="mt-14 space-y-1">{[1, 2, 3].map((item) => <div className="h-24 bg-[var(--surface-muted)]" key={item} />)}</div></div>;
}
