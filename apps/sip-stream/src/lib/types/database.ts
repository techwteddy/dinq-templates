export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          status: 'online' | 'offline' | 'in_game' | 'away';
          current_game_id: string | null;
          last_seen: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
          status?: 'online' | 'offline' | 'in_game' | 'away';
          current_game_id?: string | null;
          last_seen?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          status?: 'online' | 'offline' | 'in_game' | 'away';
          current_game_id?: string | null;
          last_seen?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      friends: {
        Row: {
          id: string;
          user_id: string;
          friend_id: string;
          status: 'pending' | 'accepted' | 'blocked';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          friend_id: string;
          status?: 'pending' | 'accepted' | 'blocked';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          friend_id?: string;
          status?: 'pending' | 'accepted' | 'blocked';
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: 'friend_request' | 'game_invite' | 'game_update' | 'friend_joined_game';
          title: string;
          message: string;
          data: Record<string, unknown> | null;
          is_read: boolean;
          requires_action: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'friend_request' | 'game_invite' | 'game_update' | 'friend_joined_game';
          title: string;
          message: string;
          data?: Record<string, unknown> | null;
          is_read?: boolean;
          requires_action?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'friend_request' | 'game_invite' | 'game_update' | 'friend_joined_game';
          title?: string;
          message?: string;
          data?: Record<string, unknown> | null;
          is_read?: boolean;
          requires_action?: boolean;
          created_at?: string;
        };
      };
      game_invitations: {
        Row: {
          id: string;
          game_id: string;
          inviter_id: string;
          invitee_id: string;
          status: 'pending' | 'accepted' | 'declined' | 'expired';
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          game_id: string;
          inviter_id: string;
          invitee_id: string;
          status?: 'pending' | 'accepted' | 'declined' | 'expired';
          expires_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          game_id?: string;
          inviter_id?: string;
          invitee_id?: string;
          status?: 'pending' | 'accepted' | 'declined' | 'expired';
          expires_at?: string;
          created_at?: string;
        };
      };
      games: {
        Row: {
          id: string;
          created_at: string;
          game_type: 'kings-cup' | 'never-have-i-ever' | 'custom-deck';
          players: string[];
          current_drinks: number;
          current_player_index: number;
          is_active: boolean;
          created_by: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          game_type: 'kings-cup' | 'never-have-i-ever' | 'custom-deck';
          players: string[];
          current_drinks?: number;
          current_player_index?: number;
          is_active?: boolean;
          created_by: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          game_type?: 'kings-cup' | 'never-have-i-ever' | 'custom-deck';
          players?: string[];
          current_drinks?: number;
          current_player_index?: number;
          is_active?: boolean;
          created_by?: string;
        };
      };
      game_history: {
        Row: {
          id: string;
          created_at: string;
          game_id: string;
          action: string;
          player: string;
          details: Record<string, unknown>;
        };
        Insert: {
          id?: string;
          created_at?: string;
          game_id: string;
          action: string;
          player: string;
          details?: Record<string, unknown>;
        };
        Update: {
          id?: string;
          created_at?: string;
          game_id?: string;
          action?: string;
          player?: string;
          details?: Record<string, unknown>;
        };
      };
    };
  };
}

export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
export type Friend = Database['public']['Tables']['friends']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
export type GameInvitation = Database['public']['Tables']['game_invitations']['Row'];
export type Game = Database['public']['Tables']['games']['Row'];
export type GameHistory = Database['public']['Tables']['game_history']['Row'];
