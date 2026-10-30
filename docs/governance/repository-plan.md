# Repository and documentation organization plan

Status: proposed layout only. Do not create application directories, project files or CI configuration until explicitly authorized.

## Current repository contents

Root `README.md`, `AGENTS.md`, `CLAUDE.md`, the eight numbered product/architecture documents and shared governance Markdown. There is no initialized Git repository, runnable app, dependency manifest, CI pipeline or infrastructure. The preserved owner attachment is provenance under `docs/governance/source/`.

## Proposed future layout

The following tree is illustrative, not an instruction to scaffold it. Create only the paths needed by an authorized milestone; no empty modules, placeholder tests or generated project skeletons for appearance.

```text
/
  README.md                    # verified project onboarding and commands
  AGENTS.md                    # Codex adapter to shared standards
  CLAUDE.md                    # Claude adapter to shared standards
  apps/
    ios/                       # native Xcode/Swift app, local README, tests
    android/                   # native Gradle/Kotlin app, local README, tests
  design/                      # design-system workspace (tokens, Library, prototype); web, localhost only
  backend/
    src/                       # modular API and worker, one codebase
    tests/                     # domain, DB/integration and boundary tests
    migrations/                # reviewed SQL migrations, only when authorized
  contracts/
    api/                       # versioned control-plane schemas
    media/                     # reviewed envelopes, protocol and test vectors
  tests/
    system/                    # cross-platform scenarios and fault harness
    fixtures/                  # synthetic, sanitized, bounded test inputs
  ops/
    infrastructure/            # IaC once provider/environment approved
    observability/             # versioned alerts/dashboards/SLO definitions
  .github/                     # only if GitHub/Actions is selected
    workflows/                 # actual required CI lanes, no stub passes
    CODEOWNERS                 # only after named reviewers accept ownership
  docs/
    README.md                  # product/governance navigation
    01-...md through 08-...md   # existing authoritative planning specifications
    governance/                # common policy, templates and provenance
    decisions/                 # numbered ADRs and owner approval records
    work/                      # significant task plans and sanitized handoffs
    api/                       # interface/state/error docs linking contracts
    qa/                        # test plans, device matrix, evidence index
    design/                    # accepted interaction/accessibility decisions
    runbooks/                  # operations, incident, restore and deletion drills
    releases/                  # versioned release checklist and sign-off evidence
```

Native project-local source/test structures follow the selected toolchain rather than imposing a generic shared UI framework. The backend may separate modules for identity, sessions, media, receipts and cleanup within one deployable codebase. Add a new deployment boundary only through an evidence-backed ADR. Do not introduce a JavaScript workspace simply because the backend uses Node.

## Source-of-truth rules

| Information | Keep here | Avoid |
| --- | --- | --- |
| Requirements/scope/acceptance targets | Existing numbered specifications; stable FR/decision IDs | Repeating current behavior in every policy file |
| Adopted technical decision | `docs/decisions/NNNN-short-title.md`, status and approval reference | Treating a draft ADR as approved by its author |
| Machine-readable interface | `contracts/`, with rationale linked from `docs/api/` | Hand-maintained incompatible copies per platform |
| Native camera facts/results | 04 as spec; `docs/qa/` as indexed device evidence | Treating a simulator screenshot as camera-quality evidence |
| Operational procedure | `docs/runbooks/`, trigger/owner/verification | Hidden knowledge in chat or model memory |
| Build/run/test instructions | Root and relevant component README, verified on pinned toolchain | Placeholder commands that have never run |
| Work and review evidence | `docs/work/`/`docs/releases/` index plus controlled artifact storage | Committing large videos, private photos, secrets or raw crash dumps |
| Tool-specific configuration | Minimal native tool files only when authorized | Duplicated engineering policies under `.codex/` and `.claude/` |
| Design tokens, components and prototype | `design/` (approved design system; `tokens/` is the single value source) | Re-typing values in native code instead of generating from tokens |

External evidence belongs in access-controlled storage with stable artifact IDs/digests and a retention policy. The repository keeps sanitized summaries and durable references; expired evidence must be reacquired if still required by a gate. Never commit genuine user photos to make a test reproducible. Keep secrets/local machine settings/build outputs out of version control once ignore rules are authorized and created.

## Documentation identifiers and changes

ADRs use sequential four-digit IDs, not an invented current decision. Proposed → accepted requires linked approval and review; superseded records point to their replacement. Keep product D01–D15 separate from future ADR IDs and map them when adopted. Owner approvals record scope and exclusions without copying private transcript content.

Work records use `YYYY-MM-DD-short-task.md`; release records include the actual app/backend version and source SHA. Evidence references include artifact identity and execution date. Record UTC event times and user-facing timezone when relevant; do not infer launch jurisdiction from a machine timezone.

Future root/component scoped instruction files may add paths/commands, but must link the common entry policy and may not silently weaken it. Review `AGENTS.md`/`CLAUDE.md` parity whenever tool loading or local conventions change. Avoid unmanaged overrides. A third tool gets a small adapter to the same policies, not a new constitution.

## Foundation tasks after approval

Developer Experience/Release Lead proposes repository host, CI provider, protected branch, named CODEOWNERS, evidence storage and pinned toolchains; owner approves paid services/permissions. Implement in a small reviewed foundations change only after its milestone is authorized. Verify a clean checkout's documented build/test commands and inspect actual branch/check settings before claiming onboarding or enforcement works.

No Git initialization, branches, repositories, CI files, code-owner assignments or application directories were created as part of this plan.
