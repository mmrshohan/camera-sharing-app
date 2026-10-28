import { ComponentCard } from "../ComponentCard";
import { labEntries } from "../registry";
import { groupNames, type ComponentGroup } from "../types";

const groups: ComponentGroup[] = [1, 2, 3, 4];

export function LabIndex() {
  const entries = labEntries();
  return (
    <section>
      <h1 className="ws-title">Lab</h1>
      <p className="ws-lede">
        Drafts and components in review. When the owner approves a group, its components move to the
        Library together.
      </p>
      {entries.length === 0 && (
        <div className="ws-empty">
          <p>Nothing is in the Lab right now.</p>
        </div>
      )}
      {groups.map((group) => {
        const inGroup = entries.filter((e) => e.meta.group === group);
        if (inGroup.length === 0) return null;
        return (
          <section key={group} className="ws-group">
            <h2 className="ws-group__title">
              {group} · {groupNames[group]}
            </h2>
            <div className="ws-grid">
              {inGroup.map((entry) => (
                <ComponentCard key={entry.meta.id} entry={entry} base="lab" />
              ))}
            </div>
          </section>
        );
      })}
    </section>
  );
}
