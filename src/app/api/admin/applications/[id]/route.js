import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { requireModule } from "../../../../../lib/requireAdmin";
import { deleteRawFile } from "../../../../../lib/cloudinary";
import { sendApplicationRejectedEmail } from "../../../../../lib/sendApplicationEmails";
import { isAdminSession } from "../../../../../lib/permissions";
import { STATUS_REASON_LIMIT, needsReason } from "../../../../../lib/applicationStatus";

const STATUS_LABELS = { on_hold: "On hold", marked_for_rejection: "Marked for rejection" };

export async function PATCH(req, { params }) {
  const { error, session } = await requireModule("applications");
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const allowed = [
    "new",
    "reviewed",
    "shortlisted",
    "on_hold",
    "marked_for_rejection",
    "rejected",
    "selected",
  ];
  const data = {};

  if (body.status !== undefined) {
    if (!allowed.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    // only admins and the super admin can reject; staff mark for rejection instead
    if (body.status === "rejected" && !isAdminSession(session)) {
      return NextResponse.json(
        {
          error: "Only admins can reject a candidate. Choose “Marked for rejection” and give a reason instead.",
          code: "REJECT_NOT_ALLOWED",
        },
        { status: 403 },
      );
    }
    data.status = body.status;
  }
  const reasonGiven = body.statusReason !== undefined;
  const reason = reasonGiven ? String(body.statusReason || "").trim().slice(0, STATUS_REASON_LIMIT) : "";

  if (body.referralSource !== undefined) {
    const value = String(body.referralSource || "").trim();
    data.referralSource = value || null;
  }

  if (Object.keys(data).length === 0 && !reasonGiven) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  try {
    const existing = await prisma.jobApplication.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // On hold / Marked for rejection need a reason
    const nextStatus = data.status ?? existing.status;
    if (needsReason(nextStatus) && (nextStatus !== existing.status || reasonGiven)) {
      if (!reason) {
        return NextResponse.json(
          { error: `Please give a reason for “${STATUS_LABELS[nextStatus]}”.` },
          { status: 400 },
        );
      }
      data.statusReason = reason;
      data.statusReasonBy = session?.user?.name || session?.user?.email || null;
      data.statusReasonAt = new Date();
    }
    if (!Object.keys(data).length) {
      return NextResponse.json(existing);
    }

    // A candidate in the interview process is rejected through the interview result,
    // not from here: only allowed when the latest level's result is "Rejected".
    if (
      data.status === "rejected" &&
      existing.status !== "rejected" &&
      existing.status !== "archived" &&
      prisma.interviewRound
    ) {
      const latest = await prisma.interviewRound.findFirst({
        where: { applicationId: id, status: { not: "cancelled" } },
        orderBy: { level: "desc" },
      });
      if (latest && latest.status !== "rejected") {
        const level = latest.title ? `Level ${latest.level} (${latest.title})` : `Level ${latest.level}`;
        const result =
          latest.status === "passed"
            ? `the result for ${level} is Passed`
            : latest.status === "on_hold"
              ? `the result for ${level} is On hold`
              : `no result has been recorded for ${level} yet`;
        return NextResponse.json(
          {
            error: `${existing.fullName} is in the interview process and ${result}. To reject this candidate, open them on the Interviews page and record the result of ${level} as Rejected.`,
            code: "INTERVIEW_RESULT_REQUIRED",
          },
          { status: 409 },
        );
      }
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
    // remove the candidate's interview levels too
    if (prisma.interviewRound) {
      await prisma.interviewRound.deleteMany({ where: { applicationId: id } });
    }
    if (prisma.interviewerQuestion) {
      await prisma.interviewerQuestion.deleteMany({ where: { applicationId: id } }).catch(() => {});
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
