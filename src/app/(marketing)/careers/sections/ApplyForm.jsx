"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import GlobalStyles from "@mui/material/GlobalStyles";
import { toast } from "react-hot-toast";
import { getResumeFileNameError } from "../../../../lib/resumeFile";
import {
  FILE_UNREADABLE_MESSAGE,
  NETWORK_FAILED_MESSAGE,
  NetworkFailedError,
  connectionInfo,
  describeFile,
  postWithRetry,
  readFileIntoMemory,
} from "../../../../lib/formUpload";
import {
  RECAPTCHA_SITE_KEY,
  getRecaptchaToken,
  handleCaptchaError,
  preloadRecaptcha,
  reportClientIssue,
} from "../../../../lib/recaptchaClient";

const inputStyle = {
  mb: 1.75,
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    borderRadius: 2,
    transition: "box-shadow 0.2s ease",
    "& fieldset": {
      borderColor: "rgba(29, 87, 88, 0.12)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(29, 87, 88, 0.3)",
    },
    "&.Mui-focused": {
      boxShadow: "0 0 0 3px rgba(29, 87, 88, 0.1)",
      "& fieldset": {
        borderColor: "#1D5758",
      },
    },
  },
};

export default function ApplyForm({ jobTitle, jobSlug, showHeader = true, onSuccess }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [availableToJoinAndRelocate, setAvailableToJoinAndRelocate] =
    useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [readingFile, setReadingFile] = useState(false);

  // Load Google's invisible captcha in the background while the visitor fills the form
  useEffect(() => {
    preloadRecaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
      toast.error("Please upload your resume");
      return;
    }

    const fileNameError = getResumeFileNameError(resumeFile.name);
    if (fileNameError) {
      toast.error(fileNameError);
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    setSubmitting(true);

    let recaptchaToken;
    try {
      recaptchaToken = await getRecaptchaToken("job_application");
    } catch (captchaError) {
      toast.error(handleCaptchaError(captchaError, "job-application"));
      setSubmitting(false);
      return;
    }

    try {
      const applyData = new FormData();
      applyData.append("fullName", String(formData.get("full_name") || ""));
      applyData.append("email", String(formData.get("email") || ""));
      applyData.append("phone", String(formData.get("phone") || ""));
      applyData.append("coverLetter", String(formData.get("cover_letter") || ""));
      applyData.append(
        "referralSource",
        String(formData.get("referral_source") || ""),
      );
      applyData.append(
        "availableToJoinAndRelocate",
        availableToJoinAndRelocate ? "yes" : "no",
      );
      applyData.append("jobSlug", jobSlug);
      applyData.append("jobTitle", jobTitle);
      applyData.append("recaptchaToken", recaptchaToken);
      applyData.append("resume", resumeFile);

      let applyRes;
      try {
        // the same FormData can be sent again; the resume is already a copy in memory
        applyRes = await postWithRetry("/api/applications", () => applyData);
      } catch (networkError) {
        reportClientIssue(
          "job-application",
          "network_error",
          [
            `step: sending application (${networkError?.attempts || 1} tries)`,
            `error: ${networkError?.message}`,
            `file: ${describeFile(resumeFile)}`,
            `connection: ${connectionInfo()}`,
          ].join(" | "),
        );
        throw new Error(networkError instanceof NetworkFailedError ? NETWORK_FAILED_MESSAGE : networkError?.message);
      }

      if (!applyRes.ok) {
        const err = await applyRes.json().catch(() => null);
        if (!err) {
          // Not our API's JSON (e.g. the hosting platform timed out) — the server couldn't report it itself
          reportClientIssue("job-application", "server_error", `HTTP ${applyRes.status} from the server`);
        }
        throw new Error(err?.error || "Failed to submit application");
      }

      toast.success("Application submitted successfully!");
      form.reset();
      setResumeFile(null);
      setFileName("");
      setAvailableToJoinAndRelocate(false);
      onSuccess?.();
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={
        showHeader
          ? {
              borderRadius: 3.5,
              overflow: "hidden",
              backgroundColor: "#fff",
              border: "1px solid rgba(29, 87, 88, 0.1)",
              boxShadow: "0 20px 50px rgba(29, 87, 88, 0.12)",
            }
          : undefined
      }
    >
      {showHeader ? (
        <Box
          sx={{
            px: { xs: 3, md: 3.5 },
            py: 3,
            color: "#fff",
            backgroundImage:
              "linear-gradient(122deg, #1D5758 0%, #2BD1C7 100%)",
            position: "relative",
            overflow: "hidden",
            "&::after": {
              content: '""',
              position: "absolute",
              width: 160,
              height: 160,
              borderRadius: "50%",
              right: -40,
              top: -50,
              background: "rgba(255,255,255,0.12)",
            },
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              opacity: 0.85,
            }}
          >
            Ready to join?
          </Typography>
          <Typography fontWeight={800} sx={{ fontSize: "1.35rem", mt: 0.5 }}>
            Apply for this role
          </Typography>
          <Typography sx={{ mt: 1, opacity: 0.9, fontSize: "0.9rem" }}>
            {jobTitle}
          </Typography>
        </Box>
      ) : null}

      <Box sx={{ p: showHeader ? { xs: 3, md: 3.5 } : 0, pt: showHeader ? undefined : 2 }}>
        <TextField
          fullWidth
          required
          name="full_name"
          label="Full Name"
          disabled={submitting}
          sx={inputStyle}
        />
        <TextField
          fullWidth
          required
          type="email"
          name="email"
          label="Email Address"
          disabled={submitting}
          sx={inputStyle}
        />
        <TextField
          fullWidth
          required
          name="phone"
          label="Phone Number"
          disabled={submitting}
          sx={inputStyle}
        />
        <TextField
          fullWidth
          multiline
          rows={3}
          name="cover_letter"
          label="Cover letter / message"
          placeholder="Optional — tell us why you’re a great fit"
          disabled={submitting}
          sx={inputStyle}
        />
        <TextField
          fullWidth
          name="referral_source"
          label="How did you hear about this role?"
          placeholder="e.g. LinkedIn, a colleague’s name"
          inputProps={{ maxLength: 25 }}
          helperText="Max 25 characters"
          disabled={submitting}
          sx={inputStyle}
        />
        <FormControlLabel
          sx={{
            mb: 1.75,
            alignItems: "flex-start",
            mx: 0,
            "& .MuiFormControlLabel-label": {
              fontSize: "0.9rem",
              color: "#374151",
              lineHeight: 1.5,
              pt: 0.35,
            },
          }}
          control={
            <Checkbox
              checked={availableToJoinAndRelocate}
              onChange={(e) => setAvailableToJoinAndRelocate(e.target.checked)}
              disabled={submitting}
              sx={{
                pt: 0,
                color: "rgba(29, 87, 88, 0.4)",
                "&.Mui-checked": { color: "#1D5758" },
              }}
            />
          }
          label="I confirm that I am available to join immediately and work from Trivandrum, Kerala."
          disabled={submitting}
        />

        <Box
          sx={{
            mb: 2.5,
            p: 2.25,
            borderRadius: 2.5,
            border: "1.5px dashed",
            borderColor: fileName
              ? "rgba(29, 87, 88, 0.45)"
              : "rgba(29, 87, 88, 0.2)",
            backgroundColor: fileName
              ? "rgba(29, 87, 88, 0.04)"
              : "rgba(29, 87, 88, 0.02)",
            textAlign: "center",
          }}
        >
          {fileName ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                mb: 1,
                color: "#1D5758",
              }}
            >
              <DescriptionOutlinedIcon sx={{ fontSize: 22 }} />
              <Typography fontWeight={600} fontSize="0.9rem" noWrap>
                {fileName}
              </Typography>
            </Box>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1.25, fontWeight: 500 }}
            >
              Attach your resume (PDF or DOC, max 512KB). Avoid special
              characters in the file name (e.g. & # %).
            </Typography>
          )}

          <Button
            component="label"
            startIcon={<UploadFileIcon />}
            disabled={submitting}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              color: "#1D5758",
              borderRadius: 2,
              px: 2,
              "&:hover": {
                backgroundColor: "rgba(29, 87, 88, 0.06)",
              },
            }}
          >
            {readingFile ? "Checking file..." : fileName ? "Change file" : "Upload resume"}
            <input
              type="file"
              name="resume"
              hidden
              accept=".pdf,.doc,.docx"
              onChange={async (e) => {
                const input = e.target;
                const file = input.files?.[0];
                if (!file) {
                  setResumeFile(null);
                  setFileName("");
                  return;
                }
                if (file.size > 512 * 1024) {
                  toast.error("Resume must be 512KB or smaller");
                  e.target.value = "";
                  setResumeFile(null);
                  setFileName("");
                  return;
                }
                const nameError = getResumeFileNameError(file.name);
                if (nameError) {
                  toast.error(nameError);
                  e.target.value = "";
                  setResumeFile(null);
                  setFileName("");
                  return;
                }
                // Read it now, so a file Chrome can't access fails here and not on submit
                setReadingFile(true);
                try {
                  const copy = await readFileIntoMemory(file);
                  setResumeFile(copy);
                  setFileName(copy.name);
                } catch (readError) {
                  toast.error(FILE_UNREADABLE_MESSAGE, { duration: 8000 });
                  reportClientIssue(
                    "job-application",
                    "file_unreadable",
                    `error: ${readError?.message} | file: ${describeFile(file)} | connection: ${connectionInfo()}`,
                  );
                  input.value = "";
                  setResumeFile(null);
                  setFileName("");
                } finally {
                  setReadingFile(false);
                }
              }}
            />
          </Button>
        </Box>

        {RECAPTCHA_SITE_KEY ? <GlobalStyles styles={{ ".grecaptcha-badge": { visibility: "hidden" } }} /> : null}

        <Button
          type="submit"
          fullWidth
          disabled={submitting || readingFile}
          sx={{
            py: 1.6,
            borderRadius: 2.5,
            fontWeight: 800,
            letterSpacing: "0.02em",
            color: "#fff",
            backgroundImage:
              "linear-gradient(96deg, #1D5758 0%, #2BD1C7 100%)",
            boxShadow: "0 10px 24px rgba(29, 87, 88, 0.28)",
            "&.Mui-disabled": {
              color: "#fff",
              opacity: 0.75,
            },
          }}
        >
          {submitting ? (
            <CircularProgress size={22} sx={{ color: "#fff" }} />
          ) : (
            "Submit application"
          )}
        </Button>
        <Typography
          sx={{ mt: 1.25, fontSize: "0.72rem", color: "#9ca3af", textAlign: "center", lineHeight: 1.5 }}
        >
          This site is protected by reCAPTCHA and the Google{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>
            Terms of Service
          </a>{" "}
          apply.
        </Typography>

        <Typography
          variant="caption"
          display="block"
          textAlign="center"
          color="text.secondary"
          sx={{ mt: 2, lineHeight: 1.5 }}
        >
          Submit your application and our team will get back to you soon.
        </Typography>
      </Box>
    </Box>
  );
}
