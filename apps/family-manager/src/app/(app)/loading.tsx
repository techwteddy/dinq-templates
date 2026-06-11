export default function Loading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-48 rounded-xl bg-card-border/50" />
      <div className="h-4 w-64 rounded-lg bg-card-border/30" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-card-border/20" />
        ))}
      </div>
    </div>
  );
}
