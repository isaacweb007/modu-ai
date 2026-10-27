# Demo entry, version 4.1

The owner screen offers email and Google buttons. Both enter the demo immediately, without collecting an email, creating an Auth user, sending email, or starting OAuth. A visible sample-demo notice explains this. A sessionStorage flag only controls this presentation state; it is not accepted as API authorization.

Logout pauses realtime, clears this flag and removes manager records from the rendered page. It preserves the existing browser store credential so the next demo entry can restore the same store, menu, orders and reservations. The recovery-code UI is removed. Cross-device owner identity is deferred until actual authentication is requested. Guest QR access and server storage continue unchanged, using the existing scoped capability tokens. Real AI and payments remain disconnected.

The initial account schema migration was applied before the user clarified the demo-only scope. A guarded forward migration restores the original owner schema, refusing to run if an account was linked. No account routes or Auth configuration were deployed. Both migrations are retained to match remote migration history.

Validation on 2026-10-27:
- 16 existing local tests passed.
- Live cloud tests passed: independent guest sessions, server-priced idempotent orders, realtime invalidations, reservation ownership, private complaint records, media, stale-write checks and direct REST denial.
- Security advisor returned no findings after the forward migration.
- Browser: both buttons enter the existing store; logout returns to the entry screen; saved order, confirmed reservation and complaint remain in the dashboard.
- Korean at 390px and Hindi at 320px checked; nine translation key sets match. The project book describes demo-only sign-in in all nine languages.
