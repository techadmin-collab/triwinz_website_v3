import { uploadRawFile } from "../../../lib/cloudinary";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_BYTES = 512 * 1024; // 512KB

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return Response.json(
        { error: "File too large. Max size is 512KB." },
        { status: 400 },
      );
    }

    if (file.type && !ALLOWED_TYPES.includes(file.type)) {
      return Response.json(
        { error: "Only PDF or DOC/DOCX files are allowed." },
        { status: 400 },
      );
    }

    const folder = formData.get("folder") || "triwinz/resumes";
    const uploaded = await uploadRawFile(file, String(folder));

    return Response.json(uploaded);
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
