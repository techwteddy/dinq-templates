export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          website: string | null;
          gender: string | null;
          is_professional: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
          username: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          image_url: string;
          caption: string | null;
          media_type: "image" | "video";
          created_at: string | null;
        };
        Insert: {
          user_id: string;
          image_url: string;
          caption?: string | null;
          media_type?: "image" | "video";
        };
        Update: Partial<Database["public"]["Tables"]["posts"]["Row"]>;
        Relationships: [];
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          content: string;
          created_at: string | null;
        };
        Insert: { post_id: string; user_id: string; content: string };
        Update: Partial<Database["public"]["Tables"]["comments"]["Row"]>;
        Relationships: [];
      };
      likes: {
        Row: { id: string; post_id: string; user_id: string; created_at: string | null };
        Insert: { post_id: string; user_id: string };
        Update: Partial<Database["public"]["Tables"]["likes"]["Row"]>;
        Relationships: [];
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string | null;
        };
        Insert: { follower_id: string; following_id: string };
        Update: Partial<Database["public"]["Tables"]["follows"]["Row"]>;
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          content: string | null;
          media_url: string | null;
          media_type: string | null;
          is_read: boolean | null;
          created_at: string | null;
        };
        Insert: {
          sender_id: string;
          receiver_id: string;
          content?: string | null;
          media_url?: string | null;
          media_type?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Row"]>;
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          actor_id: string;
          type: string;
          post_id: string | null;
          content: string | null;
          is_read: boolean | null;
          created_at: string | null;
        };
        Insert: {
          user_id: string;
          actor_id: string;
          type: string;
          post_id?: string | null;
          content?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Row"]>;
        Relationships: [];
      };
      stories: {
        Row: {
          id: string;
          user_id: string;
          image_url: string;
          media_type: "image" | "video";
          created_at: string | null;
          expires_at: string | null;
        };
        Insert: {
          user_id: string;
          image_url: string;
          media_type?: "image" | "video";
        };
        Update: Partial<Database["public"]["Tables"]["stories"]["Row"]>;
        Relationships: [];
      };
      saved_posts: {
        Row: { id: string; user_id: string; post_id: string; created_at: string | null };
        Insert: { user_id: string; post_id: string };
        Update: Partial<Database["public"]["Tables"]["saved_posts"]["Row"]>;
        Relationships: [];
      };
    };
    Views: {
      conversations: {
        Row: {
          a: string | null;
          b: string | null;
          last_message_id: string | null;
          sender_id: string | null;
          receiver_id: string | null;
          content: string | null;
          is_read: boolean | null;
          created_at: string | null;
        };
        Relationships: [];
      };
    };
    Functions: { [k: string]: never };
    Enums: { [k: string]: never };
    CompositeTypes: { [k: string]: never };
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Post = Database["public"]["Tables"]["posts"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type Story = Database["public"]["Tables"]["stories"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
