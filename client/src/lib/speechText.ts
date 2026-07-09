export function appendTranscript(currentValue: string, transcript: string) {
  const cleanedTranscript = transcript.trim();
  if (!cleanedTranscript) return currentValue;

  const cleanedCurrent = currentValue.trim();
  if (!cleanedCurrent) return cleanedTranscript;

  return `${cleanedCurrent} ${cleanedTranscript}`;
}
