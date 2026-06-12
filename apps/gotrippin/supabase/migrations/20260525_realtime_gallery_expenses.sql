-- Realtime: gallery + expenses (members already have SELECT via RLS)

ALTER TABLE public.trip_gallery_images REPLICA IDENTITY FULL;
ALTER TABLE public.trip_expenses REPLICA IDENTITY FULL;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.trip_gallery_images;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END;
$$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.trip_expenses;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END;
$$;
