import { createSupabaseClient } from "@/lib/database/connection";

const supabase = createSupabaseClient();

export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
  cacheControl: string = "3600"
): Promise<string | null> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        cacheControl,
        upsert: true,
        contentType: file.type,
      });

    if (error || !data) {
      console.error("Upload error:", error);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error("Exception during file upload:", err);
    return null;
  }
}
