import { readdirSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { componentId, scanUsage } from "../../scripts/build-usage";
import { getComponent } from "../../src/workspace/registry";

describe("scanUsage", () => {
  test("maps a component import to the screen that uses it", () => {
    const files = [
      { path: "screens/Home.tsx", text: "import { RingButton } from '@components/RingButton';" },
    ];
    expect(scanUsage(files)).toEqual({ "ring-button": ["screens/Home"] });
  });

  test("reads double quotes and multi-line imports, listing each screen once, sorted", () => {
    const files = [
      {
        path: "screens/Camera.tsx",
        text: 'import {\n  Shutter,\n  type ShutterProps,\n} from "@components/Shutter";\nimport { Icon } from "@components/Icon";',
      },
      {
        path: "panels/Session.tsx",
        text: 'import { Icon } from "@components/Icon";\nimport { Icon as Glyph } from "@components/Icon";',
      },
    ];
    expect(scanUsage(files)).toEqual({
      icon: ["panels/Session", "screens/Camera"],
      shutter: ["screens/Camera"],
    });
  });

  test("ignores type-only imports, which draw nothing on screen", () => {
    const files = [
      {
        path: "model/world.ts",
        text: 'import type { RingButtonProps } from "@components/RingButton";',
      },
    ];
    expect(scanUsage(files)).toEqual({});
  });
});

test("every component folder's kebab name is a registered id, so where-used can find it", () => {
  const folders = readdirSync(new URL("../../src/components/", import.meta.url), {
    withFileTypes: true,
  }).filter((entry) => entry.isDirectory());
  expect(folders.length).toBeGreaterThan(0);
  for (const folder of folders) {
    expect(getComponent(componentId(folder.name)), folder.name).toBeDefined();
  }
});
