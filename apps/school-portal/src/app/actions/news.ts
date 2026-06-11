"use server"
import { createServerClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import translate from "translate"

translate.engine = "google";


export async function addNews(formData: FormData) {
  const supabase = await createServerClient();
  const originalTitle = formData.get("title") as string
  const originalContent = formData.get("content") as string
  const sourceLang = formData.get("language") as string // The lang used in the form

  const targetLangs = ["en", "th", "zh"];
  
  try {
    // 1. Prepare an array of all versions
    const newsEntries = await Promise.all(
      targetLangs.map(async (target) => {
        // If the target is the same as the source, don't translate
        if (target === sourceLang) {
          return { title: originalTitle, content: originalContent, language: target };
        }

        // 2. Translate Title and Content
        const translatedTitle = await translate(originalTitle, { from: sourceLang, to: target });
        const translatedContent = await translate(originalContent, { from: sourceLang, to: target });

        return {
          title: translatedTitle,
          content: translatedContent,
          language: target
        };
      })
    );

    // 3. Save all 3 versions to Supabase at once
    const { error } = await supabase.from("news").insert(newsEntries);

    if (error) throw error;

    revalidatePath("/[lang]/news", "page");
  } catch (error) {
    console.error("Translation failed:", error);
    throw new Error("Failed to post news");
  }
}

export async function deleteNews(id: string) {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("news")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/[lang]/news", "page");
}

export async function updateNews(id: string, formData: FormData) {
  const supabase = await createServerClient();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  const { error } = await supabase
    .from("news")
    .update({ title, content })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/[lang]/news", "page");
}