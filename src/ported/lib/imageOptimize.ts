// Client-side image optimization: resize + WebP encode before upload
export interface OptimizedImage {
  blob: Blob;
  width: number;
  height: number;
  size: number;
  mime: string;
}

export async function optimizeImage(
  file: File,
  opts: { maxWidth?: number; quality?: number } = {},
): Promise<OptimizedImage> {
  const { maxWidth = 1920, quality = 0.82 } = opts;

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas =
    typeof OffscreenCanvas !== "undefined"
      ? new OffscreenCanvas(w, h)
      : Object.assign(document.createElement("canvas"), { width: w, height: h });
  const ctx = (canvas as any).getContext("2d");
  ctx.drawImage(bitmap, 0, 0, w, h);

  let blob: Blob;
  if (canvas instanceof OffscreenCanvas) {
    blob = await canvas.convertToBlob({ type: "image/webp", quality });
  } else {
    blob = await new Promise<Blob>((resolve, reject) => {
      (canvas as HTMLCanvasElement).toBlob(
        (b) => (b ? resolve(b) : reject(new Error("encode failed"))),
        "image/webp",
        quality,
      );
    });
  }

  return { blob, width: w, height: h, size: blob.size, mime: "image/webp" };
}
