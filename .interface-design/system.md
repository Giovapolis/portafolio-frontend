# Design System — Brandon G. Castañón CV

## Direction & Feel
Dark PCB workshop / engineering console aesthetic. The CV as a precision instrument panel — deep void background with purple-magenta glow, animated cyan circuit traces, terminal-styled decorations, and oscilloscope-waveform accents.

## Depth Strategy
Surface-color shifts (whisper-quiet elevation via lightness changes). No shadows on dark — borders-only for definition. Borders use low-opacity rgba to blend with background: `rgba(185, 137, 255, 0.14)` standard, `rgba(195, 155, 255, 0.26)` emphasis.

## Color Palette
- `--cv-void: #08040f` — Deepest background
- `--cv-abyss: #12091f` — Secondary background
- `--cv-panel: rgba(27, 14, 46, 0.82)` — Card surface
- `--cv-violet: #8b5cf6` — Primary brand
- `--cv-violet-hot: #c084fc` — Hover/accent
- `--cv-electric: #22d3ee` — Cyan accent (circuit traces, interactive)
- `--cv-copper: #f59e0b` — Engineering accent (code numbers)
- `--cv-terminal: #4ade80` — Terminal green (code strings, prompts)
- `--cv-text: #f7f2ff` — Primary text
- `--cv-soft: #c9b8e6` — Secondary text
- `--cv-muted: #927baa` — Tertiary/metadata text

## Hierarchy
- **Display**: 2.45–5.9rem / 800 weight / -0.055em tracking / name is hero
- **Eyebrow**: Mono font / 0.72rem / 700 weight / `//` comment prefix + cyan line
- **Lead**: 1.02–1.24rem / secondary color / wide line-height
- **Section heading**: 750 weight / -0.025em tracking
- **Body**: 0.86rem / muted color
- **Ternary levers**: weight, color/opacity, size (never size alone)

## Typography
- Primary: `"Segoe UI", Inter, ui-sans-serif, system-ui, -apple-system, sans-serif`
- Code/monospace: `"Cascadia Code", "Fira Code", "JetBrains Mono", ui-monospace, monospace`
- Eyebrow, skill names, terminal prompt use monospace for engineering feel

## Spacing
- Base unit: 8px (0.5rem)
- Card padding: 24px (1.5rem)
- Section gap: 24px (1.5rem) between cards
- Micro gaps: 8–12px between related elements

## Border Radius Scale
- Small: 10px (inputs, skill pills)
- Medium: 18px (cards)
- Large: 28px (hero section)

## Signature Elements
1. **Animated circuit traces** — PCB-style grid lines that pulse via `trace-pulse` keyframe
2. **Terminal prompt** — `$ command` with blinking cursor in hero
3. **Code comment eyebrows** — `// Section Name` prefix on all eyebrow labels
4. **Via dots** — Solder-pad circles at grid intersections on body background
5. **Electron flow** — Animated shimmer across skill bar fills via `electron-flow` keyframe
6. **Timeline via dots** — Circle bullets on timeline items with glow

## Key Component Patterns
- `Button primary` — 42px h · pill shape (999px radius) · 800 weight · violet→cyan gradient bg · scale 0.98 on active
- `Card` — 18px radius · `--cv-line` border · `--cv-panel` gradient bg · hover lift 3px + glow
- `Skill pill` — 12px radius · mono font name · 4px bar with electron shimmer · level label tabular-nums
- `Metric node` — 16px radius · top accent line · tabular-nums for count

## Animations
- `electron-flow` (3s linear infinite) — shimmer across skill bars
- `trace-pulse` (3–6s ease-in-out infinite) — opacity pulse on circuit traces
- `via-glow` (3s ease-in-out infinite) — glow pulse on solder pad dots
- `blink-cursor` (1s step-end infinite) — terminal cursor blink
- All respect `prefers-reduced-motion: reduce` (0.01ms duration override)
