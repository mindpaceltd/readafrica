
-- Enable HTTP extension
create extension if not exists http with schema extensions;

-- Create a table for public profiles
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  is_admin boolean not null default false,
  balance numeric(10, 2) not null default 0.00,
  phone_number text,
  primary key (id)
);
-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security
alter table public.profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile for new users.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'avatar_url');
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Create a table for book categories
create table public.categories (
    id serial primary key,
    name text not null unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.categories enable row level security;
create policy "Categories are viewable by everyone." on public.categories for select using (true);
create policy "Admins can manage categories." on public.categories for all using (exists (select 1 from profiles where id = auth.uid() and is_admin = true));

-- Create a table for books
create table public.books (
    id uuid primary key default gen_random_uuid(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    description text,
    price numeric(10,2) not null default 0.00,
    thumbnail_url text,
    data_ai_hint text,
    preview_content text,
    full_content_url text, -- URL to PDF/EPUB in storage
    is_featured boolean not null default false,
    is_subscription boolean not null default false,
    tags text[],
    category_id integer references public.categories(id) on delete set null,
    status text not null default 'draft', -- 'draft' or 'published'
    seo_title text,
    seo_description text
);
alter table public.books enable row level security;
create policy "Published books are viewable by everyone." on public.books for select using (status = 'published');
create policy "Admins can see all books." on public.books for select using (exists (select 1 from profiles where id = auth.uid() and is_admin = true));
create policy "Admins can manage books." on public.books for all using (exists (select 1 from profiles where id = auth.uid() and is_admin = true));


-- Create table for subscription plans
create table public.subscription_plans (
    id uuid primary key default gen_random_uuid(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    price numeric(10,2) not null,
    period text not null, -- e.g., 'monthly', 'yearly'
    features text[],
    active boolean not null default true
);
alter table public.subscription_plans enable row level security;
create policy "Active subscription plans are viewable by everyone." on public.subscription_plans for select using (active = true);
create policy "Admins can manage subscription plans." on public.subscription_plans for all using (exists (select 1 from profiles where id = auth.uid() and is_admin = true));


-- Junction table for users and their purchased books
create table public.user_books (
    user_id uuid not null references public.profiles(id) on delete cascade,
    book_id uuid not null references public.books(id) on delete cascade,
    purchased_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (user_id, book_id)
);
alter table public.user_books enable row level security;
create policy "Users can view their own library." on public.user_books for select using (auth.uid() = user_id);
-- Admins can view all, and inserts/updates happen via trusted server-side calls (e.g. after payment)


-- Junction table for users and their active subscriptions
create table public.user_subscriptions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    plan_id uuid not null references public.subscription_plans(id) on delete restrict,
    status text not null, -- e.g., 'active', 'canceled', 'past_due'
    current_period_start timestamp with time zone not null,
    current_period_end timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.user_subscriptions enable row level security;
create policy "Users can view their own subscriptions." on public.user_subscriptions for select using (auth.uid() = user_id);
create policy "Admins can view all subscriptions." on public.user_subscriptions for select using (exists (select 1 from profiles where id = auth.uid() and is_admin = true));


-- Table for transactions
create table public.transactions (
    id uuid primary key default gen_random_uuid(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_id uuid not null references public.profiles(id) on delete cascade,
    amount numeric(10,2) not null,
    status text not null, -- 'pending', 'completed', 'failed'
    transaction_type text not null, -- 'purchase', 'subscription', 'topup'
    book_id uuid references public.books(id) on delete set null,
    subscription_plan_id uuid references public.subscription_plans(id) on delete set null,
    mpesa_code text
);
alter table public.transactions enable row level security;
create policy "Users can view their own transactions." on public.transactions for select using (auth.uid() = user_id);
create policy "Admins can view all transactions." on public.transactions for select using (exists (select 1 from profiles where id = auth.uid() and is_admin = true));


-- Table for devotionals
create table public.devotionals (
    id uuid primary key default gen_random_uuid(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    message text not null,
    author_id uuid references public.profiles(id) on delete set null,
    scheduled_for timestamp with time zone,
    sent_at timestamp with time zone
);
alter table public.devotionals enable row level security;
create policy "Devotionals are public." on public.devotionals for select using (true);
create policy "Admins can manage devotionals." on public.devotionals for all using (exists (select 1 from profiles where id = auth.uid() and is_admin = true));


-- Table for notifications
create table public.notifications (
    id uuid primary key default gen_random_uuid(),
    created_by uuid references public.profiles(id) on delete set null,
    sent_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    message text not null,
    target_audience text not null -- e.g., 'all', 'subscribers'
);
alter table public.notifications enable row level security;
create policy "Notifications are public." on public.notifications for select using (true);
create policy "Admins can manage notifications." on public.notifications for all using (exists (select 1 from profiles where id = auth.uid() and is_admin = true));

-- Table for user notifications status (junction table)
create table public.user_notifications (
    user_id uuid not null references public.profiles(id) on delete cascade,
    notification_id uuid not null references public.notifications(id) on delete cascade,
    read_at timestamp with time zone,
    primary key(user_id, notification_id)
);
alter table public.user_notifications enable row level security;
create policy "Users can manage their own notification statuses." on public.user_notifications for all using (auth.uid() = user_id);


-- Table for admin activity logs
create table public.activity_logs (
    id bigserial primary key,
    timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
    admin_id uuid not null references public.profiles(id) on delete cascade,
    action text not null,
    details text
);
alter table public.activity_logs enable row level security;
create policy "Admins can view activity logs." on public.activity_logs for select using (exists (select 1 from profiles where id = auth.uid() and is_admin = true));


-- Set up Storage!
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values 
    ('book_thumbnails', 'book_thumbnails', true, 5242880, '{"image/jpeg","image/png","image/webp"}'),
    ('book_content', 'book_content', false, 52428800, '{"application/pdf","application/epub+zip"}'),
    ('avatars', 'avatars', true, 1048576, '{"image/jpeg","image/png","image/webp"}');

-- RLS policies for Avatars
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

create policy "Anyone can update their own avatar." on storage.objects
  for update using (auth.uid() = owner) with check (bucket_id = 'avatars');

-- RLS policies for Book Thumbnails (assuming admins upload)
create policy "Book thumbnails are publicly accessible." on storage.objects
  for select using (bucket_id = 'book_thumbnails');

create policy "Admins can manage book thumbnails." on storage.objects
  for all using (
    bucket_id = 'book_thumbnails' and
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );

-- RLS policies for Book Content
create policy "Admins can manage book content." on storage.objects
  for all using (
    bucket_id = 'book_content' and
    exists (select 1 from profiles where id = auth.uid() and is_admin = true)
  );
  
create policy "Users can read content for books they own." on storage.objects
 for select using (
    bucket_id = 'book_content' and
    exists (
        select 1 from user_books 
        where user_books.user_id = auth.uid() and user_books.book_id::text = (storage.foldername(name))[1]
    )
 );

