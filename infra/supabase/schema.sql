-- ============================================================
-- FlowCobalt - Full Database Schema
-- Run this in Supabase SQL Editor (safe to re-run)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CORE TABLES
-- ============================================================

-- Admin users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Visitors (core identity unit - one row per unique person/device)
CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Identity signals (primary: device_id, secondary: fingerprint)
  device_id TEXT,                      -- localStorage persistent UUID
  fingerprint_hash TEXT,               -- Hash of stable browser signals

  -- Display
  visitor_number INTEGER,              -- V-0001, V-0002... (NULL ok for legacy)
  display_name TEXT,                   -- "Furkan", "Erdem" for trusted
  is_trusted BOOLEAN DEFAULT FALSE,
  is_muted BOOLEAN DEFAULT FALSE,

  -- Match info
  match_confidence TEXT DEFAULT 'ip',  -- 'device' | 'fingerprint' | 'network' | 'ip'

  -- Last known signals (quick access, no extra join needed)
  ip_address TEXT,                     -- Legacy / first known IP
  last_webrtc_subnet TEXT,             -- 192.168.x for WiFi matching
  last_connection_type TEXT,           -- wifi | cellular | ethernet
  last_screen_resolution TEXT,
  last_user_agent TEXT,
  last_page_path TEXT,

  -- Last known location
  last_country TEXT,
  last_city TEXT,
  last_region TEXT,

  -- Stats
  visit_count INTEGER DEFAULT 1,
  first_seen_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- IP address history per visitor
CREATE TABLE IF NOT EXISTS visitor_ips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id UUID REFERENCES visitors(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  country TEXT,
  city TEXT,
  region TEXT,
  first_seen_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(visitor_id, ip_address)
);

-- Fingerprint snapshots (history of device signals)
CREATE TABLE IF NOT EXISTS visitor_fingerprints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id UUID REFERENCES visitors(id) ON DELETE CASCADE,
  device_id TEXT,
  fingerprint_hash TEXT,
  canvas_hash TEXT,
  user_agent TEXT,
  screen_resolution TEXT,
  color_depth TEXT,
  timezone TEXT,
  language TEXT,
  cpu_cores INTEGER,
  device_memory NUMERIC,
  webrtc_local_ip TEXT,
  webrtc_subnet TEXT,
  connection_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions (one per browser session)
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id UUID REFERENCES visitors(id) ON DELETE CASCADE,
  ip_address TEXT,
  country TEXT,
  city TEXT,
  region TEXT,
  user_agent TEXT,
  referer TEXT,
  page_path TEXT,           -- Entry page
  is_new_visit BOOLEAN DEFAULT TRUE,
  visit_duration INTEGER,   -- seconds
  scroll_depth INTEGER,     -- 0-100
  scroll_events JSONB,      -- [25, 50, 75, 100]
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events (page views, clicks, scrolls within sessions)
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE,
  visitor_id UUID REFERENCES visitors(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,  -- 'pageview' | 'click' | 'scroll' | 'form_submit'
  event_name TEXT,
  page_path TEXT,
  element_id TEXT,
  element_class TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- App settings
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin access / security logs
CREATE TABLE IF NOT EXISTS admin_access_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id UUID REFERENCES visitors(id) ON DELETE SET NULL,
  ip_address TEXT NOT NULL,
  access_type TEXT NOT NULL,  -- 'login_page' | 'admin_panel' | 'failed_login'
  page_path TEXT,
  attempted_username TEXT,
  user_agent TEXT,
  country TEXT,
  city TEXT,
  region TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MIGRATION: safe additions to existing installations
-- ============================================================

-- Drop old unique constraint on ip_address (visitors can have multiple IPs now)
ALTER TABLE visitors DROP CONSTRAINT IF EXISTS visitors_ip_address_key;

-- Add new columns (safe if already exist)
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS device_id TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS fingerprint_hash TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS visitor_number INTEGER;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS is_trusted BOOLEAN DEFAULT FALSE;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS match_confidence TEXT DEFAULT 'ip';
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS last_webrtc_subnet TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS last_connection_type TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS last_screen_resolution TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS last_user_agent TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS last_page_path TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS last_country TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS last_city TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS last_region TEXT;

-- visits table additions
ALTER TABLE visits ADD COLUMN IF NOT EXISTS scroll_depth INTEGER;
ALTER TABLE visits ADD COLUMN IF NOT EXISTS scroll_events JSONB;

-- ============================================================
-- VISITOR NUMBERING
-- ============================================================

CREATE SEQUENCE IF NOT EXISTS visitor_number_seq START 1;

-- Backfill visitor_number for existing visitors that don't have one
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM visitors WHERE visitor_number IS NULL LIMIT 1) THEN
    WITH numbered AS (
      SELECT id, ROW_NUMBER() OVER (ORDER BY first_seen_at, created_at) AS rn
      FROM visitors
      WHERE visitor_number IS NULL
    )
    UPDATE visitors v
    SET visitor_number = n.rn
    FROM numbered n
    WHERE v.id = n.id;

    -- Advance sequence past the max
    PERFORM setval(
      'visitor_number_seq',
      COALESCE((SELECT MAX(visitor_number) FROM visitors), 0) + 1
    );
  END IF;
END $$;

-- Function to get next visitor number (called from edge function)
CREATE OR REPLACE FUNCTION next_visitor_number()
RETURNS INTEGER AS $$
  SELECT nextval('visitor_number_seq')::INTEGER;
$$ LANGUAGE SQL;

-- ============================================================
-- INDEXES
-- ============================================================

-- Visitors
CREATE UNIQUE INDEX IF NOT EXISTS idx_visitors_device_id
  ON visitors(device_id) WHERE device_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_visitors_fingerprint_hash
  ON visitors(fingerprint_hash) WHERE fingerprint_hash IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_visitors_last_seen ON visitors(last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitors_trusted ON visitors(is_trusted);
CREATE INDEX IF NOT EXISTS idx_visitors_number ON visitors(visitor_number);
CREATE INDEX IF NOT EXISTS idx_visitors_webrtc_subnet ON visitors(last_webrtc_subnet);

-- Visitor IPs
CREATE INDEX IF NOT EXISTS idx_visitor_ips_visitor ON visitor_ips(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitor_ips_ip ON visitor_ips(ip_address);

-- Visitor fingerprints
CREATE INDEX IF NOT EXISTS idx_visitor_fingerprints_visitor ON visitor_fingerprints(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitor_fingerprints_device ON visitor_fingerprints(device_id);

-- Visits / Sessions
CREATE INDEX IF NOT EXISTS idx_visits_visitor ON visits(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visits_created ON visits(created_at DESC);

-- Events
CREATE INDEX IF NOT EXISTS idx_events_visit ON events(visit_id);
CREATE INDEX IF NOT EXISTS idx_events_visitor ON events(visitor_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at DESC);

-- Admin logs
CREATE INDEX IF NOT EXISTS idx_admin_logs_visitor ON admin_access_logs(visitor_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_ip ON admin_access_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_admin_logs_type ON admin_access_logs(access_type);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created ON admin_access_logs(created_at DESC);

-- ============================================================
-- NETWORK IDENTITY LINKS
-- Stores admin decisions about whether two network-matched
-- visitors are the same person or confirmed different people.
-- visitor_id_a is always the lexicographically smaller UUID.
-- ============================================================

CREATE TABLE IF NOT EXISTS visitor_network_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id_a UUID NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  visitor_id_b UUID NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  link_type TEXT NOT NULL CHECK (link_type IN ('same_person', 'different_person')),
  subnet TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(visitor_id_a, visitor_id_b)
);

CREATE INDEX IF NOT EXISTS idx_vnl_a ON visitor_network_links(visitor_id_a);
CREATE INDEX IF NOT EXISTS idx_vnl_b ON visitor_network_links(visitor_id_b);
CREATE INDEX IF NOT EXISTS idx_vnl_subnet ON visitor_network_links(subnet);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_ips ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_fingerprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_access_logs ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Public can read users" ON users;
DROP POLICY IF EXISTS "Public can insert visitors" ON visitors;
DROP POLICY IF EXISTS "Public can read visitors" ON visitors;
DROP POLICY IF EXISTS "Public can update visitors" ON visitors;
DROP POLICY IF EXISTS "Public can insert visits" ON visits;
DROP POLICY IF EXISTS "Public can read visits" ON visits;
DROP POLICY IF EXISTS "Public can insert events" ON events;
DROP POLICY IF EXISTS "Public can read events" ON events;
DROP POLICY IF EXISTS "Public can read settings" ON settings;
DROP POLICY IF EXISTS "Public can insert contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can read contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Public can insert admin_access_logs" ON admin_access_logs;
DROP POLICY IF EXISTS "Admins can read admin_access_logs" ON admin_access_logs;
DROP POLICY IF EXISTS "Public can insert visitor_ips" ON visitor_ips;
DROP POLICY IF EXISTS "Public can read visitor_ips" ON visitor_ips;
DROP POLICY IF EXISTS "Public can update visitor_ips" ON visitor_ips;
DROP POLICY IF EXISTS "Public can insert visitor_fingerprints" ON visitor_fingerprints;
DROP POLICY IF EXISTS "Public can read visitor_fingerprints" ON visitor_fingerprints;

-- Users
CREATE POLICY "Public can read users" ON users FOR SELECT USING (true);

-- Visitors (edge functions use service role key, admin panel uses anon key)
CREATE POLICY "Public can insert visitors" ON visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read visitors" ON visitors FOR SELECT USING (true);
CREATE POLICY "Public can update visitors" ON visitors FOR UPDATE USING (true);

-- Visitor IPs
CREATE POLICY "Public can insert visitor_ips" ON visitor_ips FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read visitor_ips" ON visitor_ips FOR SELECT USING (true);
CREATE POLICY "Public can update visitor_ips" ON visitor_ips FOR UPDATE USING (true);

-- Visitor fingerprints
CREATE POLICY "Public can insert visitor_fingerprints" ON visitor_fingerprints FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read visitor_fingerprints" ON visitor_fingerprints FOR SELECT USING (true);

-- Visits
CREATE POLICY "Public can insert visits" ON visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read visits" ON visits FOR SELECT USING (true);
CREATE POLICY "Public can update visits" ON visits FOR UPDATE USING (true);

-- Events
CREATE POLICY "Public can insert events" ON events FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read events" ON events FOR SELECT USING (true);

-- Settings
CREATE POLICY "Public can read settings" ON settings FOR SELECT USING (true);

-- Contact submissions
CREATE POLICY "Public can insert contact_submissions" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read contact_submissions" ON contact_submissions FOR SELECT USING (true);

-- Admin logs
CREATE POLICY "Public can insert admin_access_logs" ON admin_access_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read admin_access_logs" ON admin_access_logs FOR SELECT USING (true);

-- Network links
ALTER TABLE visitor_network_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert visitor_network_links" ON visitor_network_links FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read visitor_network_links" ON visitor_network_links FOR SELECT USING (true);
CREATE POLICY "Public can update visitor_network_links" ON visitor_network_links FOR UPDATE USING (true);
CREATE POLICY "Public can delete visitor_network_links" ON visitor_network_links FOR DELETE USING (true);

-- ============================================================
-- DEFAULT DATA
-- ============================================================

INSERT INTO settings (key, value, description) VALUES
  ('telegram_enabled', 'true'::jsonb, 'Enable/disable Telegram notifications'),
  ('telegram_bot_token', '"8490339218:AAGkE0Oh06enmuXFmoxHGhLZj6d5E8xiGck"'::jsonb, 'Telegram bot token'),
  ('telegram_chat_ids', '["785750734"]'::jsonb, 'List of Telegram chat IDs to send notifications'),
  ('muted_ips', '[]'::jsonb, 'List of IP addresses to mute notifications')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

INSERT INTO users (username, password) VALUES
  ('Furkan', '123'),
  ('Erdem', '123')
ON CONFLICT (username) DO NOTHING;

-- Backfill last_country, last_city, last_region from existing data
UPDATE visitors v
SET
  last_country = COALESCE(v.last_country, v.country),
  last_city    = COALESCE(v.last_city, v.city),
  last_region  = COALESCE(v.last_region, v.region)
WHERE v.last_country IS NULL
  AND (v.country IS NOT NULL OR v.city IS NOT NULL);

-- Backfill visitor_ips from existing visitors
INSERT INTO visitor_ips (visitor_id, ip_address, country, city, region, first_seen_at, last_seen_at)
SELECT
  id, ip_address,
  COALESCE(last_country, country),
  COALESCE(last_city, city),
  COALESCE(last_region, region),
  first_seen_at,
  last_seen_at
FROM visitors
WHERE ip_address IS NOT NULL AND ip_address NOT IN ('unknown', '')
ON CONFLICT (visitor_id, ip_address) DO NOTHING;
