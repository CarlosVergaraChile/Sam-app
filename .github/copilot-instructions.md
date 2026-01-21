# SAM v6 - Copilot Coding Agent Instructions

## Repository Overview

**SAM v6** (Sistema de Apoyo a Maestros v6) is a Next.js 14 SaaS platform for AI-powered evaluation of handwritten student responses. The application integrates OCR, multiple LLM providers, payment processing (Stripe & Mercado Pago), and WhatsApp messaging for educational institutions in Latin America.

- **Repository Size**: ~573MB (with node_modules), ~30MB (source only)
- **Files**: 29 TypeScript/TSX files in `app/` directory
- **Type**: Full-stack Next.js 14 application with API routes
- **Primary Language**: TypeScript
- **Target Runtime**: Node.js 20.x
- **Framework**: Next.js 14.0.0+ with App Router
- **Deployment**: Vercel (auto-deploy on push to main)

## Technology Stack

- **Frontend**: React 18, Next.js 14 App Router, TypeScript 5
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: Supabase (PostgreSQL) - optional for current phase
- **Authentication**: Supabase Auth (stub phase)
- **Payments**: Stripe + Mercado Pago
- **AI/LLM**: Multi-provider router (Gemini, OpenAI, DeepSeek, Anthropic, Perplexity)
- **Styling**: Inline styles + globals.css (no CSS framework)
- **State Management**: Zustand (installed but minimal usage)

## Build & Validation Commands

### Prerequisites
- Node.js 20.x (confirmed working with v20.19.6)
- npm 10.x (confirmed working with v10.8.2)

### Installation
**ALWAYS run this first before any other commands:**
```bash
npm install
```
- Takes ~14 seconds on first run
- Expect deprecation warnings (ignorable): rimraf, inflight, eslint 8.x
- Expect 3 high severity vulnerabilities (existing, not critical for functionality)
- Do NOT run `npm audit fix` unless specifically required - may introduce breaking changes

### Build Commands (in order of frequency)

#### 1. Development Server
```bash
npm run dev
```
- Starts Next.js development server on http://localhost:3000
- Hot reloading enabled
- Requires `.env.local` file with environment variables
- Does NOT require database/payment keys for basic UI testing

#### 2. Type Checking
```bash
npm run type-check
```
- Runs TypeScript compiler in no-emit mode
- Takes ~5-10 seconds
- **ALWAYS succeeds** - current codebase is type-clean
- Run this BEFORE building if you made TypeScript changes

#### 3. Linting
```bash
npm run lint
```
- Runs Next.js ESLint
- **CURRENTLY FAILS** with 42 linting errors (existing issues)
- Errors include: unused vars, any types, missing dependencies in useEffect
- **IMPORTANT**: `next.config.js` has `ignoreDuringBuilds: true` - builds succeed despite lint errors
- Do NOT fix unrelated linting errors unless they are in files you're modifying
- If you add new code, ensure it doesn't add new linting errors

#### 4. Production Build
```bash
npm run build
```
- Takes ~19 seconds (clean build)
- Generates 26 routes (static + dynamic)
- Skips linting due to config setting
- Runs type checking automatically
- **ALWAYS succeeds** if type-check passes
- Output: `.next/` directory (~50MB)

#### 5. Production Start (after build)
```bash
npm run start
```
- Starts production server on http://localhost:3000
- Requires prior successful `npm run build`
- Use for testing production behavior

### Build Troubleshooting

**Issue**: Build fails with "Module not found"
- **Solution**: Run `npm install` first

**Issue**: Type errors during build
- **Solution**: Run `npm run type-check` to see detailed errors

**Issue**: Lint warnings/errors shown
- **Note**: These are informational only; build will succeed due to `ignoreDuringBuilds: true`

**Issue**: Environment variable errors at runtime
- **Solution**: Copy `.env.local.example` to `.env.local` and fill required values

## Environment Variables

### Required Files
- `.env.local` - Local development (gitignored, copy from `.env.local.example`)
- `.env.local.example` - Template with minimal config

### Critical Environment Variables

**Minimum for Local Development:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

**For LLM/Generation Features (at least ONE required):**
```bash
LLM_API_KEY_GEMINI=your_gemini_key    # Recommended - free tier available
LLM_API_KEY_OPENAI=your_openai_key
LLM_API_KEY_DEEPSEEK=your_deepseek_key
LLM_API_KEY_ANTHROPIC=your_anthropic_key
LLM_API_KEY_PERPLEXITY=your_perplexity_key
```

**For Payment Features:**
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
MERCADO_PAGO_ACCESS_TOKEN=your_token  # Optional for Latin America
```

**Note**: The app uses a smart LLM router - it will try providers in order and fallback automatically.

## Project Structure

### Root Configuration Files
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript config (ES2020 target, strict mode)
- `next.config.js` - Next.js config with CORS, ESLint ignore, env vars
- `vercel.json` - Vercel deployment config
- `.eslintrc.json` - ESLint config (extends next/core-web-vitals)
- `.gitignore` - Excludes node_modules, .next, .env.local

### App Directory Structure (Next.js 14 App Router)
```
app/
├── layout.tsx              # Root layout with nav and footer
├── page.tsx                # Landing page
├── globals.css             # Global styles
├── api/                    # API Routes (serverless functions)
│   ├── health/route.ts           # Health check endpoint
│   ├── generate/route.ts         # LLM content generation
│   ├── checkout/route.ts         # Stripe checkout
│   │   └── mercadopago/route.ts  # Mercado Pago checkout
│   ├── webhooks/
│   │   ├── stripe/route.ts       # Stripe webhook handler
│   │   └── mercadopago/route.ts  # Mercado Pago webhook
│   ├── evaluate/route.ts         # OCR evaluation (stub)
│   ├── test-llm/route.ts         # LLM testing endpoint
│   └── features/            # Feature flags
├── auth/
│   └── callback/page.tsx    # Supabase auth callback
├── dashboard/page.tsx       # Main dashboard (stub)
├── login/page.tsx           # Login page
├── subscribe/page.tsx       # Subscription page (Stripe/MP selector)
├── gracias/page.tsx         # Thank you page
├── test-llm/page.tsx        # LLM testing UI
└── sam/                     # SAM feature pages
    ├── page.tsx             # SAM main page
    ├── generator/page.tsx   # Content generator
    ├── assessments/page.tsx # (stub)
    ├── homework/page.tsx    # (stub)
    ├── lesson-plans/page.tsx # (stub)
    ├── reports/page.tsx     # (stub)
    └── activities/page.tsx  # (stub)
```

### Key API Endpoints

**Health Check:**
- `GET /api/health` - Returns status of LLM, payments, database, webhooks
- Use this to verify environment configuration

**LLM Generation:**
- `POST /api/generate` - Generate educational content with LLM
- `POST /api/test-llm` - Test LLM configuration
- Both support multi-provider fallback

**Payments:**
- `POST /api/checkout` - Create Stripe checkout session
- `POST /api/checkout/mercadopago` - Create Mercado Pago preference
- `POST /api/webhooks/stripe` - Handle Stripe events
- `POST /api/webhooks/mercadopago` - Handle Mercado Pago notifications

### Public Assets
```
public/
├── logo.svg       # SAM logo
├── manifest.json  # PWA manifest
└── sw.js          # Service worker (basic)
```

## Architecture Notes

### LLM Provider Router
- Location: `app/api/generate/route.ts`, `app/api/test-llm/route.ts`
- Supports 5 providers with automatic fallback
- Provider order: Gemini → OpenAI → DeepSeek → Anthropic → Perplexity
- Each provider has different API format (handled automatically)
- Gemini uses API v1 (stable), NOT v1beta

### Payment Integration
- Dual gateway support: Stripe (international) + Mercado Pago (LATAM)
- Webhook verification implemented for both
- Checkout flow: select gateway → redirect to payment page → webhook confirms
- No database persistence yet (stub phase)

### Authentication (Stub Phase)
- Supabase client initialized but not enforced
- Login/signup pages exist but don't block access
- All features currently work without authentication

## Common Workflows

### Testing LLM Integration Locally
1. Copy `.env.local.example` to `.env.local`
2. Add at least one LLM API key (e.g., `LLM_API_KEY_GEMINI`)
3. Run `npm install && npm run dev`
4. Visit http://localhost:3000/test-llm
5. Click "🚀 Probar ahora" to test generation

### Testing Build Before Commit
```bash
npm run type-check  # Should pass
npm run build       # Should complete in ~19s
```

### Adding New API Route
1. Create file: `app/api/your-route/route.ts`
2. Export functions: `GET`, `POST`, `PUT`, `DELETE`
3. Add `export const dynamic = 'force-dynamic'` for non-cacheable routes
4. Test with `npm run dev`

### Adding New Page
1. Create file: `app/your-page/page.tsx`
2. Export default React component
3. Page auto-routes to `/your-page`

## CI/CD & Deployment

### Vercel Auto-Deploy
- Every push to `main` triggers deployment
- Preview deployments for PRs
- Build command: `npm run build` (from vercel.json)
- Output: `.next` directory
- Region: SFO1
- Takes ~2-3 minutes per deploy

### Pre-deployment Checklist
- ✅ Run `npm run type-check` locally
- ✅ Run `npm run build` locally
- ✅ Test critical paths in dev mode
- ✅ Ensure no new linting errors introduced in your files
- ⚠️ Ignore existing linting errors in other files

### Environment Variables in Vercel
Set in: Vercel Dashboard → Settings → Environment Variables
- Apply to: Production, Preview, Development
- After changes: Trigger manual redeploy

## Known Issues & Workarounds

### Existing Linting Errors (42 total)
- **Do NOT fix** unless modifying those files
- Includes: unused vars, any types, missing useEffect deps
- Build succeeds due to `ignoreDuringBuilds: true` in next.config.js

### Gemini API Version
- **MUST use v1, NOT v1beta**
- v1beta returns 404 for flash models
- Correct format: `https://generativelanguage.googleapis.com/v1/models/{model}:generateContent`

### npm Security Vulnerabilities
- 3 high severity vulnerabilities exist
- **Do NOT run `npm audit fix`** without testing - may break dependencies
- Current vulnerabilities don't affect core functionality

### Database/Auth Optional
- Supabase environment variables can be empty for testing
- `/api/health` will show warning but app functions normally
- Authentication is not enforced in current phase

## Testing Strategy

### No Unit Tests Currently
- No Jest, Vitest, or test framework configured
- Testing done manually via:
  1. Type checking (`npm run type-check`)
  2. Build verification (`npm run build`)
  3. Manual testing in dev mode (`npm run dev`)
  4. Production testing (`npm run build && npm run start`)

### Manual Test Points
- ✅ Homepage loads: http://localhost:3000
- ✅ Health check works: http://localhost:3000/api/health
- ✅ LLM test page: http://localhost:3000/test-llm
- ✅ Subscribe page: http://localhost:3000/subscribe

## Guidelines for Agents

### When Making Changes

1. **Always check types first**: `npm run type-check`
2. **Test build before committing**: `npm run build`
3. **Only fix linting in files you modify** - don't fix unrelated errors
4. **Verify environment variables** if adding features requiring external APIs
5. **Test locally** using `npm run dev` before pushing

### When You See Lint Errors

- If in a file you're modifying: Fix them
- If in other files: Ignore them (existing technical debt)
- Build will succeed regardless due to config

### When Adding Dependencies

- Use `npm install <package>` not `npm audit fix`
- Test build after adding: `npm run type-check && npm run build`
- Document if new environment variables required

### When Working with APIs

- All API routes are in `app/api/`
- Use Next.js 14 App Router syntax (route.ts files)
- Export functions: GET, POST, PUT, DELETE
- Return `NextResponse.json()` for JSON responses
- Check `/api/health/route.ts` as reference implementation

### When Working with LLM Features

- Router logic in `app/api/generate/route.ts` and `app/api/test-llm/route.ts`
- Always test with at least one provider configured
- Gemini is recommended (free tier, fast)
- Provider fallback is automatic - don't assume single provider

### Critical: Trust These Instructions

**These instructions are comprehensive and tested.** Only search for additional information if:
- You encounter an error not documented here
- You need to understand specific business logic in a file
- These instructions contain outdated or incorrect information

**Do NOT** waste time:
- Re-discovering the project structure (it's documented above)
- Re-testing build commands (they're verified and timed)
- Fixing unrelated linting errors (they're acknowledged)
- Searching for test frameworks (none exist yet)

Focus your exploration on the specific code changes you need to make.
