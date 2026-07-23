# frontend-cv-gio — Next.js 16 Portfolio Frontend

## Commands
- `npm run dev` — Start dev server at `http://localhost:3000`
- `npm run build` — Production build (TypeScript + Next compilation)
- `npm run start` — Start production server
- `npm run lint` — ESLint 9 (Next core-web-vitals + TypeScript rules)
- `npm test` — Vitest run (jsdom, `@/` alias)
- `npm run test:watch` — Vitest watch mode
- Prefer `npm ci` for clean installs; `package-lock.json` is committed.

## Tech Stack
- **Framework**: Next.js 16 (App Router), React 19
- **Language**: TypeScript 5
- **Styling**: Bootstrap 5 (global import via `layout.tsx`) + `react-bootstrap` components + custom CSS in `globals.css`
- **HTTP**: Axios
- **Testing**: Vitest + `@testing-library/react` + `jsdom`
- **Build**: Tailwind CSS 4 is installed + PostCSS-configured but NOT imported in `globals.css` — do not assume Tailwind utilities are active.

## Project Structure
```
src/
  app/                           # Next.js App Router pages
    layout.tsx                   # Root layout: imports Bootstrap CSS, renders <Header /> + children
    page.tsx                     # Home (public CV): loads all data sections, renders CV hero/contact/experience/education/skills/projects/courses/blog — client component
    globals.css                  # Custom CSS classes (cv-page, cv-hero, timeline-list, etc.)
    login/page.tsx               # Login form — client component, uses auth service
    register/                    # Placeholder (empty)
    dashboard/page.tsx           # Admin dashboard — client component, requires auth
    profile/page.tsx             # Profile editor — client component, uses profile service
    public/profile/[profileId]/  # Public profile by ID
    public/user/                 # Placeholder (empty)
  components/
    Header.tsx                   # Navbar with login/logout based on auth state
    ProfileForm.tsx              # Profile edit form
    ExperienceForm.tsx           # Experience CRUD form
    EducationForm.tsx            # Education CRUD form
  context/
    AuthContext.tsx              # React context for auth state: reads token from localStorage, calls GET /auth/me
  services/                      # API wrapper layer (all use Axios + NEXT_PUBLIC_API_URL)
    auth.service.ts              # POST /auth/login (form-urlencoded)
    user.service.ts              # GET /auth/me
    profile.service.ts           # GET /profile/, PUT /profile/
    experience.service.ts        # CRUD /experience/
    education.service.ts         # CRUD /education/
    skills.service.ts            # CRUD /skills/
    projects.service.ts          # CRUD /projects/
    courses.service.ts           # CRUD /courses/
    blogs.service.ts             # CRUD /blog/
    cv.service.ts                # GET /cv/pdf (blob download)
  types/
    profile.ts                   # Profile interface
    experience.ts                # Experience interface
    education.ts                 # Education interface
  test/
    setup.ts                     # Vitest setup
    services/
      auth.service.test.ts       # Auth service unit tests
      profile.service.test.ts    # Profile service unit tests
  lib/
    errors.ts                    # Error handling utilities
```

## Authentication Flow
- Login sends username+password to `POST /auth/login` → receives `{ access_token, token_type, user }`
- Token stored in `localStorage` as `access_token`
- `AuthContext` on mount reads token from localStorage, calls `GET /auth/me` to validate and get user
- Service functions receive token explicitly and set `Authorization: Bearer ...` header
- `Header` renders outside `AuthProvider` in `layout.tsx` — auth-aware header changes may need provider wrapping

## Key Known Issues & Quirks
- `src/app/page.tsx` loads all CV sections using service layer functions (no longer hardcodes profile IDs)
- **Dashboard loads all data in `Promise.all`** — each non-essential endpoint now has `.catch(() => [])` to prevent any single endpoint failure from blocking the entire dashboard.
- **Nginx at `/api/` strips the prefix** — FastAPI backend receives paths like `/experience/`, `/skills/`, etc. Nginx rewrites `/api(/.*)$` → `$1` before proxying to `localhost:8000`.
- Bootstrap CSS imported globally in `layout.tsx`; components use `react-bootstrap`
- Tailwind installed but not imported — custom CSS in `globals.css` handles all styling
- `/Detras.png` and `/logo.png` referenced but missing from `public/`
- `register/` and `public/user/` are empty placeholders
- `NEXT_PUBLIC_API_URL` defaults to `http://localhost:8000`; copy `.env.example` to `.env.local` to override
- `register/page.tsx` exists at directory level but is empty
- `.env*`, `.next/`, `out/`, `build/`, `next-env.d.ts` are gitignored

## Testing
- Vitest with jsdom environment; `@/*` alias configured in `vitest.config.ts`
- Test files live in `src/test/` mirroring `src/` structure
- `src/test/services/auth.service.test.ts` — tests login function with mocked Axios
- `src/test/services/profile.service.test.ts` — tests profile CRUD with mocked Axios

## Deploy (Docker - VPS)

### Estructura en el servidor
```
/srv/portafolio-frontend/
├── (código clonado)
├── .env.local          ← NEXT_PUBLIC_API_URL=http://<IP_DEL_BACKEND>:8000
└── docker-compose.yml
```

### docker-compose.yml (crear en el VPS)
```yaml
services:
  frontend:
    build: .
    container_name: portafolio-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file: .env.local
```

### Comandos de deploy
```bash
cd /srv/portafolio-frontend
git pull
docker compose build --no-cache
docker compose up -d --force-recreate
```
