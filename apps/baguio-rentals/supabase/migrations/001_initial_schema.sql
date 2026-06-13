-- =============================================
-- PROFILES (extends auth.users)
-- =============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('property_owner', 'renter')),
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Future monetization
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium')),
  subscription_expires_at TIMESTAMPTZ
);

-- =============================================
-- LISTINGS
-- =============================================
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('apartment', 'house', 'room', 'condo', 'townhouse')),
  price_monthly NUMERIC(10,2) NOT NULL,
  bedrooms INTEGER NOT NULL DEFAULT 0,
  bathrooms INTEGER NOT NULL DEFAULT 0,
  area_sqm NUMERIC(8,2),
  pet_friendly BOOLEAN NOT NULL DEFAULT false,
  furnished BOOLEAN NOT NULL DEFAULT false,
  availability TEXT NOT NULL DEFAULT 'available' CHECK (availability IN ('available', 'reserved', 'occupied')),
  -- Address
  address_line TEXT NOT NULL,
  barangay TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Baguio City',
  province TEXT NOT NULL DEFAULT 'Benguet',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Future monetization
  is_featured BOOLEAN NOT NULL DEFAULT false,
  featured_until TIMESTAMPTZ,
  boost_score INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_listings_owner ON public.listings(owner_id);
CREATE INDEX idx_listings_availability ON public.listings(availability);
CREATE INDEX idx_listings_property_type ON public.listings(property_type);
CREATE INDEX idx_listings_price ON public.listings(price_monthly);
CREATE INDEX idx_listings_barangay ON public.listings(barangay);
CREATE INDEX idx_listings_created ON public.listings(created_at DESC);

-- Full-text search
ALTER TABLE public.listings ADD COLUMN fts tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(barangay, '')), 'C')
  ) STORED;
CREATE INDEX idx_listings_fts ON public.listings USING gin(fts);

-- =============================================
-- LISTING IMAGES
-- =============================================
CREATE TABLE public.listing_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_listing_images_listing ON public.listing_images(listing_id);

-- =============================================
-- REVIEWS (renter reviews an owner)
-- =============================================
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(reviewer_id, owner_id),
  CHECK (reviewer_id != owner_id)
);

CREATE INDEX idx_reviews_owner ON public.reviews(owner_id);

-- =============================================
-- FAVORITES
-- =============================================
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, listing_id)
);

CREATE INDEX idx_favorites_user ON public.favorites(user_id);

-- =============================================
-- CONVERSATIONS
-- =============================================
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  renter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(listing_id, renter_id)
);

CREATE INDEX idx_conversations_renter ON public.conversations(renter_id);
CREATE INDEX idx_conversations_owner ON public.conversations(owner_id);

-- =============================================
-- MESSAGES
-- =============================================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at);

-- =============================================
-- Owner average rating view
-- =============================================
CREATE OR REPLACE VIEW public.owner_ratings AS
SELECT
  owner_id,
  COUNT(*) AS review_count,
  ROUND(AVG(rating)::numeric, 1) AS average_rating
FROM public.reviews
GROUP BY owner_id;

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_listings_updated
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_reviews_updated
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_conversations_updated
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
    'renter'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
