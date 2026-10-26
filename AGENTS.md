# Codex operating instructions

**Phase: planning only.** Governance approval is not implementation approval.

1. Read [shared governance](docs/governance/README.md) and its mandatory core policies before work. Follow the same standards as Claude Code.
2. Read the relevant [product specifications](docs/README.md), current decisions and task acceptance criteria. Treat proposed choices as proposed.
3. Check the current user authorization and actual tools/model support. Plan the task, classify risk, assign roles and define evidence using [agent workflow](docs/governance/agent-workflow.md).
4. Until explicit implementation authorization: documentation, research and review only. No application code, scaffolding, installs, migrations, infrastructure or deployment.
5. Use native Codex tools actually exposed in this session. Delegate only within authorized scope; inspect each handoff and independently verify its work. Do not assume a model, reviewer, browser, CLI or device is available.
6. Apply [quality gates](docs/governance/quality-gates.md). Report unrun checks and missing hardware honestly; a generated report is not execution evidence.
7. Follow [engineering standards](docs/governance/engineering-standards.md) and the [repository plan](docs/governance/repository-plan.md). Preserve unrelated user changes; do not initialize Git or create proposed app directories in planning.
8. End with changed files, evidence, risks and any concrete approval needed. Never claim tests, privacy guarantees, scale or release readiness without evidence.

Markdown links are reading instructions, not an assumed recursive Codex import mechanism. Explicitly open the shared policies. Inspect applicable native instruction files/overrides when changing directories; surface conflicts using the shared authority rules. A scoped file must not silently weaken the project standards.

## Code Review Rules

Use the shared risk/review matrix. Treat wrong-recipient delivery, host-library writes, false delivery/save status, exposed keys and silent photo loss as blockers. Verify the reviewed artifact and test evidence; list actionable findings with file/line references.
