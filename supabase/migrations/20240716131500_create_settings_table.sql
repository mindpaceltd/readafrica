
CREATE TABLE app_settings (
    id smallint PRIMARY KEY DEFAULT 1,
    site_title TEXT,
    site_description TEXT,
    footer_text TEXT,
    logo_url TEXT,
    maintenance_mode BOOLEAN DEFAULT FALSE,
    allow_registrations BOOLEAN DEFAULT TRUE,
    primary_color TEXT,
    accent_color TEXT,
    background_color TEXT,
    mpesa_consumer_key TEXT,
    mpesa_consumer_secret TEXT,
    mpesa_passkey TEXT,
    CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default settings
INSERT INTO app_settings (
    id, 
    site_title, 
    site_description, 
    footer_text, 
    primary_color, 
    accent_color, 
    background_color
) VALUES (
    1,
    'Prophetic Reads',
    'E-books and daily devotionals by Dr. Climate Wiseman.',
    '© 2024 Dr. Climate Wiseman. All rights reserved.',
    '#4A148C',
    '#5E35B1',
    '#E1BEE7'
);

-- Set row level security
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON app_settings FOR SELECT USING (true);

-- Allow admin write access
CREATE POLICY "Allow admin write access" ON app_settings FOR UPDATE USING (
    (SELECT is_admin FROM profiles WHERE user_id = auth.uid()) = TRUE
);

-- Create a storage bucket for logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Policies for logos bucket
CREATE POLICY "Allow public read access on logos" ON storage.objects FOR SELECT TO public USING (bucket_id = 'logos');
CREATE POLICY "Allow admin write access on logos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'logos' AND 
    (SELECT is_admin FROM profiles WHERE user_id = auth.uid()) = TRUE
);
CREATE POLICY "Allow admin update access on logos" ON storage.objects FOR UPDATE TO authenticated USING (
    bucket_id = 'logos' AND 
    (SELECT is_admin FROM profiles WHERE user_id = auth.uid()) = TRUE
);

    