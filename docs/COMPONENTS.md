# Component Documentation

## Design System Components

Located in `frontend/src/components/ui/comic-panel.tsx`

### ComicPanel

Primary container — white background, 4px black border, 8px hard shadow.

```tsx
<ComicPanel title="Section Title" tilt={0.5} hover>
  {children}
</ComicPanel>
```

Props: `title`, `tilt` (degrees), `hover` (enable pop effect), `className`

### ComicButton

Mechanical press button with shadow offset animation.

```tsx
<ComicButton variant="primary" onClick={handler}>Action</ComicButton>
```

Variants: `primary` (yellow), `secondary` (white), `tertiary` (cyan)

### ComicBadge

Status/tag indicator with uppercase mono text.

### ProgressBar

Segmented caution-tape style progress indicator.

### StatCard

Analytics metric display for dashboard scores.

## Layout

### Sidebar (`components/layout/sidebar.tsx`)

Fixed 256px navigation with comic-style active states. Wraps all pages via `AppShell`.

## State Management

### Zustand Store (`lib/store.ts`)

- `scenarioId` — active demo scenario
- `studentId` — linked backend student (when API available)
- Persisted to localStorage

## Demo Data (`lib/demo-data.ts`)

Fallback data for all 5 scenarios when backend is offline. Each scenario includes full dashboard payload.

## Pages

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | HomePage | Magic dashboard with live feed |
| `/companion` | CompanionPage | Dragon evolution + AI chat |
| `/goals` | GoalsPage | AI roadmap generation |
| `/planner` | PlannerPage | Schedule optimization |
| `/intelligence` | IntelligencePage | Announcement feed + AI analysis |
| `/network` | NetworkPage | Matching + campus graph |
| `/recommendations` | RecommendationsPage | Hybrid engine output |
| `/demos` | DemosPage | Scenario launcher |

## CSS Utilities (`globals.css`)

- `.comic-panel` — panel styling
- `.comic-button` — button press effect
- `.halftone-bg` — dot pattern overlay
- `.caution-bar` — yellow/black stripe header
- `.speech-bubble` — companion chat bubbles
- `.progress-segment` — striped progress fill

## Fonts

- **Anton** — headlines (uppercase)
- **Hanken Grotesk** — body text
- **Space Mono** — labels and metadata
