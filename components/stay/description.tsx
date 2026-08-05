export function Description({
  title,
  description,
  historicNote,
  historicNoteLabel,
}: {
  title: string;
  description: string;
  historicNote: string;
  historicNoteLabel: string;
}) {
  return (
    <div>
      <h2 className="font-serif text-xl font-semibold text-foreground">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">{description}</p>
      <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
        <span className="text-xs font-medium tracking-wide text-primary uppercase">
          {historicNoteLabel}
        </span>
        <p className="mt-1 font-serif text-base text-foreground">{historicNote}</p>
      </div>
    </div>
  );
}
