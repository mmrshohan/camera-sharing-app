import { describe, expect, it } from "vitest";
import { groupApprovals } from "@workspace/approvals";
import { componentEntries, getComponent, labEntries, libraryEntries } from "@workspace/registry";

const semver = /^\d+\.\d+\.\d+$/;
const kebab = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

describe("component registry", () => {
  it("finds the components", () => {
    expect(componentEntries.length).toBeGreaterThan(0);
    expect(getComponent("icon")?.meta.name).toBe("Icon");
    expect(getComponent("nope")).toBeUndefined();
  });

  it.each(componentEntries.map((e) => [e.meta.id, e] as const))(
    "%s has a semver version",
    (_id, entry) => {
      expect(entry.meta.version).toMatch(semver);
    },
  );

  it.each(componentEntries.map((e) => [e.meta.id, e] as const))(
    "%s shows every state it declares",
    (_id, entry) => {
      const shown = new Set(entry.examples.map((x) => x.state));
      for (const state of entry.meta.states) expect(shown, state).toContain(state);
    },
  );

  it("promotion requires owner approval", () => {
    const approved = new Set(groupApprovals.map((a) => a.group));
    for (const { meta } of componentEntries) {
      if (meta.status === "final") expect(approved, meta.id).toContain(meta.group);
    }
  });

  it("uses unique kebab-case ids", () => {
    const ids = componentEntries.map((e) => e.meta.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(kebab);
  });

  it("splits final components from drafts and reviews", () => {
    expect(libraryEntries().every((e) => e.meta.status === "final")).toBe(true);
    expect(labEntries().every((e) => e.meta.status !== "final")).toBe(true);
    expect(libraryEntries().length + labEntries().length).toBe(componentEntries.length);
  });
});
