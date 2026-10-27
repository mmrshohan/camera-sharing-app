# Review evidence, scope and limitations

Date: 27 October 2026. Status: **independent documentary conclusions reconciled; proposals await owner approval**. No development/M0 authorization. Baseline: `ebf8edf151add1e7308dd68778cca07f02753e4b`.

## Authorization and review method

The owner requested an adversarial Codex-and-Claude review, a concise decision memo, proposed amendments and a bounded M0 plan. This authorizes research, read-only model review and documentation; it does not authorize implementation, purchases, infrastructure or deployment. Earlier authorization names GitHub `mmrshohan/camera-sharing-app` as the work repository. Draft publication does not approve the recommendations.

Risk: R2/R3 architecture, privacy and recoverability. Method: pin baseline → check actual capabilities → obtain independent findings without sharing reviewers' conclusions → verify material primary-source claims → reconcile disagreements → draft proposed amendments/M0 → perform affected-document review and structural checks → present for owner decision. Roles are responsibilities, not real-world credentials; AI review is not external human security sign-off.

## Actual model/tool evidence

| Path | Observed evidence | Outcome and limitation |
| --- | --- | --- |
| Codex camera/product | Fresh `adversarial_camera_product`, requested/accepted `gpt-6-astra`, `xhigh` reasoning | Completed independent read-only review with focused official-source checks. Exact backend identity is not independently exposed; this is the requested runtime configuration |
| Codex security/systems | Fresh `adversarial_security_systems`, same requested/accepted configuration | Completed independent R3 findings. Its affected-review message was delivered before a later turn ended at a Codex usage limit; no further independent post-fix execution is claimed |
| Claude CLI | Installed `2.1.181`; actual help supports model/effort controls, JSON, no tools and no persistence | An installed CLI or saved login alone did not establish usable inference |
| Initial Claude requests | Fable/max, no tools/MCP, safe/plan mode, 15 supplied snapshots | Two attempts failed before inference with HTTP 401 expired OAuth, empty modelUsage and reported cost $0 |
| Owner login follow-up | Owner ran `claude auth login`; live no-tools probe returned AUTHENTICATED, `is_error=false` | Runtime usage included `claude-fable-5` and separate Haiku usage; API-equivalent probe cost $0.07443. Authentication was thereby verified |
| Authenticated Fable/max review | Runtime usage reported `claude-fable-5` plus Haiku; 457.114 s; API-equivalent $2.515576 | Returned only a procedural preamble, stop_reason end_turn. **Not counted as an architecture review** despite API success |
| Corrected document-review role | Fable/high, explicit document-only system prompt; no tools/MCP, safe/plan mode, no session persistence | `is_error=false`, 183.765 s, runtime usage `claude-fable-5` plus Haiku; API-equivalent $1.636751. Returned the substantive findings summary preserved in [Claude response](claude-review.md) |
| Coordinator | Inherited/default active session; exact model identifier not exposed | Integrated and verified claims; not a third claimed independent reviewer |

Reported API-equivalent total for the successful probe and two authenticated responses is approximately $4.23; subscription billing/invoices are not verified. No model plan, provider account or CLI version was upgraded. The strongest available family requested in this installed Claude path was Fable; successful usage establishes Fable 5 access, not access to an untested newer model. [Official Claude model controls](https://code.claude.com/docs/en/model-config).

Claude reviewed the original baseline independently from Codex findings. Tool access was disabled and all source text supplied inline; automatic CLAUDE.md loading/parity was not tested. The final response claimed a separate plan file existed. No usable separate artifact was provided or verified, so only the returned text was accepted as review evidence. Its claimed detailed M0 counts, costs and citations were not invented or reconstructed as though supplied. The coordinator's actual M0 proposal is independently labeled as a proposal.

Input snapshot: 15 source files, 142,407 bytes; SHA-256 `158de2c4736bfd93bec279c67e79a476ef22bac7794e9bf0a6bf1ebc84efe808`. Raw temporary responses/prompt were kept outside the repository; the committed response page preserves the substantive text and sanitized metadata, not tokens, account credentials or private user photos.

## Findings and reconciliation

| Finding | Classification / disposition |
| --- | --- |
| Codex: cloud DB rollback may lose acknowledged photo discovery/authorization after host cleanup | P1 B1/A4: complete reconstructable handoff barrier, including fresh account/device/session dependencies and current deletion/revocation state; no executed design is claimed |
| Codex: unclamped grants and stale PUT recreation outlive logical cleanup | P1 B2/A5: clamp grants to absolute expiry, track every attempt, test late writes and measure physical-deletion lag separately |
| Codex: undefined lender-data boundary during borrowing-mode exit/relaunch | P1 B3/A6: persistent owner-authenticated app boundary, with unlocked-phone limitations explicit |
| Codex: missing pin/reset and local account/key lifecycle contracts | P1 B4/A7/A8 before real-user implementation: immutable recipient binding, renewed verification, explicit logout/switch/deletion/backup rules |
| Codex: camera readiness, format/color/sanitization and crop/selfie oracle | P2 A1/A2: admission counters, exposure/cadence, pre/post sanitation fidelity and fixed geometry policy |
| Codex: durable host photo-key wrapper probably unnecessary after Prepared | Privacy-improving A3 experiment, not adopted crypto: immutable recipient-decryptable artifact and key-free retry must be proven |
| Codex: first-use friction excluded from pairing KPI; offline “new session” copy conflicts with old-context recovery | Separate actual versus concept measurements; recovery copy now proposed as “Both devices must approve recovery” |
| Claude: one unreplicated cloud copy violates last-copy rule | Qualified, not accepted categorically: define safe handoff and metadata recovery. A logical object can already have provider redundancy; extra storage systems are not justified by the wording alone |
| Claude: memory-only host review is tied to ciphertext cleanup | Accepted clarification: memory preview clearing and stored-ciphertext cleanup are separate lifecycles; A3 makes the events explicit |
| Claude: iOS minimum/matrix hedging; 99.9% deploy-inclusive SLO versus single-region monolith | Coverage and operational hypotheses, not proven contradictions. Record actual OS builds; a monolith need not mean one running instance. Require deployment/failover/SLO evidence |
| Claude: library-exclusion audit and MTF50/SNR methods unspecified | Accepted A10/M0 additions: independently permissioned test auditor plus call-path evidence; pinned/calibrated metrics with an indeterminate outcome |
| Claude: HEIF sanitation, one crypto profile, checksum verification | Bounded local native-format comparator; one approved suite per protocol version; documented S3 SHA-256 still requires actual selected-provider tests |
| Claude: cut offline recovery; 28 M0 person-days; 18–26 weeks | Optional trade-off/estimates only. Lost offline recoverability is explicit; no silent discard/scope cut. No inspectable staffing evidence supports replacing 37 person-days or calling 16–18 weeks a proven schedule floor |

Normal cloud expiry at reservation +72h and host retention at capture +72h are explicitly different clocks; neither reviewer speculation nor simplification silently turns them into one global deadline. Signed receipts authenticate a client's claim, not independent physical-storage proof. Static recipient-key HPKE does not add recipient-compromise forward secrecy; service availability/retention enforcement remain trusted. The proposal retains the modular monolith and standard E2EE without adding speculative microservices or a ratchet.

## Affected-document review and validation limits

The independent Codex camera reviewer found a P2 ambiguity in the initial M0 draft: it requested timed pairing without including a pairing implementation. Corrected to concept walkthroughs for repeat pairing/first use, with preconfigured synthetic identities for transfer experiments. The security reviewer reported no new P0/P1 and one P2 omission: account-deletion effects on local gallery/device keys. A8 now covers executing online devices, offline cleanup limits and unaffected OS-exported copies. The coordinator verified those narrow fixes; no independent post-fix execution is fabricated.

Claude's baseline findings added the explicitly proposed A10 methodology/operational clarifications. These are recommendations reviewed through the returned conclusions; no app experiment, complete protocol approval, separate claimed plan-file review or human sign-off occurred.

The original eight specifications remain byte-identical to baseline. Existing-page changes are navigation only; five review pages contain the proposed memo, amendments, M0, evidence and returned Claude text. Structural verification checks links/fences, status language, source preservation and count/budget arithmetic. Actual application/device/crypto/cloud/participant/72-hour experiments are **NOT RUN**. M0 remains **unapproved**. Tests of instruction loading and implemented CI/branch-protection controls remain outside this review.

## Primary-source checks

- [Apple high-resolution capture](https://developer.apple.com/videos/play/wwdc2026/304/): privacy-relevant deferred finalization and responsiveness trade-offs; no measured stock-camera parity.
- [CameraX Extensions](https://developer.android.com/media/camera/camerax/extensions-api): OEM/camera availability and the current older-library compatibility notice; optional paths need current stable-tooling verification.
- [S3 signed URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html): reusable grants, overwrite, request-start expiry and supported signed checksum algorithms.
- [Conditional writes](https://docs.aws.amazon.com/AmazonS3/latest/userguide/conditional-writes.html): existing-object protection does not prohibit recreation after deletion.
- [S3 durability](https://docs.aws.amazon.com/AmazonS3/latest/userguide/DataDurability.html): Standard uses provider-managed redundancy; it does not restore this app's lost authorization/routing records.
- [Android backup](https://developer.android.com/identity/data/autobackup): cloud/device-transfer policies differ; both require explicit key/photo/journal exclusion checks.
- [HPKE security considerations](https://www.rfc-editor.org/info/rfc9180/): static recipient-key compromise limitation and application-level protocol responsibilities.
- [S3 pricing](https://aws.amazon.com/s3/pricing/): storage/request/transfer dimensions. Scenario arithmetic and M0 allowances remain estimates, not selected-region quotes.

## Next decision

Owner reviews the reconciled proposals and chooses whether to approve the amendments and separately authorize the bounded M0 with named hardware, staffing and cost responsibility. Production blockers B1–B4 remain design gates before affected implementation; they are not falsely marked fixed by this document. No merge, M0 execution, purchase or production development is authorized by a successful model review or restored login.

Final coordinator verification: 26 Markdown files passed local-link/fence checks and the review-file basic credential-pattern scan; all original eight specifications remain byte-identical to baseline. M0 arithmetic reconciles to 3,000 core captures, 37 specialist person-days and the $1,000 incremental allowance. No application/configuration artifacts were introduced. These are documentation checks, not device, cryptographic, provider-contract or release tests.
