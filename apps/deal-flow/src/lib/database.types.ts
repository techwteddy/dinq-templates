export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      adapt_jobs: {
        Row: {
          attempts: number
          claimed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          max_attempts: number
          status: string
          trigger: string
          updated_at: string
          user_id: string
          workout_session_id: string | null
        }
        Insert: {
          attempts?: number
          claimed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          max_attempts?: number
          status?: string
          trigger: string
          updated_at?: string
          user_id: string
          workout_session_id?: string | null
        }
        Update: {
          attempts?: number
          claimed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          max_attempts?: number
          status?: string
          trigger?: string
          updated_at?: string
          user_id?: string
          workout_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adapt_jobs_workout_session_id_fkey"
            columns: ["workout_session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_knowledge_base: {
        Row: {
          category: string
          content: string
          created_at: string
          embedding: string | null
          id: string
          source: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          embedding?: string | null
          id?: string
          source?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          embedding?: string | null
          id?: string
          source?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      aw_events: {
        Row: {
          app: string
          bucket_id: string
          created_at: string
          duration: number
          id: number
          local_timestamp: string | null
          timestamp: string
          timezone: string
          title: string
        }
        Insert: {
          app?: string
          bucket_id: string
          created_at?: string
          duration?: number
          id: number
          local_timestamp?: string | null
          timestamp: string
          timezone?: string
          title?: string
        }
        Update: {
          app?: string
          bucket_id?: string
          created_at?: string
          duration?: number
          id?: number
          local_timestamp?: string | null
          timestamp?: string
          timezone?: string
          title?: string
        }
        Relationships: []
      }
      daily_metrics: {
        Row: {
          created_at: string
          date: string
          energy_score: number | null
          id: string
          notes: string | null
          sleep_score: number | null
          updated_at: string
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          created_at?: string
          date: string
          energy_score?: number | null
          id?: string
          notes?: string | null
          sleep_score?: number | null
          updated_at?: string
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          created_at?: string
          date?: string
          energy_score?: number | null
          id?: string
          notes?: string | null
          sleep_score?: number | null
          updated_at?: string
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      df_batches: {
        Row: {
          avg_scrape_seconds: number | null
          created_at: string
          google_sheets_url: string | null
          id: string
          name: string
          scraped_count: number
          status: string
          total_companies: number
          user_id: string
        }
        Insert: {
          avg_scrape_seconds?: number | null
          created_at?: string
          google_sheets_url?: string | null
          id?: string
          name: string
          scraped_count?: number
          status?: string
          total_companies?: number
          user_id: string
        }
        Update: {
          avg_scrape_seconds?: number | null
          created_at?: string
          google_sheets_url?: string | null
          id?: string
          name?: string
          scraped_count?: number
          status?: string
          total_companies?: number
          user_id?: string
        }
        Relationships: []
      }
      df_companies: {
        Row: {
          batch_id: string
          ceo_name: string | null
          completeness_score: number
          created_at: string
          description: string | null
          employee_count: string | null
          employee_growth_pct: number | null
          founded_year: number | null
          funding_total: string | null
          hq_location: string | null
          id: string
          industry: string | null
          linkedin_url: string | null
          name: string
          rescrape_reason: string | null
          retry_count: number | null
          revenue_estimate: string | null
          scrape_completed_at: string | null
          scrape_duration_seconds: number | null
          scrape_started_at: string | null
          scrape_status: string
          sub_industry: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          batch_id: string
          ceo_name?: string | null
          completeness_score?: number
          created_at?: string
          description?: string | null
          employee_count?: string | null
          employee_growth_pct?: number | null
          founded_year?: number | null
          funding_total?: string | null
          hq_location?: string | null
          id?: string
          industry?: string | null
          linkedin_url?: string | null
          name: string
          rescrape_reason?: string | null
          retry_count?: number | null
          revenue_estimate?: string | null
          scrape_completed_at?: string | null
          scrape_duration_seconds?: number | null
          scrape_started_at?: string | null
          scrape_status?: string
          sub_industry?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          batch_id?: string
          ceo_name?: string | null
          completeness_score?: number
          created_at?: string
          description?: string | null
          employee_count?: string | null
          employee_growth_pct?: number | null
          founded_year?: number | null
          funding_total?: string | null
          hq_location?: string | null
          id?: string
          industry?: string | null
          linkedin_url?: string | null
          name?: string
          rescrape_reason?: string | null
          retry_count?: number | null
          revenue_estimate?: string | null
          scrape_completed_at?: string | null
          scrape_duration_seconds?: number | null
          scrape_started_at?: string | null
          scrape_status?: string
          sub_industry?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "df_companies_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "df_batches"
            referencedColumns: ["id"]
          },
        ]
      }
      df_data_points: {
        Row: {
          category: string
          company_id: string
          field_name: string
          field_value: string | null
          id: string
          scraped_at: string
          source: string
          source_url: string | null
        }
        Insert: {
          category: string
          company_id: string
          field_name: string
          field_value?: string | null
          id?: string
          scraped_at?: string
          source: string
          source_url?: string | null
        }
        Update: {
          category?: string
          company_id?: string
          field_name?: string
          field_value?: string | null
          id?: string
          scraped_at?: string
          source?: string
          source_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "df_data_points_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "df_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      df_scrape_snapshots: {
        Row: {
          company_id: string
          completeness_score: number | null
          created_at: string | null
          data_points: Json
          id: string
          reason: string | null
          stages: Json
          summary_fields: Json
          version: number
        }
        Insert: {
          company_id: string
          completeness_score?: number | null
          created_at?: string | null
          data_points: Json
          id?: string
          reason?: string | null
          stages: Json
          summary_fields: Json
          version?: number
        }
        Update: {
          company_id?: string
          completeness_score?: number | null
          created_at?: string | null
          data_points?: Json
          id?: string
          reason?: string | null
          stages?: Json
          summary_fields?: Json
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "df_scrape_snapshots_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "df_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      df_scrape_stages: {
        Row: {
          company_id: string
          completed_at: string | null
          display_name: string
          error_message: string | null
          fields_found: number
          id: string
          order_index: number
          source: string
          started_at: string | null
          status: string
        }
        Insert: {
          company_id: string
          completed_at?: string | null
          display_name: string
          error_message?: string | null
          fields_found?: number
          id?: string
          order_index: number
          source: string
          started_at?: string | null
          status?: string
        }
        Update: {
          company_id?: string
          completed_at?: string | null
          display_name?: string
          error_message?: string | null
          fields_found?: number
          id?: string
          order_index?: number
          source?: string
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "df_scrape_stages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "df_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content: string
          created_at: string
          embedding: string | null
          file_path: string | null
          id: number
          metadata: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          embedding?: string | null
          file_path?: string | null
          id?: never
          metadata?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          embedding?: string | null
          file_path?: string | null
          id?: never
          metadata?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      exercise_logs: {
        Row: {
          client_session_id: string
          client_set_id: string
          completed: boolean
          created_at: string
          distance_m: number | null
          exercise_id: string
          id: string
          pain_location: string | null
          pain_score: number | null
          reps: number | null
          rpe: number | null
          set_number: number
          set_type: string
          time_seconds: number | null
          weight_kg: number | null
          workout_session_exercise_id: string | null
          workout_session_id: string | null
        }
        Insert: {
          client_session_id: string
          client_set_id: string
          completed?: boolean
          created_at?: string
          distance_m?: number | null
          exercise_id: string
          id?: string
          pain_location?: string | null
          pain_score?: number | null
          reps?: number | null
          rpe?: number | null
          set_number: number
          set_type?: string
          time_seconds?: number | null
          weight_kg?: number | null
          workout_session_exercise_id?: string | null
          workout_session_id?: string | null
        }
        Update: {
          client_session_id?: string
          client_set_id?: string
          completed?: boolean
          created_at?: string
          distance_m?: number | null
          exercise_id?: string
          id?: string
          pain_location?: string | null
          pain_score?: number | null
          reps?: number | null
          rpe?: number | null
          set_number?: number
          set_type?: string
          time_seconds?: number | null
          weight_kg?: number | null
          workout_session_exercise_id?: string | null
          workout_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercise_logs_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_logs_workout_session_exercise_id_fkey"
            columns: ["workout_session_exercise_id"]
            isOneToOne: false
            referencedRelation: "workout_session_exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_logs_workout_session_id_fkey"
            columns: ["workout_session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          category: string
          contraindicated_for: string[] | null
          created_at: string
          created_by: string | null
          description: string | null
          equipment_required: string[] | null
          id: string
          instructions: string | null
          is_global: boolean
          metadata: Json | null
          muscle_groups: string[] | null
          name: string
          updated_at: string
          video_link: string | null
        }
        Insert: {
          category: string
          contraindicated_for?: string[] | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          equipment_required?: string[] | null
          id?: string
          instructions?: string | null
          is_global?: boolean
          metadata?: Json | null
          muscle_groups?: string[] | null
          name: string
          updated_at?: string
          video_link?: string | null
        }
        Update: {
          category?: string
          contraindicated_for?: string[] | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          equipment_required?: string[] | null
          id?: string
          instructions?: string | null
          is_global?: boolean
          metadata?: Json | null
          muscle_groups?: string[] | null
          name?: string
          updated_at?: string
          video_link?: string | null
        }
        Relationships: []
      }
      form_interactions: {
        Row: {
          answer: string | null
          created_at: string
          exercise_id: string | null
          id: string
          question: string
          source: string
          tags: string[] | null
          user_id: string
          workout_session_id: string | null
        }
        Insert: {
          answer?: string | null
          created_at?: string
          exercise_id?: string | null
          id?: string
          question: string
          source?: string
          tags?: string[] | null
          user_id: string
          workout_session_id?: string | null
        }
        Update: {
          answer?: string | null
          created_at?: string
          exercise_id?: string | null
          id?: string
          question?: string
          source?: string
          tags?: string[] | null
          user_id?: string
          workout_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_interactions_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_interactions_workout_session_id_fkey"
            columns: ["workout_session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      injury_registry: {
        Row: {
          contraindicated_movements: string[] | null
          created_at: string
          date_onset: string | null
          id: string
          impact_notes: string | null
          location: string
          name: string
          severity: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          contraindicated_movements?: string[] | null
          created_at?: string
          date_onset?: string | null
          id?: string
          impact_notes?: string | null
          location: string
          name: string
          severity: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          contraindicated_movements?: string[] | null
          created_at?: string
          date_onset?: string | null
          id?: string
          impact_notes?: string | null
          location?: string
          name?: string
          severity?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string
          embedding: string | null
          entry_date: string
          id: number
          metadata: Json | null
          mood: string | null
          tags: string[] | null
          title: string | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          embedding?: string | null
          entry_date: string
          id?: never
          metadata?: Json | null
          mood?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          embedding?: string | null
          entry_date?: string
          id?: never
          metadata?: Json | null
          mood?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      plan_changelog: {
        Row: {
          ai_model: string | null
          change_description: string
          created_at: string
          id: string
          plan_id: string
          plan_session_id: string | null
          reasoning: string | null
          user_id: string
        }
        Insert: {
          ai_model?: string | null
          change_description: string
          created_at?: string
          id?: string
          plan_id: string
          plan_session_id?: string | null
          reasoning?: string | null
          user_id: string
        }
        Update: {
          ai_model?: string | null
          change_description?: string
          created_at?: string
          id?: string
          plan_id?: string
          plan_session_id?: string | null
          reasoning?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_changelog_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "training_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_changelog_plan_session_id_fkey"
            columns: ["plan_session_id"]
            isOneToOne: false
            referencedRelation: "training_plan_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_ai_analysis: {
        Row: {
          created_at: string
          id: string
          notes: string
          updated_at: string
          user_id: string
          workout_session_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes: string
          updated_at?: string
          user_id: string
          workout_session_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string
          updated_at?: string
          user_id?: string
          workout_session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_ai_analysis_workout_session_id_fkey"
            columns: ["workout_session_id"]
            isOneToOne: true
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_exercises: {
        Row: {
          created_at: string
          exercise_id: string
          form_notes: string | null
          id: string
          order_index: number
          plan_session_id: string
          rest_seconds: number | null
          superset_group: string | null
          target_distance_m: number | null
          target_reps: string | null
          target_sets: number | null
          target_time_seconds: number | null
          target_weight: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          exercise_id: string
          form_notes?: string | null
          id?: string
          order_index?: number
          plan_session_id: string
          rest_seconds?: number | null
          superset_group?: string | null
          target_distance_m?: number | null
          target_reps?: string | null
          target_sets?: number | null
          target_time_seconds?: number | null
          target_weight?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          exercise_id?: string
          form_notes?: string | null
          id?: string
          order_index?: number
          plan_session_id?: string
          rest_seconds?: number | null
          superset_group?: string | null
          target_distance_m?: number | null
          target_reps?: string | null
          target_sets?: number | null
          target_time_seconds?: number | null
          target_weight?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_exercises_plan_session_id_fkey"
            columns: ["plan_session_id"]
            isOneToOne: false
            referencedRelation: "training_plan_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      telegram_users: {
        Row: {
          chat_id: number
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          chat_id: number
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          chat_id?: number
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      training_plan_sessions: {
        Row: {
          created_at: string
          date: string
          equipment_context: string | null
          focus_brief: string | null
          id: string
          label: string | null
          plan_id: string
          session_type: string | null
          status: string
          updated_at: string
          user_id: string
          warmup_notes: string | null
          workout_id: string | null
        }
        Insert: {
          created_at?: string
          date: string
          equipment_context?: string | null
          focus_brief?: string | null
          id?: string
          label?: string | null
          plan_id: string
          session_type?: string | null
          status?: string
          updated_at?: string
          user_id: string
          warmup_notes?: string | null
          workout_id?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          equipment_context?: string | null
          focus_brief?: string | null
          id?: string
          label?: string | null
          plan_id?: string
          session_type?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          warmup_notes?: string | null
          workout_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_plan_sessions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "training_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_plan_sessions_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      training_plans: {
        Row: {
          ai_reasoning: string | null
          created_at: string
          end_date: string
          equipment_default: string | null
          goals: string | null
          id: string
          name: string
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_reasoning?: string | null
          created_at?: string
          end_date: string
          equipment_default?: string | null
          goals?: string | null
          id?: string
          name: string
          start_date: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_reasoning?: string | null
          created_at?: string
          end_date?: string
          equipment_default?: string | null
          goals?: string | null
          id?: string
          name?: string
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avg_steps_per_day: number | null
          body_fat_pct: number | null
          date_of_birth: string | null
          display_name: string | null
          height_cm: number | null
          sex: string | null
          skeletal_muscle_mass_kg: number | null
          training_phase: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avg_steps_per_day?: number | null
          body_fat_pct?: number | null
          date_of_birth?: string | null
          display_name?: string | null
          height_cm?: number | null
          sex?: string | null
          skeletal_muscle_mass_kg?: number | null
          training_phase?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avg_steps_per_day?: number | null
          body_fat_pct?: number | null
          date_of_birth?: string | null
          display_name?: string | null
          height_cm?: number | null
          sex?: string | null
          skeletal_muscle_mass_kg?: number | null
          training_phase?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      voice_notes: {
        Row: {
          audio_url: string | null
          created_at: string
          id: string
          mime_type: string | null
          processed: boolean
          source: string
          storage_path: string | null
          summary: string | null
          transcription: string | null
          user_id: string
          workout_session_id: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          id?: string
          mime_type?: string | null
          processed?: boolean
          source?: string
          storage_path?: string | null
          summary?: string | null
          transcription?: string | null
          user_id: string
          workout_session_id?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          id?: string
          mime_type?: string | null
          processed?: boolean
          source?: string
          storage_path?: string | null
          summary?: string | null
          transcription?: string | null
          user_id?: string
          workout_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "voice_notes_workout_session_id_fkey"
            columns: ["workout_session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_exercises: {
        Row: {
          created_at: string
          exercise_id: string
          form_notes: string | null
          id: string
          order_index: number
          rest_seconds: number
          superset_group: string | null
          target_distance_m: number | null
          target_reps: string | null
          target_sets: number | null
          target_time_seconds: number | null
          target_weight: number | null
          updated_at: string
          workout_id: string
        }
        Insert: {
          created_at?: string
          exercise_id: string
          form_notes?: string | null
          id?: string
          order_index?: number
          rest_seconds?: number
          superset_group?: string | null
          target_distance_m?: number | null
          target_reps?: string | null
          target_sets?: number | null
          target_time_seconds?: number | null
          target_weight?: number | null
          updated_at?: string
          workout_id: string
        }
        Update: {
          created_at?: string
          exercise_id?: string
          form_notes?: string | null
          id?: string
          order_index?: number
          rest_seconds?: number
          superset_group?: string | null
          target_distance_m?: number | null
          target_reps?: string | null
          target_sets?: number | null
          target_time_seconds?: number | null
          target_weight?: number | null
          updated_at?: string
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_session_exercises: {
        Row: {
          added_mid_session: boolean
          created_at: string
          exercise_id: string
          form_notes: string | null
          id: string
          order_index: number
          rest_seconds: number
          source_workout_exercise_id: string | null
          status: string
          superset_group: string | null
          target_distance_m: number | null
          target_reps: string | null
          target_sets: number | null
          target_time_seconds: number | null
          target_weight: number | null
          updated_at: string
          workout_session_id: string
        }
        Insert: {
          added_mid_session?: boolean
          created_at?: string
          exercise_id: string
          form_notes?: string | null
          id?: string
          order_index?: number
          rest_seconds?: number
          source_workout_exercise_id?: string | null
          status?: string
          superset_group?: string | null
          target_distance_m?: number | null
          target_reps?: string | null
          target_sets?: number | null
          target_time_seconds?: number | null
          target_weight?: number | null
          updated_at?: string
          workout_session_id: string
        }
        Update: {
          added_mid_session?: boolean
          created_at?: string
          exercise_id?: string
          form_notes?: string | null
          id?: string
          order_index?: number
          rest_seconds?: number
          source_workout_exercise_id?: string | null
          status?: string
          superset_group?: string | null
          target_distance_m?: number | null
          target_reps?: string | null
          target_sets?: number | null
          target_time_seconds?: number | null
          target_weight?: number | null
          updated_at?: string
          workout_session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_session_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_session_exercises_source_workout_exercise_id_fkey"
            columns: ["source_workout_exercise_id"]
            isOneToOne: false
            referencedRelation: "workout_exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_session_exercises_workout_session_id_fkey"
            columns: ["workout_session_id"]
            isOneToOne: false
            referencedRelation: "workout_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_sessions: {
        Row: {
          client_session_id: string
          created_at: string
          end_time: string | null
          equipment_context: string | null
          id: string
          plan_session_id: string | null
          readiness_energy: number | null
          readiness_pain_notes: string | null
          readiness_sleep: number | null
          session_type: string | null
          start_time: string
          status: string
          updated_at: string
          user_id: string
          workout_id: string | null
        }
        Insert: {
          client_session_id: string
          created_at?: string
          end_time?: string | null
          equipment_context?: string | null
          id?: string
          plan_session_id?: string | null
          readiness_energy?: number | null
          readiness_pain_notes?: string | null
          readiness_sleep?: number | null
          session_type?: string | null
          start_time?: string
          status?: string
          updated_at?: string
          user_id: string
          workout_id?: string | null
        }
        Update: {
          client_session_id?: string
          created_at?: string
          end_time?: string | null
          equipment_context?: string | null
          id?: string
          plan_session_id?: string | null
          readiness_energy?: number | null
          readiness_pain_notes?: string | null
          readiness_sleep?: number | null
          session_type?: string | null
          start_time?: string
          status?: string
          updated_at?: string
          user_id?: string
          workout_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workout_sessions_plan_session_id_fkey"
            columns: ["plan_session_id"]
            isOneToOne: false
            referencedRelation: "training_plan_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_sessions_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workouts: {
        Row: {
          created_at: string
          description: string | null
          equipment_context: string | null
          id: string
          name: string
          plan_id: string | null
          session_type: string | null
          updated_at: string
          user_id: string
          warmup_notes: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          equipment_context?: string | null
          id?: string
          name: string
          plan_id?: string | null
          session_type?: string | null
          updated_at?: string
          user_id: string
          warmup_notes?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          equipment_context?: string | null
          id?: string
          name?: string
          plan_id?: string | null
          session_type?: string | null
          updated_at?: string
          user_id?: string
          warmup_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workouts_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "training_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_adapt_job: {
        Args: never
        Returns: {
          attempts: number
          claimed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          max_attempts: number
          status: string
          trigger: string
          updated_at: string
          user_id: string
          workout_session_id: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "adapt_jobs"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      complete_adapt_job: {
        Args: { p_error_message?: string; p_job_id: string; p_status: string }
        Returns: undefined
      }
      create_plan_with_deactivation: {
        Args: {
          p_ai_reasoning?: string
          p_end_date: string
          p_equipment_default?: string
          p_goals?: string
          p_name: string
          p_start_date: string
          p_user_id: string
        }
        Returns: string
      }
      get_previous_performance: {
        Args: { p_exercise_id: string; p_user_id: string }
        Returns: {
          reps: number
          rpe: number
          set_number: number
          set_type: string
          weight_kg: number
        }[]
      }
      match_documents: {
        Args: {
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          content: string
          file_path: string
          id: number
          metadata: Json
          similarity: number
          title: string
        }[]
      }
      match_journal_entries: {
        Args: {
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          content: string
          entry_date: string
          id: number
          metadata: Json
          mood: string
          similarity: number
          tags: string[]
          title: string
        }[]
      }
      match_knowledge: {
        Args: {
          match_count?: number
          match_threshold?: number
          p_user_id: string
          query_embedding: string
        }
        Returns: {
          category: string
          content: string
          id: string
          similarity: number
          source: string
        }[]
      }
      reactivate_plan: {
        Args: { p_plan_id: string; p_user_id: string }
        Returns: undefined
      }
      reconcile_session: {
        Args: { p_client_session_id: string }
        Returns: string
      }
      save_plan_changelog: {
        Args: {
          p_description: string
          p_model: string
          p_plan_id: string
          p_reasoning: string
          p_session_id: string
        }
        Returns: undefined
      }
      save_session_analysis: {
        Args: { p_notes: string; p_workout_session_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

