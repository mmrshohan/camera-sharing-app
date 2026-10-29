import { useState } from "react";
import { ListRow } from "@components/ListRow";
import type { Example } from "@workspace/types";
import { GroupedList } from "./GroupedList";

function PhotosGroup() {
  const [save, setSave] = useState(true);
  const [wifiOnly, setWifiOnly] = useState(false);
  return (
    <GroupedList header="Photos" footer="Photos stay in this app until they are saved to Photos.">
      <ListRow
        title="Save to Photos"
        icon="photos"
        trailing={{ kind: "toggle", checked: save, onChange: setSave }}
      />
      <ListRow
        title="Send over Wi-Fi only"
        icon="wifi"
        trailing={{ kind: "toggle", checked: wifiOnly, onChange: setWifiOnly }}
      />
      <ListRow title="Storage" icon="storage" trailing={{ kind: "value", text: "1.2 GB" }} />
    </GroupedList>
  );
}

export const examples: Example[] = [
  {
    id: "photos",
    title: "With a header and a footer",
    state: "header and footer",
    render: () => (
      <div className="ex-phone ex-phone--framed">
        <PhotosGroup />
      </div>
    ),
  },
  {
    id: "account",
    title: "Rows only",
    state: "rows only",
    render: () => (
      <div className="ex-phone ex-phone--framed">
        <GroupedList>
          <ListRow title="Username" trailing={{ kind: "value", text: "@sarah" }} />
          <ListRow title="Devices" trailing={{ kind: "chevron" }} onPress={() => {}} />
          <ListRow title="Delete account" destructive onPress={() => {}} />
        </GroupedList>
      </div>
    ),
  },
];
