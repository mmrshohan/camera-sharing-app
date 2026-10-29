import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { Avatar } from "@components/Avatar";
import { EmptyState } from "@components/EmptyState";
import { GroupedList } from "@components/GroupedList";
import { ListRow } from "@components/ListRow";
import { SectionHeader } from "@components/SectionHeader";
import { TopBar } from "@components/TopBar";

const html = (node: React.ReactNode) => renderToStaticMarkup(<>{node}</>);
const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

describe("ListRow", () => {
  test("with a toggle, the whole row is one switch named by its title", () => {
    const out = html(
      <ListRow
        title="Save to Photos"
        subtitle="New photos only"
        icon="photos"
        trailing={{ kind: "toggle", checked: true, onChange: () => {} }}
      />,
    );
    expect(out.match(/role="switch"/g)).toHaveLength(1);
    expect(out).toMatch(/^<button type="button" role="switch" aria-checked="true"/);
    const id = /aria-labelledby="([^"]+)"/.exec(out)?.[1] ?? "";
    expect(out).toMatch(new RegExp(`id="${escape(id)}"[^>]*>Save to Photos<`));
  });

  test("a destructive row is drawn in the danger color", () => {
    expect(html(<ListRow title="Delete account" destructive onPress={() => {}} />)).toContain(
      "list-row--destructive",
    );
    const css = readFileSync(
      new URL("../../src/components/ListRow/ListRow.css", import.meta.url),
      "utf8",
    );
    expect(css).toMatch(/\.list-row--destructive \{[^}]*var\(--color-danger\)/);
  });

  test("a row that opens something is a button; a plain row is not", () => {
    expect(
      html(<ListRow title="Devices" trailing={{ kind: "chevron" }} onPress={() => {}} />),
    ).toMatch(/^<button type="button"/);
    expect(
      html(<ListRow title="Version" trailing={{ kind: "value", text: "1.0" }} />),
    ).not.toContain("<button");
  });
});

describe("Avatar", () => {
  test("shows initials, and is named unless decorative", () => {
    const sarah = html(<Avatar name="Sarah" />);
    expect(sarah).toContain(">S<");
    expect(sarah).toContain('role="img"');
    expect(sarah).toContain('aria-label="Sarah"');
    expect(html(<Avatar name="Sarah Khan" />)).toContain(">SK<");
    expect(html(<Avatar name="@alex" decorative />)).toMatch(/aria-hidden="true"[^>]*>A</);
  });
});

describe("EmptyState", () => {
  test("offers at most one way forward", () => {
    const out = html(
      <EmptyState
        title="No photos yet"
        body="Photos from a camera you borrow arrive here."
        action={{ label: "Borrow a camera", onPress: () => {} }}
      />,
    );
    expect(out.match(/<button/g)).toHaveLength(1);
  });
});

describe("TopBar and headers", () => {
  test("the bar has one level-1 heading, expanded or collapsed", () => {
    for (const collapsed of [false, true]) {
      const out = html(<TopBar title="Your photos" collapsed={collapsed} />);
      expect(out.match(/<h1/g)).toHaveLength(1);
      expect(out).toMatch(/<h1[^>]*>Your photos<\/h1>/);
    }
  });

  test("section and group headers are headings screen readers can jump to", () => {
    expect(html(<SectionHeader title="Today" detail="12 photos" />)).toMatch(/<h2[^>]*>Today</);
    const group = html(
      <GroupedList header="Photos" footer="Stays on this phone.">
        <ListRow title="Save to Photos" />
      </GroupedList>,
    );
    expect(group).toMatch(/<h2[^>]*>Photos<\/h2>/);
    expect(group).toContain("<li");
  });
});
