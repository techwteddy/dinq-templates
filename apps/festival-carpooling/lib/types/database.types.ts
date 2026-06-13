// Auto-generate this file in your project with:
//   supabase gen types typescript --linked > lib/types/database.types.ts
// This hand-written version matches 001_schema.sql exactly.

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type Database = {
  public: {
    Tables: {
      app_config: {
        Row: { key: string; value: number; description: string | null }
        Insert: { key: string; value: number; description?: string | null }
        Update: { key?: string; value?: number; description?: string | null }
        Relationships: []
      }
      festivals: {
        Row: {
          id: string
          name: string
          slug: string
          location: string | null
          starts_at: string | null
          ends_at: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          location?: string | null
          starts_at?: string | null
          ends_at?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          location?: string | null
          starts_at?: string | null
          ends_at?: string | null
          is_active?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          display_name: string
          avatar_url: string | null
          phone: string | null
          bio: string | null
          is_admin: boolean
          created_at: string
        }
        Insert: {
          id: string
          display_name: string
          avatar_url?: string | null
          phone?: string | null
          bio?: string | null
          is_admin?: boolean
          created_at?: string
        }
        Update: {
          display_name?: string
          avatar_url?: string | null
          phone?: string | null
          bio?: string | null
        }
        Relationships: []
      }
      rides: {
        Row: {
          id: string
          festival_id: string
          driver_id: string | null
          driver_name: string | null
          driver_email: string | null
          driver_phone: string | null
          contact_preference: string | null
          management_token: string
          type: string
          origin_city: string
          destination: string
          departure_at: string
          return_trip: boolean
          total_seats: number
          seats_taken: number
          fuel_contribution_eur: number | null
          notes: string | null
          stops: string | null
          meeting_point: string | null
          distance_km: number | null
          estimated_co2_saved_kg: number
          status: 'active' | 'full' | 'cancelled'
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          festival_id: string
          driver_id?: string | null
          driver_name?: string | null
          driver_email?: string | null
          driver_phone?: string | null
          contact_preference?: string | null
          management_token?: string
          type?: string
          origin_city: string
          destination: string
          departure_at: string
          return_trip?: boolean
          total_seats: number
          seats_taken?: number
          fuel_contribution_eur?: number | null
          notes?: string | null
          stops?: string | null
          meeting_point?: string | null
          distance_km?: number | null
          estimated_co2_saved_kg?: number
          status?: 'active' | 'full' | 'cancelled'
          deleted_at?: string | null
        }
        Update: {
          driver_name?: string | null
          driver_email?: string | null
          driver_phone?: string | null
          contact_preference?: string | null
          origin_city?: string
          destination?: string
          departure_at?: string
          return_trip?: boolean
          total_seats?: number
          fuel_contribution_eur?: number | null
          notes?: string | null
          stops?: string | null
          meeting_point?: string | null
          distance_km?: number | null
          status?: 'active' | 'full' | 'cancelled'
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rides_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rides_festival_id_fkey"
            columns: ["festival_id"]
            isOneToOne: false
            referencedRelation: "festivals"
            referencedColumns: ["id"]
          }
        ]
      }
      ride_requests: {
        Row: {
          id: string
          ride_id: string
          passenger_id: string | null
          passenger_name: string | null
          passenger_contact: string | null
          seats_requested: number
          message: string | null
          status: 'pending' | 'accepted' | 'declined' | 'cancelled'
          deleted_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          ride_id: string
          passenger_id?: string | null
          passenger_name?: string | null
          passenger_contact?: string | null
          seats_requested?: number
          message?: string | null
          status?: 'pending' | 'accepted' | 'declined' | 'cancelled'
          deleted_at?: string | null
        }
        Update: {
          status?: 'pending' | 'accepted' | 'declined' | 'cancelled'
          deleted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ride_requests_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ride_requests_passenger_id_fkey"
            columns: ["passenger_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      announcements: {
        Row: {
          id: string
          festival_id: string
          author_id: string | null
          title: string
          body: string
          pinned: boolean
          published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          festival_id: string
          author_id?: string | null
          title: string
          body: string
          pinned?: boolean
          published?: boolean
        }
        Update: {
          title?: string
          body?: string
          pinned?: boolean
          published?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "announcements_festival_id_fkey"
            columns: ["festival_id"]
            isOneToOne: false
            referencedRelation: "festivals"
            referencedColumns: ["id"]
          }
        ]
      }
      reports: {
        Row: {
          id: string
          reporter_id: string | null
          ride_id: string | null
          reason: string
          resolved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          reporter_id?: string | null
          ride_id?: string | null
          reason: string
          resolved?: boolean
        }
        Update: { resolved?: boolean }
        Relationships: [
          {
            foreignKeyName: "reports_ride_id_fkey"
            columns: ["ride_id"]
            isOneToOne: false
            referencedRelation: "rides"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: {
      accept_ride_request: {
        Args: { p_request_id: string; p_management_token: string }
        Returns: Json
      }
      recalculate_ride_co2: {
        Args: { p_ride_id: string }
        Returns: undefined
      }
      get_community_stats: {
        Args: { p_festival_id: string; p_scope?: string }
        Returns: Json
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// ============================================================
// Domain types
// ============================================================

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Festival = Database['public']['Tables']['festivals']['Row']
export type Ride = Database['public']['Tables']['rides']['Row']
export type RideRequest = Database['public']['Tables']['ride_requests']['Row']
export type Announcement = Database['public']['Tables']['announcements']['Row']

export type RideWithDriver = Ride & {
  driver: Pick<Profile, 'id' | 'display_name' | 'avatar_url'> | null
}

export type RideWithDetails = Ride & {
  driver: Pick<Profile, 'id' | 'display_name' | 'avatar_url'> | null
  ride_requests: (RideRequest & {
    passenger: Pick<Profile, 'id' | 'display_name' | 'avatar_url'> | null
  })[]
}

export type CommunityStats = {
  total_rides: number
  total_passengers: number
  total_co2_saved_kg: number
}

export type RideFilters = {
  origin?: string
  returnTrip?: boolean
  date?: string
  festivalId?: string
  type?: 'offer' | 'seek'
}

export type MyRequest = RideRequest & {
  ride: (Pick<Ride, 'id' | 'origin_city' | 'destination' | 'departure_at' | 'status'> & {
    driver: Pick<Profile, 'id' | 'display_name' | 'avatar_url'> | null
  }) | null
}
