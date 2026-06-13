export interface Note {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  language: "en" | "ur";
  audio_url: string | null;
  created_at: string;
  updated_at: string;
}
