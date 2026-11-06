import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import { requireModule } from "../../../../../../lib/requireAdmin";
import { sendMail } from "../../../../../../lib/mail";
import { interviewerAvailabilityTemplate } from "../../../../../../lib/emailTemplates";
import { newPortalToken, portalUrl } from "../../../../../../lib/interviewerPortal";
import { OBJECT_ID_RE } from "../../../../../../lib/interviews";
import { badRequest, clientOutdated } from "../../../interviews/_server";

function linkInfo(interviewer) {
  return {
    id: interviewer.id,
    portalToken: interviewer.portalToken,
    portalUrl: interviewer.portalToken ? portalUrl(interviewer.portalToken) : null,
    portalCreatedAt: interviewer.portalCreatedAt,
    portalSentAt: interviewer.portalSentAt,
    portalSeenAt: interviewer.portalSeenAt,
  };
}

// POST { action: "link" | "regenerate" | "revoke" | "email" }
//  link       -> make sure a link exists and return it (for "Copy link")
//  regenerate -> new link; the old one stops working
//  revoke     -> no link; the old one stops working
//  email      -> make sure a link exists and email it to the panel member
export async function POST(req, { params }) {
  const { error } = await requireModule("interviews");
  if (error) return error;
  const outdated = clientOutdated();
  if (outdated) return outdated;

  const { id } = await params;
  if (!OBJECT_ID_RE.test(id)) return badRequest("Panel member not found", 404);
  const interviewer = await prisma.interviewer.findUnique({ where: { id } });
  if (!interviewer) return badRequest("Panel member not found", 404);

  const body = await req.json().catch(() => ({}));
  const action = body.action;

  if (action === "revoke") {
    const updated = await prisma.interviewer.update({
      where: { id },
      data: { portalToken: null, portalCreatedAt: null, portalSentAt: null, portalSeenAt: null },
    });
    return NextResponse.json(linkInfo(updated));
  }

  if (!["link", "regenerate", "email"].includes(action)) return badRequest("Unknown action");
  if (!interviewer.active) {
    return badRequest("This panel member is inactive. Switch on Active before sharing a link.");
  }

  let current = interviewer;
  if (action === "regenerate" || !interviewer.portalToken) {
    current = await prisma.interviewer.update({
      where: { id },
      data: {
        portalToken: newPortalToken(),
        portalCreatedAt: new Date(),
        portalSentAt: null,
        portalSeenAt: null,
      },
    });
  }

  if (action === "email") {
    if (!current.email) return badRequest("Add an email address for this panel member first.");
    const url = portalUrl(current.portalToken);
    const mail = interviewerAvailabilityTemplate({ name: current.name, url });
    try {
      await sendMail({ to: current.email, subject: mail.subject, text: mail.text, html: mail.html });
    } catch (mailError) {
      console.error("Availability link email failed:", mailError);
      return NextResponse.json(
        {
          ...linkInfo(current),
          error: "The email could not be sent. You can copy the link and share it another way.",
        },
        { status: 502 },
      );
    }
    current = await prisma.interviewer.update({
      where: { id },
      data: { portalSentAt: new Date() },
    });
  }

  return NextResponse.json(linkInfo(current));
}
