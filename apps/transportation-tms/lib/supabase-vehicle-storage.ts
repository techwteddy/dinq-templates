import { createClient } from "@/lib/supabase/server";

export async function uploadVehicleDocument(
  file: File,
  vehicleId: string,
  type: "or" | "cr"
): Promise<string> {
  const supabase = await createClient();
  
  const fileExt = file.name.split(".").pop();
  const fileName = `${vehicleId}_${type}_${Date.now()}.${fileExt}`;
  const filePath = `vehicles/${fileName}`;

  const { data, error } = await supabase.storage
    .from("vehicle-documents")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload ${type.toUpperCase()}: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from("vehicle-documents")
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

export async function deleteVehicleDocument(url: string): Promise<void> {
  const supabase = await createClient();
  
  const path = url.split("/vehicle-documents/")[1];
  if (!path) return;

  await supabase.storage.from("vehicle-documents").remove([path]);
}




