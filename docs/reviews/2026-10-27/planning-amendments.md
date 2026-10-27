# Proposed changes to the planning documents

Status: proposed amendments, **not applied to the baseline specifications and not approved**. Claude review remains blocked; integrate any further findings before adoption. Baseline: `ebf8edf151add1e7308dd68778cca07f02753e4b`.

This companion makes the proposed changes concrete without rewriting accepted-looking specifications before the owner decides. IDs below map to the [decision memo](decision-memo.md). “Before production” means before implementing the affected production subsystem, not a reason to block read-only planning or an explicitly scoped synthetic M0 experiment.

## A1 — Camera admission and truthful capture acceptance

Targets: [01, Primary journeys and FR-04](../../01-product-requirements.md); [04, Camera quality contract and gates](../../04-camera-engineering.md); [05, Camera](../../05-ui-ux-design.md); [06, Capture/Preparing](../../06-photo-lifecycle-reliability.md).

Proposed replacement for the nonblocking-capture claim:

> Network transfer is asynchronous and does not block capture by itself. The shutter accepts a request only when the camera pipeline, bounded processing capacity, local lease and storage permit it. A busy/unaccepted tap has immediate distinct feedback and is never counted as an accepted photograph. After acceptance, distinguish exposure, returned photo data and durable Prepared; an interruption before Prepared can still lose the capture. Do not queue an unbounded series of shutter intents that exposes long after the user tapped.

Add counters for attempted taps, admitted requests, exposure timestamps where available, returned images, preparation failures and Prepared records. Report tap-to-exposure latency, accepted-shot cadence and all rejection reasons by mode/device/lighting. Existing responsiveness/quality targets remain proposals. M0 must record a maximum in-flight policy per tested configuration and show that it cannot conceal dropped requests. No promise of a universal 2-second processed capture cadence.

## A2 — One explicit image and sanitation contract

Targets: [04, Formats/metadata and measurable gates](../../04-camera-engineering.md); [02, Transfer contracts](../../02-technical-architecture.md).

Proposed M0 baseline: ordinary processed SDR JPEG, a visibly bounded 4:3 capture region, mirrored front preview and **unmirrored saved output** with explicit user-facing consistency. If the owner prefers mirrored saves, change the oracle before testing. The chosen capture configuration must produce a compatible color representation; never attach an sRGB label to differently encoded pixels. If compatible output needs a lossy transform, report its cost/quality and seek a format decision rather than silently convert.

Metadata-only sanitation must preserve compressed image content/color interpretation, valid orientation and intended dimensions. Test primary EXIF, XMP, maker notes, embedded thumbnails and auxiliary containers. Remove GPS/device identifiers everywhere. Compare pre/post-sanitation compressed image segments or decoded pixels with a controlled decoder, plus ICC/orientation/visual results. Canonical post-sanitation SHA-256 still verifies transport; it is not the sanitation-fidelity test.

Use a geometry target with text/corner markers for every orientation, main/front preview, app gallery and system library. Optional high-resolution/HEIF/HDR, extension and auxiliary-lens paths each require their own contract and evidence. This is proposed M0 scope, not automatic removal of release requirements.

## A3 — Remove unnecessary durable host photo-key wrappers

Targets: [03, Photo encryption](../../03-privacy-security.md); [02, Local journal](../../02-technical-architecture.md); [06, Encryption/Prepared/retry](../../06-photo-lifecycle-reliability.md).

Proposed replacement:

> Prepared atomically records a complete immutable ciphertext, recipient-only key envelope, signed immutable context and recoverable transfer journal. Once that boundary is verified, the compliant host no longer retains a decryptable per-photo content key or a host-local wrapper for it. Retry/reservation/recovery resubmits immutable ciphertext and authorization metadata; it never needs to decrypt or change recipient/context. The last-shot UI may retain a bounded in-memory preview only until the next capture, backgrounding or session end. A crash before Prepared is handled as incomplete preparation, not a falsely durable capture.

This removes a local wrapping-key lifecycle while improving host residual-data exposure. It does not remove the host's device signing key or the recipient's encrypted gallery protection. Validate crash boundaries and reauthorization using immutable context before adoption. Keep fresh per-photo AEAD keys, reviewed recipient key encapsulation and authenticated origin. Consider authenticated HPKE instead of separate signatures only if an independent review establishes equivalent binding, maintained cross-platform support and operational benefit; this review does not select a suite.

## A4 — Make cloud acknowledgment durably reconstructable

Targets: [01, RPO and delivery requirements](../../01-product-requirements.md); [02, Schema/commit/restore](../../02-technical-architecture.md); [03, Host cleanup](../../03-privacy-security.md); [06, CloudVerified](../../06-photo-lifecycle-reliability.md).

Proposed invariant:

> CloudVerified permits host ciphertext cleanup only after both bytes and the complete discovery/authorization metadata have an independently verified recovery path. A generic control-plane RPO of 15 minutes cannot permit loss of an acknowledged photo's routing, envelope, consent/key binding or expiry. Recovery must also handle accounts/devices/sessions created after the restored DB snapshot, and must replay subsequent cancellations/revocations before issuing grants.

M0 must compare two small designs: a complete recovery envelope/critical-state record using the existing object/control-record store, versus retaining recipient-encrypted host ciphertext until durable recipient receipt and replaying its authenticated reservation metadata. The latter prolongs host disk use and requires sender availability for certain recoveries; it is an explicit trade-off, not an equivalent guaranteed cloud handoff. Recommend the first design only when its full dependencies can be proven; do not add a new distributed service just to claim zero RPO.

Document precise acknowledgment/write ordering and each crash point. The independently durable journal must include the information actually needed for a safe restore, not merely an aspirational “no loss” statement. Never reconcile an unknown/revoked recipient by changing a photo's original destination. Lost metadata and lost media are separate metrics; a cloud orphan is not delivered just because its bytes survive.

## A5 — Clamp grants and handle post-cleanup uploads

Targets: [02, Signed transfer grants and cleanup](../../02-technical-architecture.md); [03, Revocation/deletion](../../03-privacy-security.md); [06, Deadlines/failure matrix](../../06-photo-lifecycle-reliability.md).

Proposed contract:

> For each issued storage grant, expiry is the earlier of its short TTL and the photo's absolute server access deadline. After receipt, cancellation, account/device revocation or expiry, the API issues no new grants. Previously issued bearer capabilities and already-started requests remain documented residuals. A signed PUT is not one-use; logical object immutability is enforced by signed checksum/context plus attempt bookkeeping and late-write cleanup, not by the random key alone.

Every issued upload-attempt key stays associated with its terminal/tombstone record. The worker handles failed/superseded attempts and late re-creations as well as canonical objects. Define prompt late-write detection (polling/notifications selected after measurement), cleanup retry and restart behavior. Daily orphan sweeps remain defense in depth and cannot be the only mechanism backing a fifteen-minute cleanup target.

Report separately: API authorization cutoff, issued-capability expiry, upload quiescence, object-deletion observation and late reappearance. Treat p99 ≤15-minute cleanup as a measured objective with a declared denominator, not a physical-erasure guarantee. Requests begun before expiry can outlive grant expiry. M0 tests late PUT, repeated PUT, in-flight-at-expiry, five-minute-before/at/after boundaries and worker restart; production implementation remains blocked until the race contract is accepted.

## A6 — Lender account isolation in borrowing mode

Targets: [01, FR-08/primary journeys](../../01-product-requirements.md); [03, Host threat boundary](../../03-privacy-security.md); [05, Camera/Gallery/Profile](../../05-ui-ux-design.md).

Add a persistent borrowing-mode state. While active or awaiting owner exit, only approved session-camera/review/transfer-status actions are available. Owner-local authentication is required before entering the lender's prior app gallery, profile, linked identities, registered-device controls or any operation that exposes/changes account secrets. Session end, expiry, background/relaunch, notification/deep-link routing and errors must not remove this boundary. Local authentication means the device owner's supported OS authentication, not the borrower's recipient-account login.

The device owner may always stop capture; stopping does not expose owner data. M0 traces each escape route with synthetic prior gallery/account data. This protects only this app's surfaces. It cannot prevent access to another app, lock-screen notifications or the rest of an unlocked device; any OS app-pinning guidance is optional, accurate and not represented as guaranteed protection.

## A7 — Key continuity and minimal verification UX

Targets: [02, Pairing](../../02-technical-architecture.md); [03, Identity/device authorization](../../03-privacy-security.md); [05, Consent](../../05-ui-ux-design.md).

Define the trusted tuple (account, device ID, public signing/encryption key fingerprints and version), where it is pinned, how trust is established and how key replacement, reinstall/new device, trust reset, revoked device and clock/lease transitions behave. First-session verification is meaningful only with this continuity rule. A new device/key requires renewed comparison; original photos never change keys. Use a reviewed comparison/transcript construction with specified entropy, attempt limits and canonical serialization; six words alone is not a protocol. Explicitly document that the service remains trusted for availability and retention enforcement; static recipient-key encryption is not forward secrecy against later device-key compromise. A ratchet is not justified without a new requirement.

QR-first remains the ordinary path; username lookup remains in release scope unless separately deferred. Present roles, recipient device and verification in one consent sheet where possible. Do not add a comparison prompt for every photo or remove bilateral approval. The M0 usability study distinguishes a scripted concept assessment from a genuinely implemented installation/authentication flow. Replace “Needs a new approved session” in 06 with “Both devices must approve recovery,” because the proposed authorization deliberately references the original immutable session context. An online-reservation-only capture MVP could remove this workflow, but reduces offline functionality and needs explicit scope approval.

## A8 — Recipient gallery storage and account transitions

Targets: [01, Nonfunctional/MVP](../../01-product-requirements.md); [03, Retention](../../03-privacy-security.md); [05, Gallery/settings](../../05-ui-ux-design.md); [06, Receipt/save/backpressure](../../06-photo-lifecycle-reliability.md).

Keep the encrypted app copy as a real second copy for the initial product; do not secretly turn the gallery into system-library browsing, which changes permissions/access semantics. Add used-space visibility, explicit app-copy deletion with system-copy explanation, a capacity/full-disk admission policy and batch deletion. Do not silently evict app-only photos, auto-resave photos the user intentionally deleted from the system library or claim uninstall/key loss is recoverable.

Define logout/account switching: a different account cannot access the previous encrypted gallery or pending keys; warn about unsaved app-only photos and document whether previous data remains locally locked or is deleted after explicit confirmation. No implicit key destruction merely to complete logout. The lifecycle table must also cover account deletion: deny new access immediately, clear local recipient gallery/key material on executing online devices after the confirmed deletion workflow, schedule remaining device cleanup, and explicitly disclose that offline devices cannot be remotely erased until execution and OS-exported copies remain user-controlled. Distinguish logout from deliberate account deletion; never imply either removes saved Photos copies. M0 probes key accessibility, interrupted export and account boundary with synthetic data; final storage cap is a product decision after measured size distribution.

## A9 — Costs, roadmap and decision register

Targets: [02, Cost model](../../02-technical-architecture.md); [07, M0/dependencies/schedule](../../07-delivery-roadmap.md); [08, D04/D05/D06/D08/D09 and risk register](../../08-decisions-open-questions.md).

Add cost per successfully received photo, egress/retry amplification, recipient disk amplification and concrete workload/peak inputs. Keep the monolith/direct storage model; compare providers only after region/workload and compatibility facts exist. The source budget is illustrative, not a price quote. API quota checks and two transfers per compliant device are not hard controls on repeated use of already-issued storage URLs. Include actual storage egress/replay metrics, grant lifetime and budget-response behavior; report cost-abuse residuals honestly.

Replace M0 only if the owner approves [the bounded ten-day plan](m0-feasibility-plan.md). Keep accounts/provider login, polished gallery, production backend, full device qualification and release gates outside M0. Permit parallel standalone capture/transfer research only within M0 authorization. Reduce calendar time through parallel verified work, not by deleting soak/device/security/beta evidence. Re-estimate after M0 and an integrated vertical slice; original 24–32 weeks is neither an achieved forecast nor a permanent minimum.

Record B1–B4 as unresolved design gates and A1–A9 as proposed amendments, not accepted ADRs. Complete the separate Claude review before calling the cross-tool review final. No planning file's acceptance status changes automatically when these drafts are written or published.
