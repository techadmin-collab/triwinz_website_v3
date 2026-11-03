import { NextResponse } from "next/server";
import { requireModule } from "../../../../../lib/requireAdmin";
import { uploadImage } from "../../../../../lib/cloudinary";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024; // 5MB

// Upload a team member photo to Cloudinary (admin only)
export async function POST(req) {
  const { error } = await requireModule("team");
  if (error) return error;

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Please upload a JPG, PNG or WebP image." },
        { status: 400 },
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Image too large. Max size is 5MB." },
        { status: 400 },
      );
    }

    const uploaded = await uploadImage(file, "triwinz/team");
    return NextResponse.json(uploaded);
  } catch (err) {
    console.error("Team photo upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
