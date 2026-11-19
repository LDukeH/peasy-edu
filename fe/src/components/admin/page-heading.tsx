export function PageHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl leading-10 text-ink">{title}</h1>
      <p className="text-sm leading-[22px] text-text-muted">{subtitle}</p>
    </div>
  );
}
