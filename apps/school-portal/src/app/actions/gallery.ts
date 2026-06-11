"use server"
import { createServerClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadDrawings(formData: FormData) {
  const supabase = await createServerClient();
  const files = formData.getAll("drawings") as File[];

  console.log("Processing files:", files.length);

  for (const file of files) {
    if (file.size === 0) continue;

    try {
      // 1. Convert File to ArrayBuffer for reliable upload
      const arrayBuffer = await file.arrayBuffer();
      const fileBase64 = Buffer.from(arrayBuffer);

      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      
      // 2. Upload to Storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from("student-art")
        .upload(fileName, fileBase64, {
          contentType: file.type,
          upsert: true
        });

      if (storageError) {
        console.error("❌ Storage Error:", storageError.message);
        continue;
      }

      // 3. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from("student-art")
        .getPublicUrl(fileName);

      console.log("✅ File uploaded to:", publicUrl);

      // 4. Insert into Database
      const { error: dbError } = await supabase
        .from("student_art")
        .insert([{ image_url: publicUrl }]);

      if (dbError) {
        console.error("❌ Database Insert Error:", dbError.message);
      } else {
        console.log("✅ Database record created!");
      }

    } catch (err) {
      console.error("❌ Unexpected Error during upload:", err);
    }
  }

  revalidatePath("/[lang]/gallery");
  return { success: true };
}