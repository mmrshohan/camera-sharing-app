// Discovers every component from its folder: <Name>/<Name>.meta.ts and <Name>/<Name>.examples.tsx.
// Adding a component never requires editing this file.
import type { ComponentEntry, ComponentMeta, Example } from "./types";

const metas = import.meta.glob<ComponentMeta>("../components/*/*.meta.ts", {
  eager: true,
  import: "meta",
});
const exampleSets = import.meta.glob<Example[]>("../components/*/*.examples.tsx", {
  eager: true,
  import: "examples",
});

const folderOf = (path: string) => path.split("/").at(-2) ?? path;

const examplesByFolder = new Map(
  Object.entries(exampleSets).map(([path, examples]) => [folderOf(path), examples]),
);

export const componentEntries: ComponentEntry[] = Object.entries(metas)
  .map(([path, meta]) => ({ meta, examples: examplesByFolder.get(folderOf(path)) ?? [] }))
  .sort((a, b) => a.meta.group - b.meta.group || a.meta.name.localeCompare(b.meta.name));

export function getComponent(id: string): ComponentEntry | undefined {
  return componentEntries.find((entry) => entry.meta.id === id);
}

export function libraryEntries(): ComponentEntry[] {
  return componentEntries.filter((entry) => entry.meta.status === "final");
}

export function labEntries(): ComponentEntry[] {
  return componentEntries.filter((entry) => entry.meta.status !== "final");
}
