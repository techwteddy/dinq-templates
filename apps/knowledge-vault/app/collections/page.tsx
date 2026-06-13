"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Sparkles,
  FileText,
  Link as LinkIcon,
  Lightbulb,
  Calendar,
  Trash2,
  X,
  Star,
  MoreHorizontal,
  Edit2,
  ExternalLink,
  Copy,
  ArrowUpDown,
  Check,
  Tag,
  Save,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { KnowledgeItem } from "../types";

const CardSkeleton = () => (
  <div className="rounded-2xl p-6 bg-[#141414] border border-[#262626] animate-pulse h-64 flex flex-col justify-between">
    <div className="space-y-4">
      <div className="flex justify-between">
        <div className="w-8 h-8 bg-[#262626] rounded-lg" />
        <div className="w-16 h-6 bg-[#262626] rounded-full" />
      </div>
      <div className="h-6 bg-[#262626] rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-[#262626] rounded w-full" />
        <div className="h-4 bg-[#262626] rounded w-5/6" />
        <div className="h-4 bg-[#262626] rounded w-4/6" />
      </div>
    </div>
    <div className="h-4 bg-[#262626] rounded w-1/4 mt-4" />
  </div>
);

export default function Collections() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "az" | "za">(
    "newest",
  );
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<KnowledgeItem>>({});
  const [user, setUser] = useState<any>(null);

  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          setUser(null);
        } else {
          setUser(session.user);
        }
      } catch (err) {
        console.error("Error checking auth:", err);
        setUser(null);
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      if (e.key === "Escape") {
        setSelectedItem(null);
        setIsEditing(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setLoading(false);
        return;
      }

      const res = await fetch("/api/knowledge", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch knowledge items");
      }

      const data = await res.json();
      setItems(data || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let localResult = items.filter((item) => {
      if (filterType !== "all" && item.type !== filterType) return false;
      if (activeTag && !item.tags?.includes(activeTag)) return false;
      return true;
    });

    const applyStandardSort = (list: KnowledgeItem[]) => {
      return [...list].sort((a, b) => {
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;

        switch (sortOrder) {
          case "newest":
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          case "oldest":
            return (
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
            );
          case "az":
            return a.title.localeCompare(b.title);
          case "za":
            return b.title.localeCompare(a.title);
          default:
            return 0;
        }
      });
    };

    const performSearch = async () => {
      if (!search.trim()) {
        setFilteredItems(applyStandardSort(localResult));
        return;
      }

      setIsSearching(true);
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: search, items: localResult }),
        });

        if (!res.ok) throw new Error("Search failed");

        const rankedItems = await res.json();

        setFilteredItems(rankedItems);
      } catch (error) {
        console.error(
          "Semantic search failed, falling back to keyword:",
          error,
        );

        const q = search.toLowerCase();
        const fallbackResult = localResult.filter(
          (item) =>
            item.title.toLowerCase().includes(q) ||
            item.content.toLowerCase().includes(q) ||
            item.tags?.some((tag) => tag.toLowerCase().includes(q)),
        );
        setFilteredItems(applyStandardSort(fallbackResult));
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 500);
    return () => clearTimeout(timeoutId);
  }, [search, filterType, items, sortOrder, activeTag]);

  const handlePin = async (e: React.MouseEvent, item: KnowledgeItem) => {
    e.stopPropagation();

    const previousItems = items;

    const updatedItems = items.map((i) =>
      i.id === item.id ? { ...i, is_pinned: !i.is_pinned } : i,
    );
    setItems(updatedItems);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch(`/api/knowledge/${item.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_pinned: !item.is_pinned }),
      });

      if (!res.ok) {
        throw new Error("Failed to pin item");
      }
    } catch (err) {
      console.error("Failed to pin", err);

      setItems(previousItems);
      alert("Could not update pin. Please try again.");
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm("Delete this memory forever?")) return;

    const previousItems = items;
    setItems(items.filter((i) => i.id !== id));

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch(`/api/knowledge/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }
    } catch (err) {
      console.error("Delete failed:", err);

      setItems(previousItems);
      alert("Could not delete item. Please try again.");
    }
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error("Not authenticated");
      }

      const res = await fetch(`/api/knowledge/${selectedItem.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error("Update failed");

      const updatedItem = await res.json();

      const finalItem = updatedItem.id
        ? updatedItem
        : { ...selectedItem, ...editForm };

      setItems(items.map((i) => (i.id === selectedItem.id ? finalItem : i)));
      setSelectedItem(finalItem);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update item:", error);
      alert("Failed to update item");
    }
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "link":
        return <LinkIcon className="w-4 h-4 text-[#E5C07B]" />;
      case "insight":
        return <Lightbulb className="w-4 h-4 text-[#E5C07B]" />;
      default:
        return <FileText className="w-4 h-4 text-[#E5C07B]" />;
    }
  };

  if (user === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0B0B] text-center px-4">
        <Sparkles className="w-16 h-16 text-[#E5C07B] mb-6" />
        <h1 className="text-3xl text-[#F5F5F5] font-bold mb-2">
          Login or Signup to view your collections
        </h1>
        <p className="text-[#A1A1AA] mb-6">
          You need an account to access your personal knowledge collections.
        </p>
        <button
          onClick={() => router.push("/auth")}
          className="bg-[#E5C07B] text-black px-6 py-3 rounded-xl font-semibold hover:bg-[#C9B26A] transition-all"
        >
          Go to Login / Signup
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] pb-32 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-[#F5F5F5] mb-2 flex items-center gap-3">
              Your Collections{" "}
              <span className="text-sm font-normal text-[#52525B] bg-[#1A1A1A] px-3 py-1 rounded-full">
                {filteredItems.length}
              </span>
            </h1>
            <p className="text-[#A1A1AA]">
              Explore and manage your knowledge base.{" "}
              {activeTag && (
                <span className="text-[#E5C07B]">Filtered by #{activeTag}</span>
              )}
            </p>
          </div>

          <button
            onClick={() => router.push("/add")}
            className="bg-[#E5C07B] text-black px-6 py-3 rounded-xl font-semibold hover:bg-[#C9B26A] transition-all flex items-center gap-2 shadow-lg shadow-[#E5C07B]/10"
          >
            <Sparkles className="w-4 h-4" /> New Item
          </button>
        </motion.div>

        {/* Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-10">
          {/* Smart Semantic Search */}
          <div className="md:col-span-6 relative">
            {isSearching ? (
              <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E5C07B] animate-spin" />
            ) : (
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#E5C07B]" />
            )}
            <input
              ref={searchInputRef}
              suppressHydrationWarning
              className="w-full pl-12 pr-4 py-3.5 bg-[#141414] border border-[#262626] rounded-xl text-[#F5F5F5] placeholder-[#52525B] focus:ring-2 focus:ring-[#E5C07B] outline-none transition-all group-hover:border-[#52525B]"
              placeholder="Ask your brain (e.g. 'How do I center a div?')..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <div className="md:col-span-3 relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
            <select
              suppressHydrationWarning
              className="w-full pl-10 pr-8 py-3.5 bg-[#141414] border border-[#262626] rounded-xl text-[#F5F5F5] appearance-none cursor-pointer hover:border-[#52525B] focus:ring-2 focus:ring-[#E5C07B] outline-none transition-all"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="note">Notes</option>
              <option value="link">Links</option>
              <option value="insight">Insights</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <ArrowUpDown className="w-3 h-3 text-[#52525B]" />
            </div>
          </div>

          {/* Sort */}
          <div className="md:col-span-3 relative">
            <select
              suppressHydrationWarning
              className="w-full px-4 py-3.5 bg-[#141414] border border-[#262626] rounded-xl text-[#F5F5F5] appearance-none cursor-pointer hover:border-[#52525B] focus:ring-2 focus:ring-[#E5C07B] outline-none transition-all"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="az">A-Z</option>
              <option value="za">Z-A</option>
            </select>
          </div>
        </div>

        {/* Active Tag Clear Button */}
        {activeTag && (
          <div className="mb-6 flex items-center gap-2">
            <button
              onClick={() => setActiveTag(null)}
              className="text-xs flex items-center gap-1 bg-[#E5C07B]/10 text-[#E5C07B] px-3 py-1.5 rounded-full border border-[#E5C07B]/20 hover:bg-[#E5C07B]/20 transition-all"
            >
              <X className="w-3 h-3" /> Clear Tag: #{activeTag}
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-[#141414]/50 border border-[#262626] border-dashed rounded-3xl"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#1A1A1A] rounded-full mb-6">
              <Sparkles className="w-10 h-10 text-[#52525B]" />
            </div>
            <h3 className="text-[#F5F5F5] text-xl font-semibold mb-2">
              No items found
            </h3>
            <p className="text-[#71717A] max-w-sm mx-auto mb-8">
              {search
                ? `No results for "${search}"`
                : "Your brain is empty. Capture your first thought!"}
            </p>
            {!search && (
              <button
                onClick={() => router.push("/add")}
                className="text-[#E5C07B] hover:underline"
              >
                Create a new entry &rarr;
              </button>
            )}
          </motion.div>
        )}

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedItem(item)} // OPEN MODAL
                className={`group relative rounded-2xl p-6 bg-[#141414] border transition-all cursor-pointer overflow-hidden ${
                  item.is_pinned
                    ? "border-[#E5C07B]/50 bg-[#E5C07B]/5"
                    : "border-[#262626] hover:border-[#E5C07B]/40"
                }`}
              >
                {/* Hover Actions Overlay */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={(e) => handlePin(e, item)}
                    className={`p-2 rounded-lg backdrop-blur-md border border-[#262626] hover:bg-[#E5C07B] hover:text-black transition-all ${item.is_pinned ? "text-[#E5C07B] bg-[#1A1A1A]" : "text-[#71717A] bg-[#141414]/80"}`}
                    title={item.is_pinned ? "Unpin" : "Pin to top"}
                  >
                    <Star
                      className={`w-4 h-4 ${item.is_pinned ? "fill-current" : ""}`}
                    />
                  </button>
                  {item.type === "link" && item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 text-[#71717A] bg-[#141414]/80 backdrop-blur-md border border-[#262626] rounded-lg hover:bg-[#E5C07B] hover:text-black transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* Content */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3 overflow-hidden flex-1">
                    <div
                      className={`p-2 rounded-lg ${item.is_pinned ? "bg-[#E5C07B] text-black" : "bg-[#262626] text-[#E5C07B]"}`}
                    >
                      {getTypeIcon(item.type)}
                    </div>
                    <h3 className="font-semibold text-lg text-[#F5F5F5] truncate pr-8">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {item.summary && (
                  <div className="mb-4 text-xs text-[#A1A1AA] bg-[#1A1A1A] border-l-2 border-[#52525B] p-3 rounded-r-lg line-clamp-2 italic">
                    {item.summary}
                  </div>
                )}

                <p className="text-sm text-[#A1A1AA] line-clamp-3 mb-6 h-[4.5em]">
                  {item.content}
                </p>

                <div className="flex justify-between items-center pt-4 border-t border-[#262626]/50">
                  <div className="flex gap-2 overflow-hidden">
                    {item.tags?.slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTag(tag === activeTag ? null : tag);
                        }}
                        className={`text-[10px] px-2 py-1 rounded-md border cursor-pointer transition-colors ${
                          activeTag === tag
                            ? "bg-[#E5C07B] text-black border-[#E5C07B]"
                            : "text-[#71717A] bg-[#1A1A1A] border-[#262626] hover:border-[#E5C07B] hover:text-[#E5C07B]"
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                    {item.tags && item.tags.length > 2 && (
                      <span className="text-[10px] text-[#52525B] py-1">
                        +{item.tags.length - 2}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#52525B]">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              setSelectedItem(null);
              setIsEditing(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#141414] border border-[#262626] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#262626] sticky top-0 bg-[#141414] z-10">
                <div className="flex items-center gap-3">
                  {!isEditing ? (
                    <h2 className="text-xl font-bold text-[#F5F5F5]">
                      {selectedItem.title}
                    </h2>
                  ) : (
                    <input
                      className="bg-[#0B0B0B] border border-[#262626] text-[#F5F5F5] px-3 py-1 rounded-lg text-lg font-bold w-full focus:border-[#E5C07B] outline-none"
                      defaultValue={selectedItem.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                    />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setEditForm({});
                        }}
                        className="p-2 text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#262626] rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(selectedItem.content)}
                        className="p-2 text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-[#262626] rounded-lg transition-all"
                        title="Copy"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          handleDelete(e, selectedItem.id);
                          setSelectedItem(null);
                        }}
                        className="p-2 text-[#A1A1AA] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleUpdate}
                      className="flex items-center gap-2 bg-[#E5C07B] text-black px-4 py-1.5 rounded-lg font-bold text-sm hover:bg-[#C9B26A]"
                    >
                      <Save className="w-4 h-4" /> Save
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedItem(null);
                      setIsEditing(false);
                    }}
                    className="p-2 text-[#A1A1AA] hover:text-[#F5F5F5] rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-6">
                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-sm text-[#71717A]">
                  <div className="flex items-center gap-1.5 bg-[#1A1A1A] px-3 py-1 rounded-md">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(selectedItem.created_at).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#1A1A1A] px-3 py-1 rounded-md uppercase tracking-wider">
                    {getTypeIcon(selectedItem.type)} {selectedItem.type}
                  </div>
                  {selectedItem.sourceUrl && (
                    <a
                      href={selectedItem.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-[#E5C07B] hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Source
                    </a>
                  )}
                </div>

                {/* Main Content */}
                {!isEditing ? (
                  <div className="prose prose-invert max-w-none">
                    <p className="text-[#A1A1AA] leading-loose whitespace-pre-wrap text-lg">
                      {selectedItem.content}
                    </p>
                  </div>
                ) : (
                  <textarea
                    className="w-full h-64 bg-[#0B0B0B] border border-[#262626] rounded-xl p-4 text-[#F5F5F5] focus:border-[#E5C07B] outline-none leading-relaxed"
                    defaultValue={selectedItem.content}
                    onChange={(e) =>
                      setEditForm({ ...editForm, content: e.target.value })
                    }
                  />
                )}

                {/* Tags */}
                <div className="pt-6 border-t border-[#262626]">
                  <h4 className="text-sm font-semibold text-[#52525B] mb-3 flex items-center gap-2">
                    <Tag className="w-3 h-3" /> TAGS
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.tags?.map((tag, i) => (
                      <span
                        key={i}
                        className="text-sm text-[#E5C07B] bg-[#E5C07B]/5 border border-[#E5C07B]/20 px-3 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
