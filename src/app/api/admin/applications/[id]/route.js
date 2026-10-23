import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { requireModule } from "../../../../../lib/requireAdmin";
import { deleteRawFile } from "../../../../../lib/cloudinary";
import { sendApplicationRejectedEmail } from "../../../../../lib/sendApplicationEmails";

export async function PATCH(req, { params }) {
  const { error } = await requireModule("applications");
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const allowed = ["new", "shortlisted", "on_hold", "rejected", "selected"];
  const data = {};

  if (body.status !== undefined) {
    if (!allowed.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    data.status = body.status;
  }

  if (body.referralSource !== undefined) {
    const value = String(body.referralSource || "").trim();
    data.referralSource = value || null;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  try {
    const existing = await prisma.jobApplication.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const application = await prisma.jobApplication.update({
      where: { id },
      data,
    });

    const becameRejected =
      data.status === "rejected" &&
      existing.status !== "rejected" &&
      existing.status !== "archived";

    if (becameRejected) {
      await sendApplicationRejectedEmail({
        fullName: application.fullName,
        email: application.email,
        jobTitle: application.jobTitle,
      });
    }

    return NextResponse.json(application);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(_req, { params }) {
  const { error } = await requireModule("applications");
  if (error) return error;

  const { id } = await params;

  try {
    const application = await prisma.jobApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (application.resumePublicId) {
      try {
        await deleteRawFile(application.resumePublicId);
      } catch (cloudError) {
        console.error("Cloudinary resume delete failed:", cloudError);
        return NextResponse.json(
          { error: "Failed to delete resume from Cloudinary" },
          { status: 500 },
        );
      }
    }

    await prisma.jobApplication.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
