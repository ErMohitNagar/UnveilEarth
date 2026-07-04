-- ============================================================
-- UnveilEarth — Initial Database Schema
-- ============================================================

-- Auto-update updated_at timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─── Users ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT UNIQUE NOT NULL,
  display_name  TEXT,
  avatar_url    TEXT,
  preferences   JSONB DEFAULT '{}',
  role          TEXT DEFAULT 'traveler' CHECK (role IN ('traveler', 'guide', 'admin')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Destinations ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS destinations (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                  TEXT UNIQUE NOT NULL,
  name                  TEXT NOT NULL,
  description           TEXT,
  region                TEXT,
  country               TEXT,
  category              TEXT,
  latitude              DOUBLE PRECISION,
  longitude             DOUBLE PRECISION,
  image_url             TEXT,
  alt_text              TEXT,
  highlights            JSONB,
  ai_story              TEXT,
  ai_story_generated_at TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_destinations_slug ON destinations(slug);
CREATE INDEX idx_destinations_region ON destinations(region);
CREATE INDEX idx_destinations_country ON destinations(country);
CREATE INDEX idx_destinations_category ON destinations(category);

CREATE TRIGGER destinations_updated_at
  BEFORE UPDATE ON destinations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Guides ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS guides (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bio           TEXT,
  specialties   TEXT[],
  languages     TEXT[],
  location      TEXT,
  verified      BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_guides_user_id ON guides(user_id);

CREATE TRIGGER guides_updated_at
  BEFORE UPDATE ON guides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Events ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id  UUID REFERENCES destinations(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  start_date      TIMESTAMPTZ,
  end_date        TIMESTAMPTZ,
  location        TEXT,
  image_url       TEXT,
  alt_text        TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_destination_id ON events(destination_id);
CREATE INDEX idx_events_start_date ON events(start_date);

-- ─── Experiences ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS experiences (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id    UUID REFERENCES destinations(id) ON DELETE SET NULL,
  guide_id          UUID REFERENCES guides(id) ON DELETE SET NULL,
  title             TEXT NOT NULL,
  description       TEXT,
  duration_hours    NUMERIC(4,1),
  price_cents       INTEGER,
  currency          TEXT DEFAULT 'USD',
  max_participants  INTEGER,
  image_url         TEXT,
  alt_text          TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_experiences_destination_id ON experiences(destination_id);
CREATE INDEX idx_experiences_guide_id ON experiences(guide_id);

CREATE TRIGGER experiences_updated_at
  BEFORE UPDATE ON experiences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Bookings ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES users(id) ON DELETE CASCADE,
  experience_id     UUID REFERENCES experiences(id) ON DELETE CASCADE,
  status            TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  booking_date      TIMESTAMPTZ NOT NULL,
  participants      INTEGER NOT NULL,
  total_price_cents INTEGER,
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_experience_id ON bookings(experience_id);
CREATE INDEX idx_bookings_status ON bookings(status);

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Row Level Security ──────────────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Public read access to destinations, events, and experiences
CREATE POLICY "Public read destinations"   ON destinations FOR SELECT USING (true);
CREATE POLICY "Public read events"         ON events       FOR SELECT USING (true);
CREATE POLICY "Public read experiences"    ON experiences  FOR SELECT USING (true);
CREATE POLICY "Public read guides"         ON guides       FOR SELECT USING (true);

-- Users can read and update their own profile
CREATE POLICY "Users read own profile"     ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile"   ON users FOR UPDATE USING (auth.uid() = id);

-- Users can read and create their own bookings
CREATE POLICY "Users read own bookings"    ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create own bookings"  ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Guides can manage their own profile
CREATE POLICY "Guides manage own profile"  ON guides FOR ALL USING (auth.uid() = user_id);

-- Service role has full access (handled by the backend via service role key)
