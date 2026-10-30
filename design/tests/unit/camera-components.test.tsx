import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { CameraStatusLine } from "@components/CameraStatusLine";
import { DestinationPill } from "@components/DestinationPill";
import { LastShotWell } from "@components/LastShotWell";
import { ZoomControl } from "@components/ZoomControl";
import { cameraStatusText, photos } from "@shared/plural";
import * as prototypeCopy from "../../src/prototype/copy/plural";

const html = (node: React.ReactNode) => renderToStaticMarkup(<>{node}</>);
const zero = { sent: 0, sending: 0, waitingInternet: 0, waitingWifi: 0, preparing: 0 };

describe("plural rules (D16)", () => {
  test("one photo, any other number of photos", () => {
    expect(photos(1)).toBe("1 photo");
    expect(photos(0)).toBe("0 photos");
    expect(photos(3)).toBe("3 photos");
  });

  test("the prototype's copy uses the same rules", () => {
    expect(prototypeCopy.photos(1)).toBe("1 photo");
  });
});

describe("cameraStatusText", () => {
  test("counts each state, leaving out the empty ones", () => {
    expect(cameraStatusText({ ...zero, sent: 4, sending: 1, waitingWifi: 2 })).toBe(
      "4 sent · 1 sending · 2 waiting for Wi-Fi",
    );
  });

  test("photos waiting for Wi-Fi are never called sending (D10)", () => {
    expect(cameraStatusText({ ...zero, waitingWifi: 3 })).toBe("3 waiting for Wi-Fi");
    expect(cameraStatusText({ ...zero, waitingInternet: 1, preparing: 1 })).toBe(
      "1 preparing · 1 waiting for internet",
    );
  });

  test("says so when there is nothing yet", () => {
    expect(cameraStatusText(zero)).toBe("No photos yet");
  });
});

describe("ZoomControl", () => {
  test("labels the levels the camera way and marks the chosen one", () => {
    const out = html(<ZoomControl options={[0.5, 1, 2]} value={1} onChange={() => {}} />);
    const labels = [...out.matchAll(/<span class="zoom-control__label">([^<]*)<\/span>/g)].map(
      (match) => match[1],
    );
    expect(labels).toEqual([".5", "1×", "2"]);
    expect(out.match(/aria-pressed="true"/g)).toHaveLength(1);
    expect(out).toMatch(/aria-label="Zoom 1×" aria-pressed="true"/);
  });
});

describe("camera controls", () => {
  test("the destination pill names where photos go", () => {
    expect(html(<DestinationPill name="Sarah" pulseKey={0} onPress={() => {}} />)).toContain(
      "Sending to Sarah",
    );
  });

  test("an empty well is not a button; a filled one opens the last photo", () => {
    expect(html(<LastShotWell image={null} dropKey={0} onOpen={() => {}} />)).not.toContain(
      "<button",
    );
    const filled = html(
      <LastShotWell
        image={{ src: "/images/coast.jpg", position: "30% 60%", zoom: 2 }}
        dropKey={1}
        onOpen={() => {}}
      />,
    );
    expect(filled).toContain('aria-label="Open the last photo"');
  });

  test("the status line is one button with the counts as its words", () => {
    const out = html(
      <CameraStatusLine counts={{ ...zero, sent: 1, sending: 2 }} onPress={() => {}} />,
    );
    expect(out).toMatch(/^<button type="button"/);
    expect(out).toContain("1 sent · 2 sending");
  });
});
