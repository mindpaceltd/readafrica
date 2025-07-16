-- Policies for book_covers bucket
CREATE POLICY "Allow public read access on book covers" ON storage.objects FOR
SELECT USING (bucket_id = 'book-covers');

CREATE POLICY "Allow admin upload on book covers" ON storage.objects FOR
INSERT WITH CHECK (
  bucket_id = 'book-covers' AND
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Allow admin update on book covers" ON storage.objects FOR
UPDATE
  USING (
    bucket_id = 'book-covers' AND
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Allow admin delete on book covers" ON storage.objects FOR
DELETE
  USING (
    bucket_id = 'book-covers' AND
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );

-- Policies for book_content bucket
CREATE POLICY "Allow authenticated read on book content" ON storage.objects FOR
SELECT USING (
    bucket_id = 'book-content' AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow admin upload on book content" ON storage.objects FOR
INSERT WITH CHECK (
  bucket_id = 'book-content' AND
  (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Allow admin update on book content" ON storage.objects FOR
UPDATE
  USING (
    bucket_id = 'book-content' AND
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Allow admin delete on book content" ON storage.objects FOR
DELETE
  USING (
    bucket_id = 'book-content' AND
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid())
  );