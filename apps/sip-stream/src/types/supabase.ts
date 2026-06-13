export interface Database {
  public: {
    Tables: {
      games: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
          status: 'waiting' | 'active' | 'completed';
          game_type: string;
          created_by: string;
          current_player: string | null;
          deck: string[];
          discard_pile: string[];
          players: {
            id: string;
            name: string;
            drinks: number;
            hand: string[];
            is_host: boolean;
          }[];
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          updated_at?: string;
          status?: 'waiting' | 'active' | 'completed';
          game_type: string;
          created_by: string;
          current_player?: string | null;
          deck?: string[];
          discard_pile?: string[];
          players?: {
            id: string;
            name: string;
            drinks: number;
            hand: string[];
            is_host: boolean;
          }[];
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
          updated_at?: string;
          status?: 'waiting' | 'active' | 'completed';
          game_type?: string;
          created_by?: string;
          current_player?: string | null;
          deck?: string[];
          discard_pile?: string[];
          players?: {
            id: string;
            name: string;
            drinks: number;
            hand: string[];
            is_host: boolean;
          }[];
        };
      };
      game_history: {
        Row: {
          id: string;
          game_id: string;
          player_id: string;
          action: string;
          details: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          game_id: string;
          player_id: string;
          action: string;
          details?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          id?: string;
          game_id?: string;
          player_id?: string;
          action?: string;
          details?: Record<string, unknown>;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
