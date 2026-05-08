import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id")!;
    const { base64, folder = "alumniverse/uploads" } = await req.json();

    if (!base64) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    // 5MB limit check (base64 is ~33% larger than binary)
    if (base64.length > 7 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 5MB." }, { status: 413 });
    }

    const { url, publicId } = await uploadImage(base64, `${folder}/${userId}`);
    return NextResponse.json({ url, publicId });
  } catch (err: any) {
    console.error("[upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
