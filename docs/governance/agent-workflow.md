# Roles, model selection and agent workflow

Status: proposed. Applies equally to both tools; all implementation steps remain gated.

## Ten logical specialist roles

| Role | Accountable output | Reviewer for material work |
| --- | --- | --- |
| Product Lead | PRD, scope, journeys, acceptance and decision register | Design/QA; owner approves scope |
| Principal iOS Engineer | Native camera, PhotoKit, background/storage behavior | Camera specialist or independent iOS peer; security for keys/data |
| Principal Android Engineer | CameraX/Camera2, MediaStore, OEM/OS handling | Camera specialist or independent Android peer; security for keys/data |
| Camera Imaging Specialist | Physical-device comparisons, format/lens/low-light evidence | Relevant mobile principal + QA |
| Backend/Distributed Systems Architect | Identity/session interfaces, durable delivery, idempotency and scale model | Security + QA for trust/lifecycle changes |
| Security & Privacy Engineer | Threat model, authorization, crypto, consent, retention and abuse boundaries | Independent security peer; owner accepts material trade-offs |
| Product Design Director (the owner's Chief Design Officer; in Claude Code, the `chief-design-officer` agent) | Minimal flows, truthful status, native interaction and accessibility; the design system's tokens, components, motion and quality bar | Product + QA; security for consent/privacy wording |
| SRE/Performance Engineer | SLOs, capacity/cost, observability, recovery and incident procedures | Backend + QA; release owner for operational gates |
| QA/Automation Lead | Test strategy, real-device matrix, failure injection and regression evidence | Relevant principal + independent reviewer |
| Developer Experience/Release Lead | Repository conventions, toolchain/CI, reproducible artifacts and release evidence | QA + security for pipeline/credential changes |

One person/agent may cover several responsibilities, but cannot be both author and independent reviewer of the same artifact. AI specialist roles are task assignments, not credentials. External security/legal or physical-device work cannot be claimed merely because an agent adopts a role title.

## Risk classification and routing

| Class | Examples | Model and review requirement |
| --- | --- | --- |
| R0 — mechanical | Formatting, verified links, transcription with no semantic changes | Any verified suitable model; coordinator checks exact diff and links |
| R1 — bounded | Small change within an approved interface, focused test maintenance | Capable model with relevant context; peer review before merge |
| R2 — substantial | Architecture, camera/OS conclusions, cross-platform contracts, governance semantics, performance diagnosis | Strongest appropriate verified available reasoning model/setting; fresh independent specialist review |
| R3 — critical | Crypto/keys, consent, identity/routing, media loss, retention/revocation, migrations, signing/release credentials | Strongest appropriate verified available model; independent security/domain review and relevant QA evidence; material decisions require owner approval |

Classify by impact, not file extension. A Markdown edit changing a deletion promise is R3. If uncertain, use the higher class. A fast model may enumerate test cases, but cannot sign off an R3 design from those cases alone. R2/R3 reviews require the same reasoning/capability standard as authorship.

## Capability check and model choice

Before delegating or changing model, record: tool/session/version; available agent/model controls from the current runtime; supported exact model identifier/alias and reasoning setting; relevant tool/context constraints; evidence source/time. A documented model or an installed CLI is not proof of account access or successful use. Distinguish **advertised by runtime**, **selected**, **request accepted**, and **execution completed**. Record the exact observed level; never upgrade it by assumption.

Use the most capable appropriate available choice for the actual task: reasoning and sufficient context for architecture/security; image inspection plus native evidence for camera/UI review; appropriate file/test tooling for implementation. Prefer correctness and reviewability over latency/token savings. Names such as Opus, Sonnet, Fable and Codex are candidates, not a universal ranking or fixed routing table. Recheck aliases and access in each tool/session; do not promise cross-provider routing the harness cannot perform.

If a capable default is already selected, keep it; do not downgrade for savings. If the exact active model is not exposed, record “inherited/default; exact identifier not exposed,” assess task evidence/capability, and do not invent an identity. If a specific higher-capability model is required but cannot be verified/selected, explain the gap and request an available qualified reviewer rather than silently falling back. Smaller-context or faster routing is appropriate only for genuinely bounded work whose result is independently verifiable.

Escalate on a failed acceptance check, unresolved platform/security uncertainty, contradictory evidence, loss of needed context, or unexpected scope. Stop blind repeated attempts; investigate the first failure. If a bounded task still fails after one reasoned correction, raise model/reviewer capability or decompose it. A correctness/privacy concern triggers immediate escalation, not a retry quota. Log any model fallback and reassess the review/gate requirements.

## Working protocol

1. **Orient:** read the shared core policies, relevant specs/decisions, actual files and latest task record. Inspect local changes and applicable instruction files. Never rely solely on a previous agent summary.
2. **Scope:** state goal, in/out boundaries, authorization source, dependencies, risk class, accountable role, proposed approach and measurable acceptance evidence. For trivial R0 work, a short message suffices; significant work uses the [task template](templates.md).
3. **Resolve decisions:** check approved ADRs and owner approvals. Propose a concrete change and trade-offs before escalating material scope/architecture/security/paid-service choices. Continue unaffected authorized work.
4. **Delegate deliberately:** split only independent bounded tasks. Give each agent required source links/context, file ownership, risk, acceptance and stop rules. Verify model/tool support. Use read-only independent reviews when writers share a workspace. Do not launch ten agents to simulate ten roles.
5. **Execute within approval:** documentation now; implementation only later under explicit scope. Make small cohesive changes; do not touch another writer's files or overwrite user work. Worktree/branch isolation may be used only when available and authorized; it cannot bypass the planning gate.
6. **Verify:** run the required checks against the actual artifact, examine failures and obtain evidence required for the risk class. Re-run affected checks after a fix; unrun checks are not passes.
7. **Independent review:** supply spec, actual diff/artifact identifier, source evidence, risks and test output. Reviewer inspects the artifact rather than endorsing the author's summary. Coordinator resolves findings and rechecks changed behavior. Self-review under a new role label is not independent.
8. **Handoff:** report files/artifact, assumptions, evidence, limitations, reviewer findings and next action. Record approvals faithfully; never turn a recommendation into accepted status. Stop after the authorized milestone.

If no delegation tool exists, do the authorized work sequentially and disclose the lack of independence; require a separate human/session review before clearing a mandatory independent-review gate. A new session/agent can provide a fresh perspective but shares model/system blind spots; AI review does not replace required specialist human release sign-off.

## Handoffs and records

Use [templates](templates.md) for task/handoff, ADR, approval, PR and gate/exception records. Significant records belong in future `docs/work/`, `docs/decisions/` and `docs/releases/` when those artifacts are actually needed. Do not create empty tracking systems. In planning, a dated review record is sufficient. Never store tokens, photo content, sensitive usernames, signed URLs or private model account details in handoffs.

A useful handoff names the actor/session, logical role, requested and actually observed model setting, file scope, inputs, decisions/assumptions, acceptance checks with actual results, unresolved risks, independent reviewer and next action. A role name or “all done” message is not evidence.
