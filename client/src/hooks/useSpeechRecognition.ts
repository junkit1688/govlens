import { useMemo, useRef, useState } from "react";

type SpeechRecognitionResultLike = {
  [index: number]: { transcript: string };
};

type SpeechRecognitionEventLike = {
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export type SpeechResult = {
  transcript: string;
};

export function useSpeechRecognition(onResult: (result: SpeechResult) => void, onError: (message: string) => void) {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [isListening, setIsListening] = useState(false);

  const SpeechRecognitionApi = useMemo(
    () => window.SpeechRecognition || window.webkitSpeechRecognition,
    [],
  );

  const isSupported = Boolean(SpeechRecognitionApi);

  const stop = () => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  };

  const start = () => {
    if (!SpeechRecognitionApi) {
      onError("Speech recognition is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    if (isListening) {
      stop();
      return;
    }

    const recognition = new SpeechRecognitionApi();
    recognition.lang = "en-MY";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      recognitionRef.current = null;
      setIsListening(false);
    };
    recognition.onerror = () => {
      onError("Speech recognition could not capture audio. Please try again.");
      stop();
    };
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || "")
        .join(" ")
        .trim();
      onResult({ transcript });
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return { isSupported, isListening, start, stop };
}
