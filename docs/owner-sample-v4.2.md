# Ready-to-use Jumo owner demo

Default owner entry now loads an isolated, seeded browser workspace after either demo-login button. Explicit `live=1` or `store` URLs preserve the existing cloud owner flow; `preview=1` always selects the sample. Guest mode is unchanged. No backend, Auth, AI or payment integration changes.

Seed: eight existing Jumo menu items and concept photos, a labeled sample address, a reserved example.com email, four linked orders, three bookings dated at first seed/reset, two customer requests, four conversation histories, inventory examples and two staff tasks. Two orders carry fictional paid status; the demo paid total is 765,000 VND. All sample records are plainly labeled and remain local to the browser.

The manager starts with a welcome card, direct dashboard access and menu/store shortcuts. Menu and store questions now show read-only data cards; sample order acceptance, reservation confirmation, issue review, staff tasks and demo payment use existing local handlers. The sample survives refresh and logout. Reset is a two-click, sample-only action and never changes live store credentials or records.

Sample state uses `modu-jumo-owner-sample-v1`, separate from legacy preview and live cloud storage. Seed cloning prevents frozen order prices/names from mutating the menu. Dates refresh on explicit reset, avoiding silent loss of edited sample data.

Verification:
- 19 tests: linked fixture integrity, calculated totals, nine locales, mode routing, local sample persistence/reset and isolation from existing store records, plus existing app tests.
- Browser: one-click entry, populated dashboard, order acceptance, booking confirmation after refresh, typed booking request and eight read-only menu cards.
- Mobile: portrait and landscape layouts checked without horizontal overflow. The explicit live-store route still loads the previously registered store after sample edits and reset.
