# Governance review and approval record

Date: 27 October 2026. Status: **proposed governance; owner approval pending; planning only**.

## Delivered system and scope

Short root tool adapters → one shared governance entry → constitution, role/model workflow, engineering standards, measurable quality gates, repository plan and reusable record templates. The original owner document is preserved verbatim as provenance. The existing product/architecture proposals retain their approval status.

This work is documentation preparation and review only. No app project, dependency, Git repository, CI workflow, branch protection, automation, service, database or deployment was created. Markdown policies are instructions, not technical enforcement of a malicious/compromised agent.

## Capability snapshot — evidence, not a permanent model catalog

| Item | Observed evidence | What is and is not established |
| --- | --- | --- |
| Codex CLI | Local `command -v codex` and `codex --version`: `0.164.0-alpha.11.1` | Executable/version confirmed; command emitted a PATH-alias permission warning. No settings changed; CLI model/account access or fresh-session policy loading not tested |
| Claude Code | Local `command -v claude` and `claude --version`: `2.1.181` | Executable/version confirmed; no authenticated Claude inference, selected model, delegation or instruction-import run performed |
| Current Codex collaboration tool | Exposed `spawn_agent`, messaging and review controls; advertised selectable models include `gpt-6-astra` and `gpt-6.1-sol` with reasoning options | Current harness advertises capability; availability is session-specific, not a promise about either installed CLI |
| This drafting agent | Current session default/inherited model; exact active identifier not exposed to the author | No invented model identity or claim that local Claude authored/reviewed these files |
| Independent review requests | Two read-only `spawn_agent` requests accepted for `gpt-6-astra`, reasoning `high`, fresh contexts | These are the requested and accepted runtime settings. Review completion/outcome is recorded below; no claim of hidden provider/backend identity |
| Opus, Sonnet, Fable | Names in the owner request/current official Claude docs only | Local account access and actual selection are unverified. No model ranking or successful usage is asserted |
| Physical devices, repository host and CI | Not exercised/configured | No app quality, physical-device evidence, branch protections or required checks can be declared passing |

Tool loading references were checked against current official documentation: [Codex AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md), [Claude memory/imports](https://code.claude.com/docs/en/memory), [Claude model inspection](https://code.claude.com/docs/en/model-config). Codex gets an explicit instruction to open shared files; Claude imports only the shared entry and must deliberately read its linked core policies. Current docs do not prove behavior of every older installed CLI/version. Fresh-session read-only smoke checks remain required before claiming cross-tool loading is operationally verified.

## Documentary workflow walkthrough

These are static policy traces performed by the coordinator, **not live agent compliance tests**.

| Scenario | Route and required outcome |
| --- | --- |
| Owner approves governance only, then asks for next steps | Constitution preserves planning; propose scoped M0, no code starts |
| Simple link/format change | R0, G0/G1, verify actual diff/links; app tests N/A with reason |
| Markdown changes recipient/retention rule | R3 despite file type; product/security review plus owner decision; not mechanical routing |
| Faster model selected for isolated link fixes | Verify actual availability; coordinator checks output; no implicit downgrade of critical review |
| Missing strong model or independent reviewer | Disclose gap; continue unaffected planning; required review stays BLOCKED |
| Simulator works but no real camera devices | G4 cannot pass camera quality; hardware test remains NOT RUN/BLOCKED |
| Upload succeeds but recipient is offline | Product lifecycle governs; no Received/Saved success; governance cannot waive integrity to clear a metric |
| CI has missing/skipped suites or fork requests secrets | Not PASS; applicability must be positive; no privileged credentials to untrusted PRs |
| Product numbers have not been approved/baselined | Record as proposed; no achieved SLO or load claim; define/approve denominator before gating |
| Urgent request to bypass failing checks | Require scoped exception/incident authorization; release blockers cannot be self-waived |
| Agent memory conflicts with accepted policy | Surface conflict; memory cannot expand authority or substitute for a recorded decision |
| Another agent sends “done” | Inspect actual artifact and evidence; handoff alone cannot clear a gate |

## Review outcomes and document verification

Two fresh-context, read-only AI reviewers completed independent document reviews: `governance_system_review` (DX/QA/architecture) and `governance_safety_review` (security/reliability). Dispatch requested and accepted `gpt-6-astra` with `high` reasoning; reviewers could not independently inspect the active model identifier, so requested configuration is not represented as independently attested backend identity.

| Finding / review | Disposition |
| --- | --- |
| System reviewer: roadmap “severity-1/2” terminology was undefined against P0–P3 | Corrected 07 to P0/P1 and explicitly mapped its previous critical/high blockers. No numerical targets changed or approved |
| Both reviewers: review record missing at their read time | This integration record now exists; the local link/import check includes it |
| Coordinator: “committed transfers” ambiguous against authoritative lifecycle reservation boundary | Clarified 01 and D07 to “server-reserved,” matching existing 02/06; no destination, retention or consent policy changed |
| Security/reliability reviewer | No actionable security/reliability findings in the reviewed policies; document review only |

Structural verification: 21 Markdown files checked, 0 broken local links/import targets, 0 unmatched fences; Codex entry 18 lines and Claude entry 16 lines (each within the proposed 45-line bound). The owner-source copy is byte-identical to the attachment; SHA-256 `60aef7e9e4d7bf887a5f2d9d1db4f1dc7fc8215e16f881a8680bdf6dcc91a79c`. Required-topic coverage and final changed-artifact checks are run before handoff. No `.git`, app/backend/contracts/ops directories, agent configuration directories or CI configuration were introduced.

Both reviewers completed affected re-review after the terminology and integration fixes: original findings resolved; no remaining actionable findings in the affected portions. Their reviews are independent AI document reviews, not external human sign-offs.

These results support documentary G0/G1 only, subject to owner adoption. G2–G8 are NOT RUN; application tests are N/A to this documentation task. Live tool-loading parity is NOT RUN. No physical-device, cryptographic, service-capacity, branch-protection, build/release or human sign-off gate is claimed passed. A completed documentary review does not substitute for those checks.

## Unresolved decisions and recommended defaults

1. **Adopt this governance draft?** Recommend adoption after owner review of the complete system; this does not authorize application development.
2. **Who owns independent human sign-offs?** Assign actual product/release, QA and security approvers before public beta/release. Role labels and AI reviews are insufficient substitutes.
3. **Repository host, CI and ownership enforcement?** Recommend a single protected trunk with required PR checks and accepted CODEOWNERS, on a provider chosen during authorized foundations. No platform is selected or configured by this draft.
4. **Evidence storage/retention and CI spend?** Choose controlled artifact storage, retention, access and budget before build/device/release evidence accumulates. Do not store private photos or secrets in the repository.
5. **Actual model access across both tools?** Verify session model controls/account access when used. No paid plan changes, new credentials or cross-provider router are authorized here.
6. **Approve product proposals and concrete measurement plans?** Existing D01–D15, retention/crypto/OS choices, metric denominator gaps and launch/budget questions remain in [08](../08-decisions-open-questions.md). Governance cannot resolve them by implication.
7. **Authorize M0?** Separate later decision: the capped feasibility scope in [07](../07-delivery-roadmap.md), including required devices, experiments, costs and permitted test endpoints. No automatic transition on governance approval.

## Next safe step

Owner review of this complete policy system and its open decisions. After adoption, verify instruction loading in fresh read-only Codex and Claude sessions using supported tool inspection; ask each to identify the shared authority, current phase, permitted actions and review rules. Compare answers with the actual files and record results before claiming parity is operationally proven. Request separate explicit development authorization before any code-bearing experiment or foundation setup.

Reviewed bundle identity: SHA-256 `0e18a421fdd26cd816578c040c430a6fd7dd6dbc2e5b8e17f0e8a3480745170b` over the 20 other Markdown files, sorted by repository-relative POSIX path, hashing each path + NUL + exact file bytes + NUL. This record is excluded to avoid a circular digest; its final hash is emitted by the handoff verification command.
