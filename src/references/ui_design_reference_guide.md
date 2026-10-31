# Rickshaw System UI Design Guide

Use this guide to keep the homepage, role dashboards, shared controls, and AI assistant visually consistent.

## Design direction

- Calm, practical, and welcoming for drivers, owners, and administrators.
- Use a light slate canvas, white surfaces, and emerald for primary actions and emphasis.
- Prefer clear hierarchy and restrained depth over decorative glass effects.
- Keep operational information readable and easy to scan, especially on mobile.

## Color and surfaces

- App canvas: `bg-slate-50` with subtle, low-contrast emerald or sky ambient accents.
- Main surface: `bg-white`, `border-slate-200`, and a soft shadow.
- Primary action: `bg-emerald-700 text-white hover:bg-emerald-800`.
- Primary text: `text-slate-900`; secondary text: `text-slate-600`.
- Status colors are semantic: emerald for success/live, amber for attention, red for errors/destructive actions.
- Reserve gradients for small accents or hero surfaces. Do not use a dark full-width section unless the content specifically calls for it.
- Avoid low-opacity text and decorative effects that reduce contrast.

## Layout and spacing

- Main content width: `max-w-7xl` for dashboards and `max-w-6xl` for focused content.
- Page gutters: `px-4 sm:px-6 lg:px-8`.
- Keep section rhythm consistent with `space-y-5` or `space-y-6`.
- Card padding: `p-4 sm:p-5` for compact panels and `p-5 sm:p-6` for primary panels.
- Use responsive grids that collapse to one column on narrow screens.

## Typography

- Page title: `text-xl sm:text-2xl font-bold tracking-tight text-slate-950`.
- Section title: `text-base sm:text-lg font-semibold text-slate-900`.
- Body: `text-sm sm:text-base leading-6 text-slate-600`.
- Labels and metadata should remain readable; avoid tiny text for important actions or statuses.
- Respect the persistent larger-text setting and allow content to wrap without clipping.

## Cards and dashboard panels

- Use the shared `Card` component for dashboard sections and metrics.
- Keep card styling consistent: white surface, subtle slate border, `rounded-2xl`, and a restrained shadow.
- Group related actions and data; use thin dividers rather than nested heavy borders.
- Use clear loading, empty, and error states with text as well as color.
- Maps may use their own map surface, but surrounding controls and details should follow the shared card style.

## Buttons and inputs

- Aim for at least 40px control height; prefer 44–48px for primary actions.
- Use emerald primary buttons consistently and outline/neutral variants for secondary actions.
- Keep focus indicators visible; do not remove keyboard outlines without a clear replacement.
- Inputs need visible borders, readable placeholder contrast, and a distinct focus state.
- Make icon-only controls at least 40px where practical and provide an accessible name.

## Dashboard structure

- All three role dashboards use `DashboardLayout` for the shared canvas, title treatment, spacing, and card styling.
- Keep role-specific content and permissions intact; only presentation is shared.
- Give metric cards consistent sizing and typography; keep urgent statuses distinct and obvious.
- Keep forms, tables, lists, alerts, and map panels responsive and scannable.

## AI assistant

- Use the same slate/white/emerald palette as the dashboard.
- Keep the panel readable at mobile widths, with clear user/assistant message contrast.
- Suggestions must remain easy to tap and should wrap or scroll without obscuring the message composer.
- Keep loading and error feedback visible; retain keyboard submission and accessible control names.

## Motion and accessibility

- Use subtle transitions and respect `prefers-reduced-motion`.
- Preserve keyboard navigation and visible focus states.
- Do not communicate status with color alone.
- Keep touch targets generous and text contrast strong.
- Check both English and Bangla layouts, including the larger-text setting and narrow viewports.

## Before shipping

- [ ] Homepage and all dashboards feel like the same product.
- [ ] Cards, buttons, forms, and chatbot use the same visual language.
- [ ] Content wraps without clipping at narrow widths and enlarged text.
- [ ] Keyboard focus and accessible names are present.
- [ ] Loading, empty, success, and error states remain easy to distinguish.
- [ ] Existing feature behavior and role-based access are unchanged.
