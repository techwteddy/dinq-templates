export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: "property_owner" | "renter";
          full_name: string;
          avatar_url: string | null;
          phone: string | null;
          email: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
          subscription_tier: "free" | "basic" | "premium";
          subscription_expires_at: string | null;
          has_onboarded: boolean;
        };
        Insert: {
          id: string;
          role: "property_owner" | "renter";
          full_name: string;
          avatar_url?: string | null;
          phone?: string | null;
          email?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
          subscription_tier?: "free" | "basic" | "premium";
          subscription_expires_at?: string | null;
        };
        Update: {
          id?: string;
          role?: "property_owner" | "renter";
          full_name?: string;
          avatar_url?: string | null;
          phone?: string | null;
          email?: string | null;
          bio?: string | null;
          updated_at?: string;
          subscription_tier?: "free" | "basic" | "premium";
          subscription_expires_at?: string | null;
        };
      };
      listings: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          description: string;
          property_type: PropertyType;
          price_monthly: number;
          bedrooms: number;
          bathrooms: number;
          area_sqm: number | null;
          pet_friendly: boolean;
          parking: boolean;
          furnished: FurnishedStatus;
          availability: Availability;
          address_line: string;
          barangay: string;
          city: string;
          province: string;
          latitude: number | null;
          longitude: number | null;
          created_at: string;
          updated_at: string;
          is_featured: boolean;
          featured_until: string | null;
          boost_score: number;
        };
        Insert: {
          id?: string;
          owner_id: string;
          title: string;
          description: string;
          property_type: PropertyType;
          price_monthly: number;
          bedrooms?: number;
          bathrooms?: number;
          area_sqm?: number | null;
          pet_friendly?: boolean;
          parking?: boolean;
          furnished?: FurnishedStatus;
          availability?: Availability;
          address_line: string;
          barangay: string;
          city?: string;
          province?: string;
          latitude?: number | null;
          longitude?: number | null;
        };
        Update: {
          title?: string;
          description?: string;
          property_type?: PropertyType;
          price_monthly?: number;
          bedrooms?: number;
          bathrooms?: number;
          area_sqm?: number | null;
          pet_friendly?: boolean;
          parking?: boolean;
          furnished?: FurnishedStatus;
          availability?: Availability;
          address_line?: string;
          barangay?: string;
          latitude?: number | null;
          longitude?: number | null;
        };
      };
      listing_images: {
        Row: {
          id: string;
          listing_id: string;
          storage_path: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          storage_path: string;
          display_order?: number;
        };
        Update: {
          display_order?: number;
        };
      };
      reviews: {
        Row: {
          id: string;
          reviewer_id: string;
          owner_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reviewer_id: string;
          owner_id: string;
          rating: number;
          comment?: string | null;
        };
        Update: {
          rating?: number;
          comment?: string | null;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          listing_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          listing_id: string;
        };
        Update: never;
      };
      conversations: {
        Row: {
          id: string;
          listing_id: string;
          renter_id: string;
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          renter_id: string;
          owner_id: string;
        };
        Update: {
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
        };
        Update: {
          read_at?: string | null;
        };
      };
    };
    Views: {
      owner_ratings: {
        Row: {
          owner_id: string;
          review_count: number;
          average_rating: number;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

export type PropertyType = "apartment" | "house" | "room" | "condo" | "townhouse";
export type Availability = "available" | "reserved" | "occupied";
export type FurnishedStatus = "unfurnished" | "semi_furnished" | "fully_furnished";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Listing = Database["public"]["Tables"]["listings"]["Row"];
export type ListingImage = Database["public"]["Tables"]["listing_images"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type Favorite = Database["public"]["Tables"]["favorites"]["Row"];
export type Conversation = Database["public"]["Tables"]["conversations"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];

export type ListingWithImages = Listing & {
  listing_images: ListingImage[];
  profiles: Pick<Profile, "id" | "full_name" | "avatar_url">;
};

export type ConversationWithDetails = Conversation & {
  listings: Pick<Listing, "id" | "title">;
  renter: Pick<Profile, "id" | "full_name" | "avatar_url">;
  owner: Pick<Profile, "id" | "full_name" | "avatar_url">;
  last_message?: Pick<Message, "content" | "created_at" | "sender_id">;
};
