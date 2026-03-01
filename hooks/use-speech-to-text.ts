"use client";

import { useState, useCallback, useRef } from "react";

export const useSpeechToText = (onTranscript: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null); // Reference to keep track of the object

  const startListening = useCallback(() => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Bhai, aapka browser voice typing support nahi karta. Chrome use karein.");
      return;
    }

    // Agar pehle se chal raha hai toh stop karke naya start karein
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition; // Store reference

    recognition.lang = 'en-US'; 
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    recognition.onerror = (event: any) => {
      // "aborted" error ko console par silent rakhein kyunke ye user action se bhi ho sakta hai
      if (event.error !== 'aborted') {
        console.error("Speech error:", event.error);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Failed to start recognition:", e);
      setIsListening(false);
    }
  }, [onTranscript]);

  return { isListening, startListening };
};