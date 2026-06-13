export interface KnowledgeItem {
  id: number;
  title: string;
  content: string;
  summary?: string | null;
  type: KnowledgeType;
  tags?: string[];
  created_at: string;
  is_pinned: boolean;
  sourceUrl?: string | null;
}

export type KnowledgeType = "note" | "link" | "insight";
