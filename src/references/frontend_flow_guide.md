# Frontend flow guide

This guide follows the handwritten React source under `src/`. Most components
render UI and coordinate feature APIs; server records are cached by RTK Query,
while Redux `ui` state holds display preferences.

## App entry, layout, and routing

1. `main.tsx` mounts `app/App.tsx` into the HTML root.
2. `app/App.tsx` wraps the app in `HashRouter` (so dashboard links work on
   static hosting), then renders `app/Providers.tsx`, `routes/AppRoutes.tsx`,
   and the global `features/ai/components/AiAssistant.tsx`.
3. `app/store.ts` combines the shared RTK Query cache from
   `shared/api/baseApi.ts` with `store/uiSlice.ts`. `app/hooks.ts` exposes the
   typed Redux hooks.
4. `routes/AppRoutes.tsx` nests public and dashboard pages inside
   `layouts/AppLayout.tsx`; `shared/components/layout/Header.tsx` and
   `Footer.tsx` frame each page.
5. `shared/components/RequireRole.tsx` checks `shared/authSession.ts` before
   rendering a dashboard. `/admin` accepts `admin` and `super_admin`, `/owner`
   accepts `owner`, and `/driver` accepts `driver`. This is a client-side
   navigation boundary; backend endpoints remain responsible for authorization.

## Sign-in and the landing page

`pages/HomePage.tsx` selects the English or Bengali `HOME_TEXT` pack from
`shared/types/home.content.ts`. It redirects an existing valid session to its
role dashboard, otherwise it displays the landing content and
`shared/components/home/AuthCard.tsx`.

`AuthCard` lets visitors choose a role and mode:

- `features/auth/components/LoginForm.tsx` posts credentials to `/api/auth/login`.
  It validates the returned role, saves the token/user/role in local storage,
  then tells `HomePage` to navigate to the matching dashboard.
- `features/auth/components/RegistrationForm.tsx` posts driver or owner details
  to `/api/auth/register`; the response is presented as pending administrator
  approval. Admin registration is not offered.
- `features/auth/components/ScanId.tsx` is an image picker that returns a
  selected file to its parent; it is not part of the current registration form.

The homepage story is `shared/components/home/RickshawStory.tsx`, with
bilingual copy and source links in `HOME_TEXT`. `shared/components/home/FeatureGrid.tsx`
shows product capabilities. `HeroSection.tsx` and `InfoStatsSection.tsx` are
available presentation components but the current `HomePage` renders its hero
directly and does not mount those two components.

## Role dashboards and feature flows

Each page uses `shared/components/layout/DashboardLayout.tsx` for dashboard
heading and framing:

- **Admin — `pages/admin/AdminDashboardPage.tsx`:** reads summary and search
  data from `api/adminApi.ts`; composes `AdminApprovals`,
  `AdminFleetActions`, `AdminFleetControls`, `AdminComplaintInbox`,
  `AdminSearchBar`, `SearchResults`, and `FleetLocationMap`. Selecting a driver
  in search sets the map's selected driver.
- **Owner — `pages/owner/OwnerDashboardPage.tsx`:** loads vehicles through
  `features/rickshaws/api/rickshawApi.ts`, plan status through
  `features/subscriptions/api/subscriptionApi.ts`, and locations through
  `features/tracking/api/locationApi.ts`. It composes
  `OwnerSubscriptionPanel`, `RickshawRegistrationForm`,
  `RickshawFleetManager`, `FleetLocationMap`, and `OwnerIssueReport`.
  `RickshawFleetManager` combines vehicle rows, `RickshawDriverAssignment`,
  `LostRickshawAlert`, pending fleet actions, and location status.
- **Driver — `pages/driver/DriverDashboardPage.tsx`:** reads cached identity as
  a fallback, then `features/driver/components/dashboard/DriverDashboard.tsx`
  loads the server profile through `features/driver/api/driverApi.ts`. The
  dashboard combines assignment details, `DriverGpsPanel`,
  `LostRickshawAlert`, and `DriverIssueReport`.

Tracking flow: the driver explicitly starts GPS in
`features/tracking/components/DriverGpsPanel.tsx`; browser geolocation updates
are sent through `locationApi.ts` to the server. `FleetLocationMap.tsx` polls
the role-scoped location query and distinguishes live from last-known points.
`DriverLocationButton.tsx` passes a selection to its parent dashboard, which
passes the driver ID back to the map. The map also displays reported accuracy
and timestamps.

Fleet actions use `features/rickshaws/api/fleetActionApi.ts`: drivers/owners
can report a lost vehicle, owners can request removal, and the admin queue can
review these actions. Vehicle assignment and status use `rickshawApi.ts`.
User reports share `features/complaints/components/ComplaintForm.tsx` and
`features/complaints/api/complaintApi.ts`; driver and owner report components
provide role-specific wording, while `AdminComplaintInbox.tsx` reviews them.
Owner plan details and hosted checkout use `subscriptionApi.ts` and
`OwnerSubscriptionPanel.tsx`.

Admin data flows through `api/adminApi.ts` for summaries, approvals, driver
status, and search. Feature widgets call generated RTK Query hooks; mutation
tag invalidation refreshes affected cached lists. The shared
`shared/api/baseApi.ts` supplies the `/api` base URL and stored bearer token.

## Localization and accessibility

`store/uiSlice.ts` owns `lang` (`en`/`bn`) and `largeText`; `Header.tsx` persists
their changes in local storage. `shared/i18n.ts` translates matching UI strings
and falls back to the original text. Homepage content is authored as complete
English/Bengali text packs in `shared/types/home.content.ts`. The header also
updates the document language and large-text class, and dashboard motion
respects reduced-motion preferences. Interactive controls use labels or
accessible names and visible focus styles.

## AI assistant

`AiAssistant.tsx` is mounted once in `app/App.tsx`, alongside routed pages, so
it remains available across the app. It reads the current UI language and
authenticated role, shows role-appropriate translated suggestions, and sends
the user's message and language through
`features/ai/api/aiApi.ts` (`POST /api/ai/chat`). Replies and conversation state
stay in the frontend component; changing the active token clears the visible
conversation. The backend may answer locally without an AI provider key or use
its optional provider, but role-scoped data and authorization are handled by
the backend.

## Shared UI and supporting files

`components/ui/` contains reusable Base UI wrappers. Feature components own the
application behavior and connect these primitives to state or API hooks; edit
the wrapper when a shared control's appearance or behavior should change
everywhere.

| UI files | What they provide |
| --- | --- |
| `button.tsx`, `input.tsx`, `textarea.tsx`, `label.tsx`, `input-group.tsx` | Form controls and their shared styling. |
| `checkbox.tsx`, `radio-group.tsx`, `switch.tsx`, `select.tsx`, `combobox.tsx` | Selection and toggle controls. |
| `card.tsx`, `badge.tsx`, `avatar.tsx`, `progress.tsx`, `skeleton.tsx`, `chart.tsx` | Content surfaces, status labels, visualizations, and loading indicators. |
| `accordion.tsx`, `tabs.tsx`, `table.tsx`, `breadcrumb.tsx`, `separator.tsx`, `sidebar.tsx` | Page structure, navigation, and grouped content. |
| `dialog.tsx`, `alert-dialog.tsx`, `dropdown-menu.tsx`, `popover.tsx`, `sheet.tsx`, `tooltip.tsx`, `command.tsx`, `sonner.tsx` | Overlays, contextual actions, keyboard commands, and toast notifications. |

Map widgets use React Leaflet. `lib/utils.ts` contains shared class-name
helpers. `hooks/use-mobile.ts` is a responsive breakpoint hook.
`features/driver/components/DriverProfile.tsx` and
`features/admin/components/SuperAdmin.tsx` are standalone UI components, not
part of the active role routes; `features/traffic/components/TrafficHeatmap.tsx`
shows a randomized sample rather than API traffic data. `shared/lib/auth.ts`
is a legacy role-only helper using a different local-storage key; the active
route flow uses `shared/authSession.ts`.
