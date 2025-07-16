-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('avatars', 'avatars', true),
  ('book-covers', 'book-covers', true),
  ('book-content', 'book-content', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for 'avatars' bucket
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

CREATE POLICY "Anyone can upload an avatar."
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK ( bucket_id = 'avatars' );

CREATE POLICY "Anyone can update their own avatar."
  ON storage.objects FOR UPDATE
  TO authenticated
  USING ( auth.uid() = owner_id );

-- Policies for 'book-covers' bucket
CREATE POLICY "Book covers are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'book-covers' );

CREATE POLICY "Admins can upload book covers."
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'book-covers' AND
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Admins can update book covers."
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'book-covers' AND
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );

-- Policies for 'book-content' bucket
CREATE POLICY "Book content is accessible to admins and owners."
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'book-content' AND (
      (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) OR
      -- This part is tricky without a direct link from storage object to book purchase.
      -- For now, we restrict to admins. A more complex setup might involve functions.
      (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admins can upload book content."
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'book-content' AND
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Admins can update book content."
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'book-content' AND
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );
