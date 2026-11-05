"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import GlobalStyles from "@mui/material/GlobalStyles";
import { toast } from "react-hot-toast";
import { getResumeFileNameError } from "../../../../lib/resumeFile";
import {
  RECAPTCHA_SITE_KEY,
  getRecaptchaToken,
  handleCaptchaError,
  preloadRecaptcha,
  reportClientIssue,
} from "../../../../lib/recaptchaClient";
import {
  FIELD_VALIDATORS,
  LIMITS,
  QUALIFICATIONS,
  getYearOptions,
  normalizePhone,
  validateResumeFile,
  validateTrainingApplication,
} from "../../../../lib/trainingValidation";

// Bottom margin is small because helperText always reserves a line for errors.
const inputStyle = {
  mb: 0.5,
  "& .MuiFormHelperText-root": { mx: 0.5, minHeight: 20 },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    borderRadius: 2,
    transition: "box-shadow 0.2s ease",
    "& fieldset": { borderColor: "rgba(29, 87, 88, 0.12)" },
    "&:hover fieldset": { borderColor: "rgba(29, 87, 88, 0.3)" },
    "&.Mui-focused": {
      boxShadow: "0 0 0 3px rgba(29, 87, 88, 0.1)",
      "& fieldset": { borderColor: "#1D5758" },
    },
    "&.Mui-error fieldset": { borderColor: "#d32f2f" },
  },
};

const EMPTY_VALUES = {
  fullName: "",
  email: "",
  phone: "",
  qualification: "",
  college: "",
  yearOfPassing: "",
};

// Order used to focus the first invalid field on submit.
const FIELD_ORDER = Object.keys(EMPTY_VALUES);

export default function TrainingApplyForm({ onSuccess }) {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeError, setResumeError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fieldRefs = useRef({});

  // Load Google's invisible captcha in the background while the visitor fills the form
  useEffect(() => {
    preloadRecaptcha();
  }, []);

  const validateField = (name, value) => {
    const message = FIELD_VALIDATORS[name]?.(value) || "";
    setErrors((prev) => ({ ...prev, [name]: message }));
    return message;
  };

  const handleChange = (name) => (e) => {
    let value = e.target.value;
    // Phone: allow only digits, +, spaces, dashes and brackets while typing.
    if (name === "phone") value = value.replace(/[^\d+\s\-()]/g, "");
    setValues((prev) => ({ ...prev, [name]: value }));
    // Re-validate live once the user has left the field at least once.
    if (touched[name]) validateField(name, value);
  };

  const handleBlur = (name) => () => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, values[name]);
  };

  // Selects commit on change, so validate immediately.
  const handleSelect = (name) => (e) => {
    const value = e.target.value;
    setValues((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const fieldProps = (name) => ({
    name,
    value: values[name],
    error: Boolean(touched[name] && errors[name]),
    helperText: touched[name] && errors[name] ? errors[name] : " ",
    disabled: submitting,
    inputRef: (el) => {
      fieldRefs.current[name] = el;
    },
    sx: inputStyle,
  });

  const clearFile = (input) => {
    if (input) input.value = "";
    setResumeFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      clearFile(e.target);
      setResumeError("Please upload your resume");
      return;
    }
    const message =
      validateResumeFile(file) || getResumeFileNameError(file.name) || "";
    if (message) {
      setResumeError(message);
      clearFile(e.target);
      return;
    }
    setResumeError("");
    setResumeFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allErrors = validateTrainingApplication(values);
    setErrors(allErrors);
    setTouched(Object.fromEntries(FIELD_ORDER.map((f) => [f, true])));

    const fileError =
      resumeError ||
      validateResumeFile(resumeFile) ||
      (resumeFile ? getResumeFileNameError(resumeFile.name) : "") ||
      "";
    setResumeError(fileError);

    const firstInvalid = FIELD_ORDER.find((f) => allErrors[f]);
    if (firstInvalid || fileError) {
      toast.error("Please fix the highlighted fields");
      fieldRefs.current[firstInvalid]?.focus?.();
      return;
    }

    setSubmitting(true);

    let recaptchaToken;
    try {
      recaptchaToken = await getRecaptchaToken("training_application");
    } catch (captchaError) {
      toast.error(handleCaptchaError(captchaError, "training-application"));
      setSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("fullName", values.fullName.trim());
      data.append("email", values.email.trim().toLowerCase());
      data.append("phone", normalizePhone(values.phone));
      data.append("qualification", values.qualification);
      data.append("college", values.college.trim());
      data.append("yearOfPassing", values.yearOfPassing);
      data.append("recaptchaToken", recaptchaToken);
      if (resumeFile) data.append("resume", resumeFile);

      let res;
      try {
        res = await fetch("/api/training-applications", {
          method: "POST",
          body: data,
        });
      } catch (networkError) {
        reportClientIssue("training-application", "network_error", networkError?.message);
        throw new Error(
          "We couldn't reach our server. Please check your internet connection and try again.",
        );
      }

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        if (!err) {
          // Not our API's JSON (e.g. the hosting platform timed out) — the server couldn't report it itself
          reportClientIssue("training-application", "server_error", `HTTP ${res.status} from the server`);
        }
        // Show server-side field errors inline if returned.
        if (err?.fields && typeof err.fields === "object") {
          setErrors((prev) => ({ ...prev, ...err.fields }));
        }
        throw new Error(err?.error || "Failed to submit application");
      }

      toast.success("Application submitted! We'll be in touch soon.");
      setValues(EMPTY_VALUES);
      setErrors({});
      setTouched({});
      setResumeError("");
      clearFile();
      onSuccess?.();
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ pt: 2 }}>
      <TextField
        fullWidth
        required
        label="Full Name"
        autoComplete="name"
        inputProps={{ maxLength: LIMITS.fullNameMax }}
        onChange={handleChange("fullName")}
        onBlur={handleBlur("fullName")}
        {...fieldProps("fullName")}
      />
      <TextField
        fullWidth
        required
        type="email"
        label="Email Address"
        autoComplete="email"
        inputProps={{ maxLength: LIMITS.emailMax }}
        onChange={handleChange("email")}
        onBlur={handleBlur("email")}
        {...fieldProps("email")}
      />
      <TextField
        fullWidth
        required
        type="tel"
        label="Phone Number"
        placeholder="e.g. +91 98765 43210"
        autoComplete="tel"
        inputProps={{ maxLength: 20, inputMode: "tel" }}
        onChange={handleChange("phone")}
        onBlur={handleBlur("phone")}
        {...fieldProps("phone")}
      />
      <TextField
        select
        fullWidth
        required
        label="Highest Qualification"
        onChange={handleSelect("qualification")}
        {...fieldProps("qualification")}
      >
        {QUALIFICATIONS.map((q) => (
          <MenuItem key={q} value={q}>
            {q}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        fullWidth
        required
        label="College / Institution"
        autoComplete="organization"
        inputProps={{ maxLength: LIMITS.collegeMax }}
        onChange={handleChange("college")}
        onBlur={handleBlur("college")}
        {...fieldProps("college")}
      />
      <TextField
        select
        fullWidth
        required
        label="Year of Passing"
        onChange={handleSelect("yearOfPassing")}
        {...fieldProps("yearOfPassing")}
      >
        {getYearOptions().map((y) => (
          <MenuItem key={y} value={y}>
            {y}
          </MenuItem>
        ))}
      </TextField>

      <Box
        sx={{
          mb: 2.5,
          p: 2.25,
          borderRadius: 2.5,
          border: "1.5px dashed",
          borderColor: resumeError
            ? "#d32f2f"
            : resumeFile
              ? "rgba(29, 87, 88, 0.45)"
              : "rgba(29, 87, 88, 0.2)",
          backgroundColor: resumeError
            ? "rgba(211, 47, 47, 0.04)"
            : resumeFile
              ? "rgba(29, 87, 88, 0.04)"
              : "rgba(29, 87, 88, 0.02)",
          textAlign: "center",
        }}
      >
        {resumeFile ? (
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
              {resumeFile.name}
            </Typography>
          </Box>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1.25, fontWeight: 500 }}
          >
            Attach your resume <Box component="span" sx={{ color: "#d32f2f" }}>*</Box>{" "}
            — PDF or DOC, max 512KB. Avoid special characters in the file
            name (e.g. &amp; # %).
          </Typography>
        )}

        <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
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
              "&:hover": { backgroundColor: "rgba(29, 87, 88, 0.06)" },
            }}
          >
            {resumeFile ? "Change file" : "Upload resume"}
            <input
              type="file"
              hidden
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </Button>
          {resumeFile ? (
            <Button
              disabled={submitting}
              onClick={() => {
                clearFile();
                setResumeError("Please upload your resume");
              }}
              sx={{ textTransform: "none", fontWeight: 600, color: "#6b7280" }}
            >
              Remove
            </Button>
          ) : null}
        </Box>

        {resumeError ? (
          <Typography
            role="alert"
            sx={{ mt: 1, fontSize: "0.8rem", color: "#d32f2f", fontWeight: 500 }}
          >
            {resumeError}
          </Typography>
        ) : null}
      </Box>

      {RECAPTCHA_SITE_KEY ? <GlobalStyles styles={{ ".grecaptcha-badge": { visibility: "hidden" } }} /> : null}

      <Button
        type="submit"
        fullWidth
        disabled={submitting}
        sx={{
          py: 1.6,
          borderRadius: 2.5,
          fontWeight: 800,
          letterSpacing: "0.02em",
          color: "#fff",
          backgroundImage: "linear-gradient(96deg, #1D5758 0%, #2BD1C7 100%)",
          boxShadow: "0 10px 24px rgba(29, 87, 88, 0.28)",
          "&.Mui-disabled": { color: "#fff", opacity: 0.75 },
        }}
      >
        {submitting ? (
          <CircularProgress size={22} sx={{ color: "#fff" }} />
        ) : (
          "Submit application"
        )}
      </Button>

      <Typography
        variant="caption"
        display="block"
        textAlign="center"
        color="text.secondary"
        sx={{ mt: 2, lineHeight: 1.5 }}
      >
        Our team will review your application and contact you with the next steps.
      </Typography>
      <Typography
        sx={{ mt: 1, fontSize: "0.72rem", color: "#9ca3af", textAlign: "center", lineHeight: 1.5 }}
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
    </Box>
  );
}
