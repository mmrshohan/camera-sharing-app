import { useState } from "react";
import type { Example } from "@workspace/types";
import { ChoiceChips } from "./ChoiceChips";

type Reason = "photos" | "connect" | "other";

const reasons: { id: Reason; label: string }[] = [
  { id: "photos", label: "Photos didn't arrive" },
  { id: "connect", label: "Couldn't connect" },
  { id: "other", label: "Something else" },
];

function Live({ initial }: { initial: Reason | null }) {
  const [value, setValue] = useState<Reason | null>(initial);
  return (
    <ChoiceChips label="What went wrong?" options={reasons} value={value} onChange={setValue} />
  );
}

export const examples: Example[] = [
  {
    id: "none",
    title: "Nothing chosen",
    state: "nothing chosen",
    render: () => <Live initial={null} />,
  },
  { id: "chosen", title: "One chosen", state: "chosen", render: () => <Live initial="connect" /> },
];
