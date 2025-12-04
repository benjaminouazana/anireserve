export function LoadingSpinner({ size = "md", text }: { size?: "sm" | "md" | "lg"; text?: string }) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-solid border-[#2FB190] border-t-transparent`}
        role="status"
        aria-label="Chargement"
      />
      {text && (
        <p className="text-sm text-zinc-600 animate-pulse">{text}</p>
      )}
    </div>
  );
}

export function LoadingOverlay({ text = "Chargement..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-100 animate-pulse">
      <div className="space-y-4">
        <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
        <div className="h-4 bg-zinc-200 rounded w-1/2"></div>
        <div className="h-20 bg-zinc-200 rounded"></div>
      </div>
    </div>
  );
}




