"use client";

import { useState, useEffect } from "react";

const useTypewriter = (
  phrases: string[],
  typingSpeed = 150,
  deletingSpeed = 75,
  pauseDuration = 1000,
) => {
  const [currentText, setCurrentText] = useState("");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      if (currentText === phrases[currentPhraseIndex]) {
        // Pause before starting to delete
        timeout = setTimeout(() => setIsTyping(false), pauseDuration);
      } else {
        // Type the next character
        timeout = setTimeout(() => {
          setCurrentText(
            phrases[currentPhraseIndex].slice(0, currentText.length + 1),
          );
        }, typingSpeed);
      }
    } else {
      if (currentText === "") {
        // Move to the next phrase
        setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        setIsTyping(true);
      } else {
        // Delete the last character
        timeout = setTimeout(() => {
          setCurrentText((prevText) => prevText.slice(0, -1));
        }, deletingSpeed);
      }
    }

    return () => clearTimeout(timeout);
  }, [
    currentText,
    currentPhraseIndex,
    isTyping,
    phrases,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
  ]);

  return currentText;
};

export default function Typewriter({ phrases }: { phrases: string[] }) {
  const text = useTypewriter(phrases);

  return (
    <h1 className="text-2xl font-bold leading-none tracking-tight text-gray-600 sm:text-6xl">
      {text}
      <span className="animate-cursor-blink">|</span>
    </h1>
  );
}
