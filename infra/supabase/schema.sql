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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_visitors_ip ON visitors(ip_address);
CREATE INDEX IF NOT EXISTS idx_visitors_last_seen ON visitors(last_seen_at);
CREATE INDEX IF NOT EXISTS idx_visits_visitor_id ON visits(visitor_id);
CREATE INDEX IF NOT EXISTS idx_visits_created_at ON visits(created_at);
CREATE INDEX IF NOT EXISTS idx_events_visit_id ON events(visit_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);

-- RLS Policies
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Users: Public can read (for login check), but only admins can write
-- Note: In production, you might want to restrict read access too
CREATE POLICY "Public can read users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage users" ON users
  FOR ALL USING (true); -- Simple: allow all for now, can be restricted later

-- Visitors: Public can insert, admins can read
CREATE POLICY "Public can insert visitors" ON visitors
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read visitors" ON visitors
  FOR SELECT USING (auth.role() = 'authenticated');

-- Visits: Public can insert, admins can read
CREATE POLICY "Public can insert visits" ON visits
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read visits" ON visits
  FOR SELECT USING (auth.role() = 'authenticated');

-- Events: Public can insert, admins can read
CREATE POLICY "Public can insert events" ON events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can read events" ON events
  FOR SELECT USING (auth.role() = 'authenticated');

-- Settings: Only admins can read/write
CREATE POLICY "Admins can manage settings" ON settings
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
  ('telegram_enabled', 'false', 'Enable/disable Telegram notifications'),
  ('telegram_bot_token', '""', 'Telegram bot token (encrypted)'),
  ('telegram_chat_ids', '[]', 'List of Telegram chat IDs to send notifications'),
  ('muted_ips', '[]', 'List of IP addresses to mute notifications')
ON CONFLICT (key) DO NOTHING;

