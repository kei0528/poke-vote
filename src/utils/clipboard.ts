export function copyToClipboard({
  text,
  onCopied,
  onCopyFailed,
}: {
  text: string;
  onCopied?: () => void;
  onCopyFailed?: () => void;
}): void {
  navigator.clipboard
    .writeText(text)
    .then(() => void onCopied?.())
    .catch(() => void onCopyFailed?.());
}
