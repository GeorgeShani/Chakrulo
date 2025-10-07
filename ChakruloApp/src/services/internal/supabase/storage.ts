import { createClient } from "@supabase/supabase-js";

// Create a server-side Supabase client with service role
// This should be used ONLY in API routes, never on the client side
const getServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
  cacheControl: string = "3600"
): Promise<string | null> {
  try {
    console.log("Starting upload:", {
      bucket,
      path,
      fileType: file.type,
      fileSize: file.size,
    });

    // Get server-side Supabase client
    const supabase = getServerSupabaseClient();

    // Convert File to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Remove existing file if it exists (ignore errors if file doesn't exist)
    const { error: removeError } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (removeError) {
      console.log("Remove attempt (file may not exist):", removeError.message);
    }

    // Upload the new file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        cacheControl,
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Upload error details:", {
        message: error.message,
        name: error.name,
      });
      return null;
    }

    if (!data) {
      console.error("No data returned from upload");
      return null;
    }

    console.log("Upload successful, path:", data.path);

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    console.log("Public URL generated:", publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (err) {
    console.error("Exception during file upload:", err);
    if (err instanceof Error) {
      console.error("Error details:", err.message, err.stack);
    }
    return null;
  }
}
