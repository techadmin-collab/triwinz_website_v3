import { sendMail } from "./mail";
import {
  applicationReceivedTemplate,
  applicationRejectedTemplate,
} from "./emailTemplates";

export async function sendApplicationEmails({ fullName, email, jobTitle }) {
  try {
    const template = applicationReceivedTemplate({ fullName, jobTitle });
    await sendMail({
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
    return { applicant: true };
  } catch (error) {
    console.error("Applicant thank-you email failed:", error);
    return { applicant: false };
  }
}

export async function sendApplicationRejectedEmail({
  fullName,
  email,
  jobTitle,
}) {
  try {
    const template = applicationRejectedTemplate({ fullName, jobTitle });
    await sendMail({
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
    return true;
  } catch (error) {
    console.error("Application rejection email failed:", error);
    return false;
  }
}
