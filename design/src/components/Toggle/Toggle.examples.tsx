import { useState } from "react";
import type { Example } from "@workspace/types";
import { Toggle } from "./Toggle";

function Live({
  initial,
  label,
  description,
}: {
  initial: boolean;
  label: string;
  description?: string;
}) {
  const [checked, setChecked] = useState(initial);
  return (
    <div className="ex-phone">
      {description === undefined ? (
        <Toggle checked={checked} onChange={setChecked} label={label} />
      ) : (
        <Toggle checked={checked} onChange={setChecked} label={label} description={description} />
      )}
    </div>
  );
}

export const examples: Example[] = [
  {
    id: "off",
    title: "Off",
    state: "off",
    render: () => <Live initial={false} label="Send over Wi-Fi only" />,
  },
  {
    id: "on",
    title: "On",
    state: "on",
    render: () => <Live initial label="Save to Photos" />,
  },
  {
    id: "description",
    title: "With a description",
    state: "on",
    render: () => (
      <Live initial label="Save to Photos" description="New photos save here as they arrive." />
    ),
  },
];
