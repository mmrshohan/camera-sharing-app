import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { LiveActivity } from "@components/LiveActivity";
import { PermissionPrompt, permissionCopy } from "@components/PermissionPrompt";
import { ProgressNotification } from "@components/ProgressNotification";

const html = (node: React.ReactNode) => renderToStaticMarkup(<>{node}</>);

describe("PermissionPrompt", () => {
  test("uses each platform's own words", () => {
    expect(permissionCopy("ios", "camera", "Camera Sharing").title).toBe(
      "“Camera Sharing” Would Like to Access the Camera",
    );
    expect(permissionCopy("ios", "photosAddOnly", "Camera Sharing").title).toContain(
      "Would Like to Add to Your Photos",
    );
    expect(permissionCopy("ios", "camera", "Camera Sharing").answers).toEqual([
      "Don’t Allow",
      "Allow",
    ]);
    expect(permissionCopy("android", "camera", "Camera Sharing")).toMatchObject({
      title: "Allow Camera Sharing to take pictures and record video?",
      answers: ["While using the app", "Only this time", "Don’t allow"],
    });
  });

  test("Android never asks to save photos: rendering that prompt is a development error", () => {
    expect(() =>
      html(
        <PermissionPrompt
          platform="android"
          kind="photosAddOnly"
          appName="Camera Sharing"
          purpose=""
          onAllow={() => {}}
          onDeny={() => {}}
          container={null}
        />,
      ),
    ).toThrow("Android saves to MediaStore without a permission prompt");
  });
});

describe("LiveActivity and ProgressNotification", () => {
  test("the Live Activity counts photos and says when all have arrived", () => {
    const arriving = html(
      <LiveActivity variant="lockScreen" from="Alex" received={14} arriving={2} state="arriving" />,
    );
    expect(arriving).toContain("Alex’s camera");
    expect(arriving).toContain("14 photos");
    expect(arriving).toContain("2 on the way");
    expect(
      html(
        <LiveActivity variant="lockScreen" from="Alex" received={16} arriving={0} state="done" />,
      ),
    ).toContain("All photos arrived");
  });

  test("the notification shows real progress, or none", () => {
    const out = html(<ProgressNotification from="Alex" received={1} arriving={2} progress={0.5} />);
    expect(out).toContain("1 photo · 2 on the way");
    expect(out).toContain('aria-valuenow="50"');
    expect(
      html(<ProgressNotification from="Alex" received={3} arriving={0} progress={null} />),
    ).not.toContain("progressbar");
  });
});
