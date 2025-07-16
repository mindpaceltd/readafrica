-- Create Profiles table to extend auth.users
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone_number TEXT UNIQUE,
    balance NUMERIC(10, 2) DEFAULT 0.00,
    is_admin BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function on new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- Create Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Books table
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    thumbnail_url TEXT,
    data_ai_hint TEXT,
    preview_content TEXT,
    full_content_url TEXT, -- URL to PDF/EPUB in Supabase Storage
    is_featured BOOLEAN DEFAULT FALSE,
    is_subscription BOOLEAN DEFAULT FALSE,
    tags TEXT[],
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    status TEXT NOT NULL CHECK (status IN ('published', 'draft')) DEFAULT 'draft',
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Subscription Plans table
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    period TEXT NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'yearly')),
    features TEXT[],
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Transactions table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    book_id UUID REFERENCES books(id),
    subscription_plan_id UUID REFERENCES subscription_plans(id),
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('completed', 'pending', 'failed')),
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'subscription', 'top-up')),
    mpesa_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create User_Books table for ownership
CREATE TABLE user_books (
    user_id UUID NOT NULL REFERENCES auth.users(id),
    book_id UUID NOT NULL REFERENCES books(id),
    purchased_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, book_id)
);

-- Create Devotionals table
CREATE TABLE devotionals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id), -- Admin who created it
    scheduled_for TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    target_audience TEXT NOT NULL, -- e.g., 'all', 'purchased'
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Create Admin Activity Logs table
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    admin_id UUID NOT NULL REFERENCES auth.users(id),
    action TEXT NOT NULL,
    details TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Add some seed data for categories
INSERT INTO categories (name) VALUES
('Spiritual Growth'),
('Prophetic Teaching'),
('Financial Freedom'),
('Personal Development');

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE devotionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- Profiles
CREATE POLICY "Users can view their own profile."
    ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile."
    ON profiles FOR UPDATE USING (auth.uid() = id);

-- Books
CREATE POLICY "Anyone can view published books."
    ON books FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage all books."
    ON books FOR ALL USING (
        (SELECT is_admin FROM profiles WHERE id = auth.uid())
    );

-- Categories
CREATE POLICY "Anyone can view categories."
    ON categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories."
    ON categories FOR ALL USING (
        (SELECT is_admin FROM profiles WHERE id = auth.uid())
    );

-- User Books (Ownership)
CREATE POLICY "Users can view their own purchased books."
    ON user_books FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all purchased books."
    ON user_books FOR SELECT USING (
        (SELECT is_admin FROM profiles WHERE id = auth.uid())
    );
-- Note: Inserts should be handled by server-side logic/triggers after successful payment

-- Transactions
CREATE POLICY "Users can view their own transactions."
    ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all transactions."
    ON transactions FOR SELECT USING (
        (SELECT is_admin FROM profiles WHERE id = auth.uid())
    );

-- Subscription Plans
CREATE POLICY "Anyone can view active subscription plans."
    ON subscription_plans FOR SELECT USING (active = TRUE);
CREATE POLICY "Admins can manage subscription plans."
    ON subscription_plans FOR ALL USING (
        (SELECT is_admin FROM profiles WHERE id = auth.uid())
    );

-- All other tables should be admin-only for now, handled via server-side logic
-- with the service_role key, or with admin-only policies.
CREATE POLICY "Admins can manage devotionals."
    ON devotionals FOR ALL USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage notifications."
    ON notifications FOR ALL USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Admins can manage activity logs."
    ON activity_logs FOR ALL USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));
