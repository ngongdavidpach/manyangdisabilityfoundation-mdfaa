import { supabase } from "@/integrations/supabase/client";
import { optimizeImage } from "./imageOptimize";

export const BUCKET = "site-images";

/** Returns long-lived signed URL (1 year) — bucket is private. */
export async function signedUrlFor(path: string, expiresIn = 60 * 60 * 24 * 365): Promise<string> {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, expiresIn);
  if (error || !data) throw error ?? new Error("sign failed");
  return data.signedUrl;
}

export async function uploadImage(file: File, folder = "uploads", alt = "", tags: string[] = []) {
  const optimized = await optimizeImage(file);
  const ext = "webp";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, optimized.blob, { contentType: optimized.mime, cacheControl: "31536000" });
  if (upErr) throw upErr;
  const url = await signedUrlFor(path);
  const { data: row, error: dbErr } = await supabase
    .from("media_assets")
    .insert({
      storage_path: path,
      url,
      alt,
      width: optimized.width,
      height: optimized.height,
      size_bytes: optimized.size,
      mime_type: optimized.mime,
      tags,
    })
    .select()
    .single();
  if (dbErr) throw dbErr;
  return row;
}

export async function uploadRawFile(file: File, folder = "docs") {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type });
  if (error) throw error;
  return { path, url: await signedUrlFor(path), name: file.name, ext };
}
