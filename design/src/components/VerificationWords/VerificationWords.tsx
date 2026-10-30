import type { Words } from "@shared/types";
import "./VerificationWords.css";

export interface VerificationWordsProps {
  words: Words;
  /** What to do with them, e.g. "Check that Alex's phone shows the same words." */
  prompt: string;
}

/** Six words, two rows of three. Both phones show the same words, or nothing goes forward (R2). */
export function VerificationWords({ words, prompt }: VerificationWordsProps) {
  return (
    <div className="verification-words">
      <p className="verification-words__prompt">{prompt}</p>
      <ol className="verification-words__list">
        {words.map((word, index) => (
          <li key={index}>{word}</li>
        ))}
      </ol>
    </div>
  );
}
