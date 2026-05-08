import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImage(
  base64: string,
  folder: string = "alumniverse"
): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(base64, {
    folder,
    resource_type: "auto",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "pdf"],
    max_bytes: 5 * 1024 * 1024, // 5MB
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export function getOptimizedUrl(url: string, w = 400, h = 400): string {
  return cloudinary.url(url, {
    width: w, height: h, crop: "fill", gravity: "face",
    quality: "auto", fetch_format: "auto",
  });
}

export default cloudinary;
