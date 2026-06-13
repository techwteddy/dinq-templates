-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- LISTINGS
CREATE POLICY "Listings are viewable by everyone"
  ON public.listings FOR SELECT USING (true);

CREATE POLICY "Owners can create listings"
  ON public.listings FOR INSERT WITH CHECK (
    auth.uid() = owner_id
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'property_owner')
  );

CREATE POLICY "Owners can update own listings"
  ON public.listings FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete own listings"
  ON public.listings FOR DELETE USING (auth.uid() = owner_id);

-- LISTING IMAGES
CREATE POLICY "Listing images are viewable by everyone"
  ON public.listing_images FOR SELECT USING (true);

CREATE POLICY "Owners can add listing images"
  ON public.listing_images FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.listings WHERE id = listing_id AND owner_id = auth.uid())
  );

CREATE POLICY "Owners can delete own listing images"
  ON public.listing_images FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.listings WHERE id = listing_id AND owner_id = auth.uid())
  );

-- REVIEWS
CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT USING (true);

CREATE POLICY "Renters can create reviews"
  ON public.reviews FOR INSERT WITH CHECK (
    auth.uid() = reviewer_id
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'renter')
  );

CREATE POLICY "Reviewers can update own reviews"
  ON public.reviews FOR UPDATE USING (auth.uid() = reviewer_id);

CREATE POLICY "Reviewers can delete own reviews"
  ON public.reviews FOR DELETE USING (auth.uid() = reviewer_id);

-- FAVORITES
CREATE POLICY "Users can view own favorites"
  ON public.favorites FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites"
  ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- CONVERSATIONS
CREATE POLICY "Participants can view own conversations"
  ON public.conversations FOR SELECT USING (
    auth.uid() = renter_id OR auth.uid() = owner_id
  );

CREATE POLICY "Renters can start conversations"
  ON public.conversations FOR INSERT WITH CHECK (auth.uid() = renter_id);

-- MESSAGES
CREATE POLICY "Participants can view messages in their conversations"
  ON public.messages FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = conversation_id
      AND (renter_id = auth.uid() OR owner_id = auth.uid())
    )
  );

CREATE POLICY "Participants can send messages"
  ON public.messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = conversation_id
      AND (renter_id = auth.uid() OR owner_id = auth.uid())
    )
  );

CREATE POLICY "Recipients can mark messages as read"
  ON public.messages FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = conversation_id
      AND (renter_id = auth.uid() OR owner_id = auth.uid())
    )
    AND sender_id != auth.uid()
  );
