
-- Create the profiles table to store public user data
CREATE TABLE public.profiles (
    id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
    updated_at timestamp with time zone,
    full_name text,
    avatar_url text,
    phone_number text,
    is_admin boolean DEFAULT false NOT NULL,
    balance numeric(10, 2) DEFAULT 0.00 NOT NULL,
    CONSTRAINT profiles_pkey PRIMARY KEY (id)
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- Add policies for profiles table
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can do anything." ON public.profiles FOR ALL USING (public.profiles.is_admin = true);

-- Function to create a profile for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$;
-- Trigger to call the function when a new user signs up
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();


-- Create the categories table for books
CREATE TABLE public.categories (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
-- Add policies for categories table
CREATE POLICY "Categories are public." ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories." ON public.categories FOR ALL USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

-- Create the books table
CREATE TABLE public.books (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    title text NOT NULL,
    description text,
    price numeric(10, 2) NOT NULL,
    thumbnail_url text,
    data_ai_hint text,
    preview_content text,
    full_content_url text,
    is_featured boolean DEFAULT false NOT NULL,
    is_subscription boolean DEFAULT false NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL, -- 'draft' or 'published'
    category_id bigint REFERENCES public.categories(id) ON DELETE SET NULL,
    tags text[],
    seo_title text,
    seo_description text
);
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
-- Add policies for books table
CREATE POLICY "Published books are viewable by everyone." ON public.books FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can see all books." ON public.books FOR SELECT USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);
CREATE POLICY "Admins can manage books." ON public.books FOR ALL USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);


-- Create the subscription_plans table
CREATE TABLE public.subscription_plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    price numeric(10, 2) NOT NULL,
    period text NOT NULL, -- e.g., 'daily', 'weekly', 'monthly'
    features text[],
    active boolean DEFAULT true NOT NULL
);
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
-- Add policies for subscription_plans table
CREATE POLICY "Active subscription plans are public." ON public.subscription_plans FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage subscription plans." ON public.subscription_plans FOR ALL USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);


-- Create user_books join table for purchases
CREATE TABLE public.user_books (
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    book_id uuid NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    purchased_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_books_pkey PRIMARY KEY (user_id, book_id)
);
ALTER TABLE public.user_books ENABLE ROW LEVEL SECURITY;
-- Add policies for user_books table
CREATE POLICY "Users can view their own purchased books." ON public.user_books FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all purchases." ON public.user_books FOR SELECT USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);

-- Create transactions table
CREATE TABLE public.transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    book_id uuid REFERENCES public.books(id) ON DELETE SET NULL,
    subscription_plan_id uuid REFERENCES public.subscription_plans(id) ON DELETE SET NULL,
    amount numeric(10, 2) NOT NULL,
    status text NOT NULL, -- e.g., 'pending', 'completed', 'failed'
    transaction_type text NOT NULL, -- e.g., 'purchase', 'subscription', 'topup'
    mpesa_code text
);
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
-- Add policies for transactions table
CREATE POLICY "Users can view their own transactions." ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all transactions." ON public.transactions FOR ALL USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);


-- Create devotionals table
CREATE TABLE public.devotionals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    message text NOT NULL,
    author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    scheduled_for timestamp with time zone,
    sent_at timestamp with time zone
);
ALTER TABLE public.devotionals ENABLE ROW LEVEL SECURITY;
-- Add policies for devotionals table
CREATE POLICY "Devotionals are public." ON public.devotionals FOR SELECT USING (true);
CREATE POLICY "Admins can manage devotionals." ON public.devotionals FOR ALL USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);


-- Create notifications table
CREATE TABLE public.notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    message text NOT NULL,
    target_audience text NOT NULL, -- e.g., 'all', 'purchased'
    created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    sent_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
-- Add policies for notifications table
CREATE POLICY "Notifications are public for now, can be refined later." ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Admins can manage notifications." ON public.notifications FOR ALL USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);


-- Create activity_logs table for admin actions
CREATE TABLE public.activity_logs (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    timestamp timestamp with time zone DEFAULT now() NOT NULL,
    admin_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action text NOT NULL,
    details text
);
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
-- Add policies for activity_logs table
CREATE POLICY "Admins can view and create activity logs." ON public.activity_logs FOR ALL USING (
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
);
