import { createClient } from "@/lib/supabase/server";

export async function uploadDriverDocument(
  file: File,
  driverId: string,
  type: "license" | "photo"
): Promise<string> {
  const supabase = await createClient();
  
  const fileExt = file.name.split(".").pop();
  const fileName = `${driverId}_${type}_${Date.now()}.${fileExt}`;
  const filePath = `drivers/${fileName}`;

  const { data, error } = await supabase.storage
    .from("driver-documents")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload ${type}: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from("driver-documents")
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

export async function deleteDriverDocument(url: string): Promise<void> {
  const supabase = await createClient();
  
  const path = url.split("/driver-documents/")[1];
  if (!path) return;

  await supabase.storage.from("driver-documents").remove([path]);
}




