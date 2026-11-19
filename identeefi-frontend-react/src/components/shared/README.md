# Shared UI

Design tokens live in `src/theme/tokens.js`. Breakpoints: xs0, sm480, md768, lg1024, xl1280.

- `Logo` – `to`, `size`, `hideText`; also exports `Mark`.
- `Avatar` – `name`, `image` (filename or URL), `kind` ('profile'|'product'), `size`, `rounded`. Falls back to initials.
- `PhotoUploader` – `label`, `file`, `onChange(file|null)`, `existing` (stored filename), `kind`, `error`, `required`. Shows a preview.
- `CustodyRail` – `steps`, `reached`, `vertical`. Manufacturer → Supplier → Retailer → You.
- `MiniRail` – `total`, `reached`, `label`. Small rail for table rows.
- `JourneyLog` – `entries` [{id, actorName, actorImage, role, location, time, isSold}], `newestFirst`.
- `TxProgress` – `steps`, `current`, `error`.
- `WalletChip` – no props.
- `Verdict` – `status` ('authentic'|'fake'|'pending'), `title`, children.
- `AppShell` – authenticated layout (tab bar <768, icon rail 768–1023, sidebar ≥1024); renders `<Outlet/>`.

Utilities: `utils/photos.js` (`productPhotoUrl`, `profilePhotoUrl`, `initials`), `utils/roles.js` (`NAV_BY_ROLE`, `ROLE_LABEL`, `homeFor`).
