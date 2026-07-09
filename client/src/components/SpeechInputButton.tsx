import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface SpeechInputButtonProps {
  onTranscript: (transcript: string) => void;
  label?: string;
}

export default function SpeechInputButton({ onTranscript, label = "Dictate" }: SpeechInputButtonProps) {
  const { isListening, isSupported, start } = useSpeechRecognition(
    ({ transcript }) => {
      if (!transcript) {
        toast.info("No speech was detected.");
        return;
      }
      onTranscript(transcript);
      toast.success("Speech added to the text field.");
    },
    (message) => toast.error(message),
  );

  return (
    <button
      type="button"
      onClick={start}
      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all duration-200"
      style={{
        background: isListening ? "rgba(239,68,68,0.16)" : "rgba(14,165,233,0.12)",
        border: `1px solid ${isListening ? "rgba(239,68,68,0.34)" : "rgba(14,165,233,0.28)"}`,
        color: isListening ? "#FCA5A5" : "#7DD3FC",
      }}
      title={isSupported ? "Click and speak to fill this text field" : "Speech recognition is not supported here"}
    >
      {isListening ? <MicOff size={13} /> : <Mic size={13} />}
      {isListening ? "Listening..." : label}
    </button>
  );
}
