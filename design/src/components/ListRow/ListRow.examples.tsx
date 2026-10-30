import { useState } from "react";
import { StatusLabel } from "@components/StatusLabel";
import type { Example } from "@workspace/types";
import { ListRow } from "./ListRow";

function SwitchRow() {
  const [on, setOn] = useState(true);
  return (
    <ListRow
      title="Save to Photos"
      subtitle="New photos save here as they arrive."
      icon="photos"
      trailing={{ kind: "toggle", checked: on, onChange: setOn }}
    />
  );
}

const phone = (row: React.ReactNode) => <div className="ex-phone ex-surface">{row}</div>;

export const examples: Example[] = [
  {
    id: "chevron",
    title: "Opens a page",
    state: "chevron",
    render: () =>
      phone(
        <ListRow
          title="Devices"
          subtitle="2 phones"
          icon="devices"
          trailing={{ kind: "chevron" }}
          onPress={() => {}}
        />,
      ),
  },
  {
    id: "value",
    title: "Shows a value",
    state: "value",
    render: () =>
      phone(
        <ListRow title="Storage" icon="storage" trailing={{ kind: "value", text: "1.2 GB" }} />,
      ),
  },
  {
    id: "toggle",
    title: "A switch: the whole row",
    state: "toggle",
    render: () => phone(<SwitchRow />),
  },
  {
    id: "label",
    title: "With a status label",
    state: "label",
    render: () =>
      phone(
        <ListRow
          title="Alex's iPhone"
          subtitle="Lending its camera"
          icon="devices"
          trailing={{ kind: "label", label: <StatusLabel kind="live">Live</StatusLabel> }}
        />,
      ),
  },
  {
    id: "destructive",
    title: "Destructive",
    state: "destructive",
    render: () =>
      phone(<ListRow title="Delete account" icon="delete" destructive onPress={() => {}} />),
  },
];
