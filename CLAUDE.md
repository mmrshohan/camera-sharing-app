# Claude Code operating instructions

**Phase: planning only.** Governance approval is not implementation approval.

The common entry policy is imported below; read its mandatory core policies before work:

@docs/governance/README.md

1. Follow the shared constitution, workflow, engineering standards and quality gates. Read the relevant product specifications and decisions; proposed choices are not approved architecture.
2. Check current user authorization, installed-tool support and the session's actual model before routing work. Use only supported delegation/model controls; do not infer availability from names such as Opus, Sonnet or Fable.
3. Documentation, research and review are allowed now. Application code, scaffolding, installs, migrations, infrastructure and deployment require explicit implementation authorization.
4. Use the shared risk matrix and handoff format. Critical work needs an independent reviewer. Inspect delegated outputs and verify evidence before reporting completion.
5. Preserve unrelated user changes. Do not initialize Git or instantiate the proposed repository layout during planning. Report unrun checks, unknowns and unavailable hardware.
6. End with changed files, evidence, risks and any concrete approval needed. Do not use local/auto memory as an undocumented source of policy or authorization.
7. Route design, UI, UX and motion work to the `chief-design-officer` agent (`.claude/agents/chief-design-officer.md`). It carries the Product Design Director role in the agent workflow.

The import loads the common entry document; its Markdown links still require deliberate reading. If imports do not load in the installed version, explicitly open `docs/governance/README.md` and its required files before proceeding. Check loaded instructions using the installed tool's supported inspection mechanism; report conflicting user/global/scoped instructions through the shared authority rules. Do not rely on direct `AGENTS.md` loading or duplicate the shared policies here.
