export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          priority: 'low' | 'medium' | 'high' | null;
          status: 'todo' | 'in_progress' | 'done';
          ai_category: string | null;
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          priority?: 'low' | 'medium' | 'high' | null;
          status?: 'todo' | 'in_progress' | 'done';
          ai_category?: string | null;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          priority?: 'low' | 'medium' | 'high' | null;
          status?: 'todo' | 'in_progress' | 'done';
          ai_category?: string | null;
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          emoji: string | null;
          streak: number;
          longest_streak: number;
          completed_dates: string[];
          reminder_time: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          emoji?: string | null;
          streak?: number;
          longest_streak?: number;
          completed_dates?: string[];
          reminder_time?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          emoji?: string | null;
          streak?: number;
          longest_streak?: number;
          completed_dates?: string[];
          reminder_time?: string | null;
          created_at?: string;
        };
      };
      focus_sessions: {
        Row: {
          id: string;
          user_id: string;
          duration_seconds: number;
          started_at: string;
          ended_at: string | null;
          label: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          duration_seconds: number;
          started_at: string;
          ended_at?: string | null;
          label?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          duration_seconds?: number;
          started_at?: string;
          ended_at?: string | null;
          label?: string | null;
          created_at?: string;
        };
      };
      ai_suggestions: {
        Row: {
          id: string;
          user_id: string;
          type: 'task' | 'habit' | 'focus' | 'general';
          content: string;
          reason: string | null;
          dismissed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'task' | 'habit' | 'focus' | 'general';
          content: string;
          reason?: string | null;
          dismissed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'task' | 'habit' | 'focus' | 'general';
          content?: string;
          reason?: string | null;
          dismissed?: boolean;
          created_at?: string;
        };
      };
      waitlist: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          referral_source: string | null;
          position: number;
          confirmed: boolean;
          confirmation_token: string;
          ip_hash: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          referral_source?: string | null;
          position?: number;
          confirmed?: boolean;
          confirmation_token?: string;
          ip_hash?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          referral_source?: string | null;
          position?: number;
          confirmed?: boolean;
          confirmation_token?: string;
          ip_hash?: string | null;
          created_at?: string;
        };
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          status: 'new' | 'read' | 'replied';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          status?: 'new' | 'read' | 'replied';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          message?: string;
          status?: 'new' | 'read' | 'replied';
          created_at?: string;
        };
      };
    };
  };
};
