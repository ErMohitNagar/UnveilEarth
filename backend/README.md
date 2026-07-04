# UnveilEarth Backend

> GenAI-powered destination discovery and cultural experiences platform — backend API

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js + TypeScript** | Runtime & language (strict mode, ESM) |
| **Express.js** | Web framework (minimal cold-start on Render free tier) |
| **Supabase** | Postgres + Auth + Storage |
| **pgvector** | Vector similarity search for RAG |
| **Google Gemini** | Primary GenAI provider (content + embeddings) |
| **Groq** | Fast chat completions (Llama 3.3 70B) |
| **Zod** | Runtime validation + type inference |
| **Pino** | Structured logging |

## Architecture

The backend follows a **component-based layered architecture** (feature-first + layered separation):

```
Route → Controller → Service → Repository
  │         │           │          │
  │         │           │          └── Only layer that touches the database
  │         │           └──────────── All business logic, AI orchestration, caching
  │         └──────────────────────── Request/response shaping only
  └────────────────────────────────── HTTP wiring only (verb + path → controller)
```

### Layer Responsibilities

| Layer | Allowed To | NOT Allowed To |
|-------|-----------|----------------|
| **Route** | Wire HTTP method + path to controller, apply middleware | Contain any logic |
| **Controller** | Parse input, call service, format response via `ApiResponse` | Query DB, call AI, contain business logic |
| **Service** | Orchestrate business logic, call repositories + GenAI + cache | Run raw SQL, handle HTTP req/res |
| **Repository** | Execute Supabase/Postgres queries | Contain business logic |

### GenAI Architecture

```
genai.client.ts  ← Single entry point for all AI calls
    ├── gemini.provider.ts  (Gemini 2.0 Flash + gemini-embedding-001)
    └── groq.provider.ts    (Llama 3.3 70B Versatile)

Fallback: Gemini primary → Groq fallback (content generation)
          Groq primary → Gemini fallback (chat streaming)
          Gemini only (embeddings)
```

## File Structure

```
src/
├── modules/           # Feature-first domain modules
│   ├── auth/          # User sync on first login
│   ├── destinations/  # Destination CRUD + AI storytelling
│   ├── discovery/     # AI recommendations + RAG hidden gems
│   ├── events/        # Local event listings
│   ├── experiences/   # Guide experiences + booking
│   ├── chat/          # Streamed AI chat (SSE)
│   └── guides/        # Guide/artisan onboarding
├── services/          # Cross-cutting infrastructure
│   ├── genai/         # AI providers, client, prompt templates
│   ├── vectorSearch/  # pgvector cosine similarity queries
│   ├── cache/         # In-memory caching (node-cache)
│   └── moderation/    # Input sanitization & content safety
├── middleware/        # JWT auth, RBAC, rate limiting, validation, error handling
├── db/                # Supabase client, pg pool, SQL migrations
├── config/            # Environment validation, app constants
├── utils/             # Logger, async handler, API response helpers
├── app.ts             # Express app setup & route mounting
└── server.ts          # HTTP server entrypoint
```

## Getting Started

### Prerequisites

- Node.js ≥ 20
- A Supabase project (with pgvector extension enabled)
- Gemini API key ([ai.google.dev](https://ai.google.dev))
- Groq API key ([console.groq.com](https://console.groq.com))

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your Supabase, Gemini, and Groq credentials

# 3. Run database migrations
# Execute the SQL files in src/db/migrations/ against your Supabase database
# (via Supabase Dashboard → SQL Editor, or supabase CLI)

# 4. Start development server
npm run dev
```

### Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server with hot reload (tsx watch) |
| `npm run build` | Compile TypeScript to dist/ |
| `npm start` | Run production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run test` | Run unit tests (Vitest) |
| `npm run typecheck` | TypeScript type checking |

## API Routes

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| `GET` | `/api/health` | — | Health check |
| `POST` | `/api/auth/sync` | JWT | Sync user profile on first login |
| `GET` | `/api/destinations` | — | List/search destinations |
| `GET` | `/api/destinations/:slug` | — | Destination detail + AI story |
| `POST` | `/api/discover/recommendations` | JWT | AI-personalized recommendations |
| `POST` | `/api/discover/hidden-gems` | JWT | RAG-powered hidden gem search |
| `GET` | `/api/events` | — | List events (filterable) |
| `GET` | `/api/experiences` | — | List experiences |
| `GET` | `/api/experiences/:id` | — | Experience detail |
| `POST` | `/api/experiences/:id/book` | JWT | Create a booking |
| `POST` | `/api/chat` | JWT | Streamed chat (SSE) |
| `POST` | `/api/guides/onboard` | JWT + Role | Guide/artisan signup |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | — | `development` / `production` / `test` |
| `PORT` | — | Server port (default: 3001) |
| `CORS_ORIGIN` | — | Allowed CORS origin |
| `SUPABASE_URL` | ✅ | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key |
| `SUPABASE_JWT_SECRET` | ✅ | Supabase JWT secret |
| `DATABASE_URL` | ✅ | Direct Postgres connection string |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key |
| `GROQ_API_KEY` | ✅ | Groq API key |
| `LOG_LEVEL` | — | Pino log level (default: info) |

## Contributing

1. Every new feature goes into `src/modules/<feature>/` with its own routes, controller, service, and schema files.
2. **Never** put business logic in route or controller files.
3. **Never** run DB queries outside of repository files.
4. **Never** import a GenAI provider directly — always use `genai.client.ts`.
5. All AI prompt templates live in `src/services/genai/prompts/` — iterate on prompts without touching business logic.
6. Validate all inputs at the route boundary with Zod schemas.
7. Use `z.infer<typeof Schema>` for TypeScript types — never duplicate interfaces manually.

## License

Private — UnveilEarth
