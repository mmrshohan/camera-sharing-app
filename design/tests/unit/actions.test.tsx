import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { Button } from "@components/Button";
import { ChoiceChips } from "@components/ChoiceChips";
import { IconButton } from "@components/IconButton";
import { TextField } from "@components/TextField";
import { Toggle } from "@components/Toggle";

const html = (node: React.ReactNode) => renderToStaticMarkup(<>{node}</>);
const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

describe("Button", () => {
  test("is a native button named by its words", () => {
    const out = html(<Button variant="filled">Continue</Button>);
    expect(out).toMatch(/^<button type="button"/);
    expect(out).toContain(">Continue<");
  });

  test("loading is busy and keeps its name; disabled is aria-disabled", () => {
    const loading = html(
      <Button variant="filled" loading>
        Continue
      </Button>,
    );
    expect(loading).toContain('aria-busy="true"');
    expect(loading).toContain(">Continue<");
    expect(
      html(
        <Button variant="tinted" disabled>
          Continue
        </Button>,
      ),
    ).toContain('aria-disabled="true"');
  });
});

describe("IconButton", () => {
  test("is named by its label, since it shows no words", () => {
    const out = html(<IconButton icon="close" label="Close" />);
    expect(out).toContain('aria-label="Close"');
    expect(out).toContain("icon-button--on-light");
  });
});

describe("Toggle", () => {
  test("is a switch that reports its state and is named by its label", () => {
    const out = html(
      <Toggle checked label="Save to Photos" description="New photos only" onChange={() => {}} />,
    );
    expect(out).toContain('role="switch"');
    expect(out).toContain('aria-checked="true"');
    const labelledBy = /aria-labelledby="([^"]+)"/.exec(out)?.[1] ?? "";
    expect(out).toMatch(new RegExp(`id="${escape(labelledBy)}"[^>]*>Save to Photos<`));
    const describedBy = /aria-describedby="([^"]+)"/.exec(out)?.[1] ?? "";
    expect(out).toMatch(new RegExp(`id="${escape(describedBy)}"[^>]*>New photos only<`));
  });
});

describe("TextField", () => {
  test("an invalid field says why, through a polite live region", () => {
    const out = html(
      <TextField
        label="Username"
        value="sa"
        prefix="@"
        state="invalid"
        message="Use at least 3 characters."
        onChange={() => {}}
      />,
    );
    expect(out).toContain('aria-invalid="true"');
    const id = /aria-describedby="([^"]+)"/.exec(out)?.[1] ?? "";
    expect(id).not.toBe("");
    expect(out).toMatch(new RegExp(`aria-live="polite"[^>]*>(?:<[^>]+>)*<p id="${escape(id)}"`));
    expect(out).toContain("Use at least 3 characters.");
  });

  test("labels the input with a real label element", () => {
    const out = html(<TextField label="Username" value="" onChange={() => {}} />);
    const id = /<input[^>]*id="([^"]+)"/.exec(out)?.[1] ?? "";
    expect(out).toContain(`for="${id}"`);
  });
});

describe("ChoiceChips", () => {
  const options = [
    { id: "photos", label: "Photos didn't arrive" },
    { id: "connect", label: "Couldn't connect" },
    { id: "other", label: "Something else" },
  ];

  test("is a radio group with one tab stop on the selected chip", () => {
    const out = html(
      <ChoiceChips
        label="What went wrong?"
        options={options}
        value="connect"
        onChange={() => {}}
      />,
    );
    expect(out).toContain('role="radiogroup"');
    expect(out).toContain('aria-label="What went wrong?"');
    expect(out.match(/role="radio"/g)).toHaveLength(3);
    expect(out.match(/tabindex="0"/g)).toHaveLength(1);
    expect(out).toMatch(/aria-checked="true" tabindex="0"[^>]*>(?:<[^>]+>)*Couldn&#x27;t connect/);
  });

  test("with nothing chosen, the first chip takes the tab stop", () => {
    const out = html(
      <ChoiceChips label="What went wrong?" options={options} value={null} onChange={() => {}} />,
    );
    expect(out).not.toContain('aria-checked="true"');
    expect(out).toMatch(/tabindex="0"[^>]*>(?:<[^>]+>)*Photos didn/);
  });
});
