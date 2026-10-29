import type { Words } from "@shared/types";
import type { Example } from "@workspace/types";
import { VerificationWords } from "./VerificationWords";

const words: Words = ["maple", "river", "candle", "orbit", "velvet", "sparrow"];

export const examples: Example[] = [
  {
    id: "words",
    title: "On Sarah's phone",
    state: "words",
    render: () => (
      <div className="ex-phone">
        <VerificationWords words={words} prompt="Check that Alex's phone shows the same words." />
      </div>
    ),
  },
];
