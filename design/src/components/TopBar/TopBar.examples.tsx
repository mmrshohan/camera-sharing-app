import { Avatar } from "@components/Avatar";
import { IconButton } from "@components/IconButton";
import type { Example } from "@workspace/types";
import { TopBar } from "./TopBar";

function AccountButton() {
  return (
    <button type="button" className="ex-avatar-button" aria-label="Account">
      <Avatar name="Sarah" size={36} decorative />
    </button>
  );
}

export const examples: Example[] = [
  {
    id: "expanded",
    title: "Expanded, with the account trailing",
    state: "expanded",
    render: () => (
      <div className="ex-phone ex-phone--framed">
        <TopBar title="Your photos" trailing={<AccountButton />} />
      </div>
    ),
  },
  {
    id: "collapsed",
    title: "Collapsed, after scrolling",
    state: "collapsed",
    render: () => (
      <div className="ex-phone ex-phone--framed">
        <TopBar title="Settings" collapsed leading={<IconButton icon="back" label="Back" />} />
      </div>
    ),
  },
];
