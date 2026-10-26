# 03 — Privacy & Security Specification

Status: proposed security contract, requiring specialist review before production. Date: 27 October 2026.

## Guarantees, assumptions and boundaries

The compliant host app does not save borrowed-session media to the host's Photos/MediaStore library, including via deferred photo proxies. It encrypts persistent host queues, uploads ciphertext, and removes session review access when the local session ends. Only the approved recipient device receives the content-key envelope. Server authorization governs new transfer grants; it cannot erase plaintext already seen or copied.

These guarantees assume signed, uncompromised app/OS execution, functioning cryptographic libraries and correctly authenticated device keys. Host hardware necessarily sees live preview and capture plaintext; its owner can inspect the screen, photograph it, record it, modify the device or extract app data on a compromised system. iOS cannot provide a general prohibition on screenshots. Android screenshot protections are defense in depth, not a confidentiality guarantee. Cover app-switcher snapshots and suppress previews when backgrounded where supported; validate actual OS behavior.

No promise of “photos never exist on Alex's phone,” forensic secure erase, deletion from another person's screenshots, or removal from iCloud/Google Photos after recipient export. Product copy should say “This app won't save these photos to the lender's photo library.”

## Assets and adversaries

Assets: photo bytes and EXIF, recipient routing, content keys, device credentials, consent records, cloud grants, gallery export status and deletion state.

Trust boundaries: two device sandboxes; OS library/cloud backup services; authenticated API; metadata DB; object store; notification providers; third-party identity providers. APNs/FCM carry no photographs or decryption keys. Administrators can see limited routing metadata; access is logged and least-privileged.

| Threat | Required protection | Residual risk / test |
| --- | --- | --- |
| Wrong recipient, QR substitution | Roles and usernames shown on both phones; session transcript binds keys; compare QR fingerprint/code | Users can approve a deceptive identity; test deliberate substitution |
| Replayed invitation/approval | High-entropy single-use invite, short TTL, atomic consumption, signed transcript | Compromised endpoints can lie; replay and concurrency tests |
| Object-level authorization bypass | Device/user/role checks for every reservation, sync, download and receipt | Test cross-user IDs and revoked devices systematically |
| Stolen refresh token | Secure storage, short access TTL, rotation/reuse detection and device proof for sensitive actions | Unlocked compromised device remains powerful |
| Storage breach or intercepted traffic | End-to-end photo encryption, TLS, private bucket and provider at-rest encryption | Sizes, timing and routing remain visible |
| Malicious backend key substitution | QR/out-of-band key verification; bind fingerprints in both approvals | Username trust-on-first-use is weaker; no transparency log in MVP |
| Tampered/truncated photo, recipient swap | AEAD; manifest context binding; ciphertext checksums; strict size limits | AEAD protects integrity, not safe image decoding; sandboxed OS decoders and dimension limits still needed |
| Malicious/abusive sender | Consent, block/report, request quotas, no unsolicited library writes before approval | E2EE prevents server content inspection; release policy must address this honestly |
| Host or recipient screenshots | Clear boundary copy, limited host review, no host export | Cannot reliably prevent copying; never advertise otherwise |
| Expiry/deletion failure | Immediate authorization cutoff, durable cleanup jobs, deletion verification and alerts | Physical storage and backups cannot promise instant erasure |
| Denial of service/cost abuse | Reservation/byte quotas, exact lookup throttling, account/device rate limits | Provider abuse and credential farms need operational response |

## Identity and device authorization

Identity-provider login proves control of an account, not legal identity. Device registration requires recent login and possession of fresh signing/encryption keys. Record account-bound device keys and their versions. Never silently replace a recipient key for an existing session or photo. Lost keys require new device registration and new pairing; old undelivered photos may be unrecoverable.

QR invitation is a pairing capability only. Verification code derives from the full session transcript, not a name or short invitation ID. Proposed comparison: six words or an equivalently reviewed high-entropy short-authentication string. Limit failed confirmations; reissue on mismatch. Have the cryptographic reviewer select the exact construction and entropy rather than improvising a protocol.

For remote username pairing, show “Verify this person” and a comparison code that users can compare through a trusted channel. Without that comparison, assurance is trust-on-first-use against the service key directory. Default recommendation: require verified comparison for the first session; if friction proves unacceptable, explicit acceptance of weaker assurance is a product/security approval, not an invisible fallback.

Require reauthentication for adding/linking identities, account deletion and device changes. Revoking a device closes its sessions and blocks new grants immediately at the API. Short-lived access tokens do not override DB revocation checks on sensitive operations. Show registered devices and last activity in Settings, without exposing private keys.

## Photo encryption proposal

Use an audited implementation of a standard envelope design, not handwritten cryptography. Proposed profile: fresh random 256-bit content key per photo, AES-256-GCM for photo bytes and private manifest, and RFC 9180 HPKE for wrapping the key to the recipient's device public key. Select a mutually supported HPKE suite after verifying both platforms' maintained libraries and interoperability. This is a design proposal, not a claim that identical native APIs exist on both minimum OS versions. [HPKE standard](https://www.rfc-editor.org/rfc/rfc9180).

Specify a versioned envelope: protocol version, photo/session IDs, sender and recipient device/key IDs, capture sequence, ciphertext size/hash, algorithm IDs, AEAD nonce, wrapped key and authenticated private manifest. Bind immutable IDs and key fingerprints as associated data. Sign the immutable envelope with the host's approved device signing key so the recipient authenticates the sender. Do not use mutable transfer status or expiry changes as AEAD context.

Nonce uniqueness is mandatory for each key; use fresh content keys and fresh nonce per encryption operation. Retrying upload reuses immutable ciphertext rather than re-encrypting under reused key/nonce. Any changed manifest/payload receives new encryption material. Reject unsupported versions, wrong routing, malformed dimensions, unexpected file types and failed authentication before gallery insertion.

The host initially protects its content key with a device-local wrapping key for crash recovery. Once cloud commit is verified, discard the host's local content-key wrapper and photo ciphertext; the remaining recipient envelope cannot be opened by the compliant host. The recipient rewraps the photo key under its own gallery protection and durably commits before receipt. Cloud never receives a host-decryptable wrapper or device private key.

Store OS-protected wrapping/signing keys using Keychain/Android Keystore-backed protection. Hardware-backed availability varies; do not assume every encryption primitive/private key is directly supported in secure hardware. Do not require biometric prompts per photo. Proposed key accessibility allows transfer after the first device unlock after reboot; assess this privacy/background trade-off in M0. Before first unlock, show delayed status later and retry; never weaken encryption to meet a timing target.

No service-side key escrow in MVP. Reinstall, key loss or device replacement can lose app-only photos and pending deliveries. A normal account login does not decrypt historical media. Warn before logout, reinstall guidance and device removal. A backup/recovery feature would be a separate architecture and consent decision.

## Session permissions and revocation

Session approval grants: capture for one immutable recipient, encrypted staging of committed captures, delivery to the named device and optional temporary last-photo review. It does not grant remote camera activation, recipient gallery access or export to the host library.

- **End session:** stop new captures/reservations; locally clear review immediately. Deliver previously committed photos normally.
- **Cancel undelivered photo:** recipient or host can cancel their session's undelivered photo; revoke new grants and schedule deletion. Already received recipient copies cannot be recalled. Show when status is uncertain or already received.
- **Revoke device/account:** stop new grants, invalidate refresh credentials and close active sessions. Offline devices learn on sync or lease expiry; server revocation is not instantaneous offline UI revocation.

A local capture lease is at most two hours, bounded by session expiry; inactivity ends local capture after 15 minutes. Offline review clears at local end or inactivity timeout in a compliant app. Wall-clock rollback must not extend a lease: use server timestamps plus monotonic elapsed time; after reboot require online revalidation for further capture/review. Already reserved encrypted queued uploads may obtain fresh upload grants after ordinary session end until media expiry, but not after cancellation or device/account revocation. Unreserved offline photos require a new bilateral recovery approval referencing the unchanged original encrypted context; this is a separate signed authorization, not a reassignment or re-encryption under a new session. Recovery cannot extend local retention or change recipient/key. If either original device/key is unavailable, offer explicit discard rather than silent rerouting.

Signed storage URLs are bearer capabilities. Proposed PUT TTL 15 minutes and GET TTL five minutes; there is no promise of instant individual URL invalidation. A GET begun before expiry may continue, and downloaded ciphertext plus an already obtained key cannot be recalled. Deleting the object prevents future successful reads once deletion completes; deny new grants immediately. Never display URLs in analytics, logs or support exports. [S3 signed URL behavior](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html).

## Retention and deletion

| Data | Proposed rule |
| --- | --- |
| Host preview/last-capture plaintext | Memory only for current session review; clear on end/background; unavoidable OS/internal buffers acknowledged |
| Host private queue | Encrypted; delete after verified cloud staging, otherwise expire at capture +72h |
| Cloud media/encrypted envelopes | Delete after authenticated durable recipient receipt; hard access expiry reservation +72h; no extension by retry |
| Recipient app gallery | Encrypted until user deletion/uninstall; no automatic app-data backup of photos or keys |
| Recipient system library | User-controlled; potentially synced/backed up by the OS; app deletion does not remove these copies |
| Operational logs | 14 days, no photo content or secrets |
| Security audit/tombstones | 30 days proposed; only IDs, action and minimal retention facts |
| DB backups | 14-day encrypted rotation; restored data filtered through the independently durable current deletion/revocation journal before service access |

Queue cleanup runs every five minutes with p99 removal target ≤15 minutes and alert at 30 minutes. S3 lifecycle is an eventual backstop, not an exact deadline; versioning must stay disabled for this media bucket or every version needs explicit deletion. [S3 expiry semantics](https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-expire-general-considerations.html).

“Delete” means access denied and app/provider deletion requested and verified to the extent APIs permit. Flash wear leveling, provider internals, OS caches, offline hosts and backups prevent a universal physical-erasure deadline. Offline host deletion is enforced on next execution; media may remain encrypted on disk until then. Do not claim that an app can execute deletion while it is uninstalled, force-stopped or powered off.

Persist deletion and revocation intent in the independent control-record journal before acknowledging the operation; if that write cannot complete, fail closed for affected grants and retry. Journal replay covers photo cancellations and account/device revocations, not only media deletion. Keep all grants disabled after a restore until journal completeness is verified.

Account deletion immediately disables routing and grants; schedule active media, identity links and profile deletion within 24 hours, with confirmation of pending cleanup. Explain backup rotation, minimal security retention and saved system-library copies. Provide in-app and web request paths. Final retention and jurisdiction-specific obligations need launch-region legal review; do not invent a legal basis or exemption.

## Release security evidence

Require a reviewed protocol specification and interoperable test vectors before real-user media; tests for nonce/key uniqueness, wrong-key rejection, transcript substitution, replay, malformed envelopes and revoked-device races. Audit backup leakage, thumbnails, app-switcher snapshots, logs and crash reports on physical devices. Commission independent review of authorization and cryptographic integration before beta expansion; resolve all critical/high findings and all photo-routing defects before release. Run an incident drill for stolen signing credentials, media access breach and cleanup failure. No implementation or review has yet been performed.
