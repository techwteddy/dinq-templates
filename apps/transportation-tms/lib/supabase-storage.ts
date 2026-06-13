import { createClient } from "@/lib/supabase/server";

const BUCKET_NAME = "approval-letters";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File size must be less than 5MB" };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "File type not allowed. Allowed types: PDF, DOC, DOCX, JPG, PNG",
    };
  }

  return { valid: true };
}

export async function uploadApprovalLetter(
  file: File,
  reservationId: string
): Promise<string> {
  const supabase = await createClient();

  // Sanitize filename
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filePath = `${reservationId}/${timestamp}-${sanitizedName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

  return publicUrl;
}

export async function deleteApprovalLetter(url: string): Promise<void> {
  const supabase = await createClient();

  // Extract path from URL
  const urlObj = new URL(url);
  const pathParts = urlObj.pathname.split("/");
  const bucketIndex = pathParts.indexOf(BUCKET_NAME);
  if (bucketIndex === -1) {
    throw new Error("Invalid file URL");
  }
  const filePath = pathParts.slice(bucketIndex + 1).join("/");

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

export function getApprovalLetterUrl(path: string): string {
  // This would be used if we need to construct URLs from paths
  // For now, we're using public URLs directly
  return path;
}






