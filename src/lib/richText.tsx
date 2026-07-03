// Shared **bold** / __underline__ mini-markup used by the story editor (Admin.tsx)
// and the public story card (Stories.tsx), so the preview and the live render match exactly.

export function renderFormattedText(text: string) {
  return text.split(/(\*\*[^*]+\*\*|__[^_]+__)/g).filter(Boolean).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("__") && part.endsWith("__")) return <u key={i}>{part.slice(2, -2)}</u>;
    return part;
  });
}

// Truncates without cutting a **bold**/__underline__ marker in half.
export function truncateText(text: string, length: number) {
  if (text.length <= length) return text;
  let truncated = text.slice(0, length);
  for (const marker of ["**", "__"]) {
    if (truncated.split(marker).length % 2 === 0) {
      truncated = truncated.slice(0, truncated.lastIndexOf(marker));
    }
  }
  return truncated.trimEnd() + "…";
}
