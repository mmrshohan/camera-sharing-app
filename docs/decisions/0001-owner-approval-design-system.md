# 0001 — Owner approval: design-system workspace and app prototype

Recorded with the repository's [owner approval record template](../governance/templates.md#owner-approval-record).

```text
Approval ID / date:
  0001 · 28 October 2026

Actual human approver and source message/issue/PR reference:
  The owner (co-founder), in the Claude Code session chat on 28 October 2026.
  Approval message: "Approved. Write the build plan and start."
  Earlier scoped instructions in the same session: build the design system "from scratch", "do it very
  properly"; "build each component … prototyping … finalize … keep it like previous and now … this is a
  design system"; the work is stored in the repository and run on localhost with a /prototype section.
  Answers given through the session's question prompt: Library 1.0 is reviewed in four groups; approving
  the design document also authorizes building it.

Approved artifacts/versions or bounded proposal:
  docs/design/2026-10-28-design-system-design.md (status: approved 28 October 2026), and the build plan
  docs/work/2026-10-28-design-system-build-plan.md that implements it.

Scope: governance adoption | architecture acceptance | M0 | other development | release
  Other development: the web design-system workspace and clickable app prototype in design/.

Actions/environments/paid commitments explicitly permitted:
  Create design/, docs/design/ content and this record; install the dependencies listed in the design
  document's section 12, each only after its review is written in design/DEPENDENCIES.md; run the
  workspace and its tests on 127.0.0.1; commit on a branch; push that branch and open a pull request
  that the owner merges. No paid commitments.

Exclusions and prerequisites:
  Not permitted: native iOS or Android apps, backend or relay services, deployment or hosting beyond
  127.0.0.1, paid services, direct changes to main, publishing beyond the repository's pull request.
  Prerequisite for each install: a written dependency review. Prerequisite for each Library group's
  promotion to final: the owner's review of that group, recorded in design/src/workspace/approvals.ts.

Expiry or milestone boundary:
  Ends when the design-system 1.0 pull request is merged or closed. Later releases need their own
  approval or a standing instruction recorded in a new record.

Recording actor / verification of the source:
  Claude (AI agent, coordinator role), transcribing from the session transcript. This is a faithful
  summary, not a signature; the owner confirms it by merging the pull request that contains it.
```
