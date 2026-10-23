import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Upload a File/Blob (e.g. resume) to Cloudinary as a raw asset.
 * @returns {{ url: string, publicId: string, format: string | undefined }}
 */
export async function uploadRawFile(file, folder = "triwinz/resumes") {
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const dataUri = `data:${file.type || "application/octet-stream"};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "raw",
    public_id: `${Date.now()}-${file.name?.replace(/\s+/g, "-") || "file"}`,
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    format: result.format,
  };
}

/**
 * Delete a raw asset (e.g. resume) from Cloudinary.
 */
export async function deleteRawFile(publicId) {
  if (!publicId) return null;

  return cloudinary.uploader.destroy(publicId, {
    resource_type: "raw",
    invalidate: true,
  });
}
