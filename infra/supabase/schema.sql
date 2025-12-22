-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (simple admin system)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- Plain text password (simple system)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Visitors table
CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_address TEXT NOT NULL,
  country TEXT,
  city TEXT,
  region TEXT,
  first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  visit_count INTEGER DEFAULT 1,
  is_muted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(ip_address)
);

-- Visits table
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id UUID REFERENCES visitors(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  country TEXT,
  city TEXT,
  region TEXT,
  user_agent TEXT,
  referer TEXT,
  page_path TEXT,
  is_new_visit BOOLEAN DEFAULT TRUE,
  visit_duration INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Events table (page views, button clicks, etc.)
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE,
  visitor_id UUID REFERENCES visitors(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'pageview', 'click', 'form_submit', etc.
  event_name TEXT,
  page_path TEXT,
  element_id TEXT,
  element_class TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_visitors_ip ON visitors(ip_address);
CREATE INDEX IF NOT EXISTS idx_visitors_last_seen ON visitors(last_seen_at);
CREATE INDEX IF NOT EXISTS idx_visits_visitor_id ON visits(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visits_created_at ON visits(created_at);
CREATE INDEX IF NOT EXISTS idx_events_visit_id ON events(visit_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);

-- RLS Policies (Simplified - no auth.role() checks)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public can read users" ON users;
DROP POLICY IF EXISTS "Public can insert visitors" ON visitors;
DROP POLICY IF EXISTS "Public can read visitors" ON visitors;
DROP POLICY IF EXISTS "Admins can read visitors" ON visitors;
DROP POLICY IF EXISTS "Public can insert visits" ON visits;
DROP POLICY IF EXISTS "Public can read visits" ON visits;
DROP POLICY IF EXISTS "Admins can read visits" ON visits;
DROP POLICY IF EXISTS "Public can insert events" ON events;
DROP POLICY IF EXISTS "Public can read events" ON events;
DROP POLICY IF EXISTS "Admins can read events" ON events;
DROP POLICY IF EXISTS "Public can read settings" ON settings;
DROP POLICY IF EXISTS "Admins can manage settings" ON settings;
DROP POLICY IF EXISTS "Admins can manage admins" ON admins;
DROP POLICY IF EXISTS "Admins can manage users" ON users;
DROP POLICY IF EXISTS "Public can insert contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Public can read contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Admins can read contact_submissions" ON contact_submissions;

-- Users: Public can read (for login check)
-- Note: In production, you might want to restrict this
CREATE POLICY "Public can read users" ON users
  FOR SELECT USING (true);

-- Visitors: Public can insert and read
CREATE POLICY "Public can insert visitors" ON visitors
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read visitors" ON visitors
  FOR SELECT USING (true);

-- Visits: Public can insert and read
CREATE POLICY "Public can insert visits" ON visits
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read visits" ON visits
  FOR SELECT USING (true);

-- Events: Public can insert and read
CREATE POLICY "Public can insert events" ON events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read events" ON events
  FOR SELECT USING (true);

-- Settings: Public can read (for admin panel)
CREATE POLICY "Public can read settings" ON settings
  FOR SELECT USING (true);

-- Contact submissions: Public can insert, no read (privacy)
CREATE POLICY "Public can insert contact_submissions" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Contact submissions: Admins can read (for admin panel)
-- Note: In production, add proper admin check
CREATE POLICY "Admins can read contact_submissions" ON contact_submissions
  FOR SELECT USING (true);

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
  ('telegram_enabled', 'true'::jsonb, 'Enable/disable Telegram notifications'),
  ('telegram_bot_token', '"8490339218:AAGkE0Oh06enmuXFmoxHGhLZj6d5E8xiGck"'::jsonb, 'Telegram bot token'),
  ('telegram_chat_ids', '["785750734"]'::jsonb, 'List of Telegram chat IDs to send notifications'),
  ('muted_ips', '[]'::jsonb, 'List of IP addresses to mute notifications')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = TIMEZONE('utc', NOW());

-- Insert default admin users
INSERT INTO users (username, password) VALUES
  ('Furkan', '123'),
  ('Erdem', '123')
ON CONFLICT (username) DO NOTHING;
