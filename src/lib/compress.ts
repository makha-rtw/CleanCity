export interface CompressedImage {
  dataUrl: string;
  originalKb: number;
  compressedKb: number;
}

/**
 * Réduit une photo avant envoi (côté max 1280 px, JPEG 70 %).
 * Une photo de téléphone de 3 à 5 Mo descend autour de 120 à 250 Ko.
 */
export async function compressImage(
  file: File,
  maxSide = 1280,
  quality = 0.7
): Promise<CompressedImage> {
  const originalKb = Math.round(file.size / 1024);
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.round(img.naturalWidth * scale);
    const h = Math.round(img.naturalHeight * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas");
    ctx.drawImage(img, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    const base64Len = dataUrl.length - dataUrl.indexOf(",") - 1;
    const compressedKb = Math.max(1, Math.round((base64Len * 3) / 4 / 1024));
    return { dataUrl, originalKb, compressedKb };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function formatSize(kb: number): string {
  if (kb >= 1024) {
    return `${(kb / 1024).toLocaleString("fr-FR", { maximumFractionDigits: 1 })}\u00A0Mo`;
  }
  return `${kb}\u00A0Ko`;
}
