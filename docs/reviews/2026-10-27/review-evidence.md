# Review evidence, scope and limitations

Date: 27 October 2026. Status: **interim review package; Claude review NOT RUN successfully**. Planning only. Baseline reviewed: `ebf8edf151add1e7308dd68778cca07f02753e4b`, initially clean `main` tracking `origin/main`.

## Authorization and plan

Owner requested an independent, adversarial Codex-and-Claude architecture/product review, concise memo, proposed document changes and a bounded M0 plan. This authorizes research, read-only model review and documentation drafting, not application development, installation, purchasing hardware/services, migrations or deployment. Earlier owner authorization identifies GitHub `mmrshohan/camera-sharing-app` as the publication repository; publication of drafts does not approve their content or M0.

Risk: R2/R3 architecture/privacy/reliability recommendations. Coordinator roles: architecture/product/DX synthesis; reviewers below are separate fresh-context agents. The coordinator makes no claim of external employment credentials or independent human security clearance.

Plan: pin baseline → verify tool/model controls → independent reviews without shared conclusions → verify material platform claims against primary sources → reconcile severity and recommendations → draft memo/amendments/M0 → independent affected-document review → structural validation → hand off with explicit approval/blocked status.

## Actual model and tool evidence

| Review path | Requested / observed | Outcome |
| --- | --- | --- |
| Codex camera/product | Current collaboration tool advertised `gpt-6-astra`; fresh `adversarial_camera_product` agent requested/accepted with `xhigh` reasoning | Completed read-only review of planning files, relevant governance and focused official platform sources. Exact backend model identity is not independently exposed; requested runtime configuration is not a model attestation |
| Codex security/reliability/economics | Fresh `adversarial_security_systems`, same requested/accepted configuration | Completed independent read-only R3 review, including official AWS/Android/RFC sources; no file writes or implementation tests |
| Claude Code availability | Installed CLI `2.1.181`; its help supports `--model`, `--effort`, safe/plan modes, no tools and JSON output. Escalated auth status showed a saved claude.ai login | A saved login did not prove a usable inference token |
| Claude Code independent attempt | `--model fable --effort max`, tools disabled, plan/safe mode, no session persistence, no MCP servers; 15 supplied document snapshots, 142,407 bytes. $25 API-equivalent request ceiling; no account/plan upgrade | Initial request and one owner-directed continuation retry both failed before inference with HTTP 401: OAuth access token expired. Both returned JSON `is_error=true`, empty `modelUsage`, reported cost $0. No Claude conclusions exist |
| Current coordinator | Inherited/default session; exact active model identifier not exposed | Integration and source verification, not a third claimed independent review |

Claude current documentation identifies Fable as the top-capability family and describes alias/version/provider constraints. Installed CLI/account support was deliberately not inferred from that page: the actual inference failed authentication, so neither Fable access nor a resolved actual model was verified. No fallback to a faster model or new paid provider was attempted. [Official Claude model controls](https://code.claude.com/docs/en/model-config).

The Claude invocation used safe mode and explicit document snapshots; it did not test automatic CLAUDE.md loading or parity. Temporary prompt/error output was kept outside the repository; no OAuth tokens, account secrets or private user photos are included in this evidence record. Reauthentication was requested from the owner via the text-input tool. The user must complete `claude auth login`; no request to paste a token/password was made.

## Independent findings and coordinator disposition

| Evidence / finding | Classification | Disposition |
| --- | --- | --- |
| Camera reviewer: borrowed-phone exit paths expose an undefined owner-data boundary | P1 design gap before production UI | B3 / A6: persistent borrowing mode and owner-authenticated access; honest unlocked-phone limitation |
| Camera reviewer: quality-prioritized/no-deferred capture conflicts with queue/storage-only admission claim | P2 specification mismatch; M0 experiment | A1: readiness/in-flight admission, attempted/admitted/returned/Prepared counters and exposure latency |
| Camera reviewer: sRGB/encoding/sanitization and selfie/crop oracle undefined | P2 before camera acceptance | A2: explicit format/geometry policy and pre/post sanitation checks |
| Camera reviewer: pairing metric excludes first-use signup friction | Product hypothesis, not security blocker | Separate first-use/repeat tasks; label simulated authentication honestly |
| Systems reviewer: DB RPO + host cleanup can lose acknowledged delivery metadata | P1 design gap before transfer implementation | B1 / A4: recoverable complete handoff barrier and fresh-identity/old-snapshot test |
| Systems reviewer: unclamped grants and post-deletion PUT re-creation | P1 design gap before transfer implementation | B2 / A5: clamp deadlines, track all attempts, explicit residual capabilities and late-object cleanup |
| Systems reviewer: persistent host photo-key wrapper is unnecessary for immutable retry | Privacy-improving simplification to validate | A3: remove after atomic Prepared if M0 proves retry/recovery needs no decryption |
| Systems reviewer: key pin/reset and logout/account-switch behavior unspecified | P1 before real-user pairing/local gallery | B4 / A7/A8: continuity/lifecycle table and negative cases |
| Systems reviewer: “new session” recovery message conflicts with old-context authorization | P2 concrete copy/semantic mismatch | A7: “Both devices must approve recovery” |
| Systems reviewer: static-key forward secrecy and service availability trust unstated; egress abuse/gallery growth understated | Threat-model disclosure and operational/product requirements | Explicit limits, no ratchet absent requirement, app-space management and per-delivery cost metrics |

Exploratory finding **not promoted to contradiction**: normal cloud expiry at reservation +72h and host retention at capture +72h are explicitly different clocks. They need a product decision/comprehensible explanation, not a false claim that the baseline says one global deadline. Conditional S3 writes can prevent overwriting an existing object, but do not alone prevent recreation after deletion. An independent journal cannot be removed merely because it is operationally inconvenient; privacy-safe restore still needs durable current deletion/revocation state.

The proposed amendments are separate from the baseline eight specifications. None is an accepted ADR. Production blockers do not block read-only planning or a separately authorized synthetic feasibility probe; they block implementing the affected production contract without an accepted resolution.

## Official-source verification

Coordinator opened current official pages and checked relevant passages, rather than treating reviewer suggestions as facts:

- [Apple high-resolution capture](https://developer.apple.com/videos/play/wwdc2026/304/): photo-library deferred finalization and shot-to-shot quality/responsiveness trade-offs. No device result was measured.
- [Android CameraX Extensions](https://developer.android.com/media/camera/camerax/extensions-api): OEM/camera-specific availability; current compatibility notice says some devices lose Extensions support for CameraX ≤1.5 from 1 November 2026. Optional experiments must recheck compatible stable tooling.
- [S3 presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html): reusable grants, overwrite behavior and request-start expiration; cleanup/race conclusions are design inferences, not a claimed provider one-use feature.
- [S3 conditional writes](https://docs.aws.amazon.com/AmazonS3/latest/userguide/conditional-writes.html): existing-object preconditions; no assumption that they prohibit creation after deletion.
- [Android backup](https://developer.android.com/identity/data/autobackup): cloud and device-transfer rules differ; a blanket backup toggle cannot substitute for the required exclusion audit.
- [HPKE security considerations](https://www.rfc-editor.org/info/rfc9180/): recipient-compromise forward secrecy is not provided by static recipient-key HPKE. No custom protocol/audited library is claimed implemented.
- [S3 pricing](https://aws.amazon.com/s3/pricing/): storage, requests and transfer have distinct costs. The memo/M0 dollar values are arithmetic scenarios/allowances, not selected-region quotes or purchase commitments.

## Validation status and what remains

Two independent Codex reviews are complete. Claude authentication remains the external blocker to the specifically requested cross-tool review. The coordinator has drafted the three requested deliverables, but this memo cannot be called the final Codex-and-Claude decision until a successful Claude review is incorporated and material disagreements are resolved.

Affected-document review: the camera/product reviewer found one P2 scope ambiguity: the plan asked for measured repeat pairing without authorizing a pairing implementation. Corrected M0 to concept walkthroughs for both repeat pairing and first use, and preconfigured synthetic identities for transfer tests. No live pairing/onboarding timing is claimed. The security reviewer reported no new P0/P1 and one P2 omission: account-deletion behavior for local gallery/keys. The amendments now explicitly cover executing online devices, offline cleanup limits and unaffected OS-exported copies.

The security reviewer delivered that substantive message, then its final turn ended at a Codex usage limit; no further reviewer execution or independent post-fix sign-off is claimed. The coordinator verified these narrow corrections against the requested scope. The two original Codex reviews remain complete; the final cross-tool package remains interim. Final structural checks are recorded below after actual execution. Application tests, device capture experiments, cryptographic execution, cloud operations, usability studies and M0 are NOT RUN; they are not implied by a document review.

Next required action: owner reauthentication in Claude Code, then repeat the independent no-tools review, record the actual resolved model from runtime output where exposed, reconcile its findings with this package, update review status and request separate approval of the amendments/M0. If Claude cannot access a strong model on the existing account, disclose that limitation rather than silently substitute or purchase access.

Final coordinator structural verification: 25 Markdown files, zero broken local links or unmatched fences; all original eight numbered specifications byte-identical to baseline. The only existing-page change is the docs index linking these four proposed review files. M0 counts reconcile to 3,000 core captures, 37 specialist person-days and $1,000 incremental cash allowance. No application/configuration directories, dependencies or infrastructure were created. This verifies documents and arithmetic only, not M0 execution or cross-tool review completion.
