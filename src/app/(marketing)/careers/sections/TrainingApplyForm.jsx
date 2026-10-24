"use client";

import { useRef, useState } from "react";
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
import { Turnstile } from "@marsidev/react-turnstile";
import { toast } from "react-hot-toast";
import { getResumeFileNameError } from "../../../../lib/resumeFile";
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
    "& fieldset": { borderColor: "rgba(80, 20, 210, 0.12)" },
    "&:hover fieldset": { borderColor: "rgba(80, 20, 210, 0.3)" },
    "&.Mui-focused": {
      boxShadow: "0 0 0 3px rgba(80, 20, 210, 0.1)",
      "& fieldset": { borderColor: "#5014d2" },
    },
    "&.Mui-error fieldset": { borderColor: "#d32f2f" },
  },
};

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

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
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef(null);
  const fieldRefs = useRef({});

  const resetTurnstile = () => {
    setTurnstileToken("");
    turnstileRef.current?.reset();
  };

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

    if (!TURNSTILE_SITE_KEY) {
      toast.error("Captcha is not configured");
      return;
    }
    if (!turnstileToken) {
      toast.error("Please complete the captcha");
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("fullName", values.fullName.trim());
      data.append("email", values.email.trim().toLowerCase());
      data.append("phone", normalizePhone(values.phone));
      data.append("qualification", values.qualification);
      data.append("college", values.college.trim());
      data.append("yearOfPassing", values.yearOfPassing);
      data.append("turnstileToken", turnstileToken);
      if (resumeFile) data.append("resume", resumeFile);

      const res = await fetch("/api/training-applications", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        // Show server-side field errors inline if returned.
        if (err.fields && typeof err.fields === "object") {
          setErrors((prev) => ({ ...prev, ...err.fields }));
        }
        throw new Error(err.error || "Failed to submit application");
      }

      toast.success("Application submitted! We'll be in touch soon.");
      setValues(EMPTY_VALUES);
      setErrors({});
      setTouched({});
      setResumeError("");
      clearFile();
      resetTurnstile();
      onSuccess?.();
    } catch (err) {
      toast.error(err.message || "Something went wrong");
      resetTurnstile();
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
              ? "rgba(80, 20, 210, 0.45)"
              : "rgba(80, 20, 210, 0.2)",
          backgroundColor: resumeError
            ? "rgba(211, 47, 47, 0.04)"
            : resumeFile
              ? "rgba(80, 20, 210, 0.04)"
              : "rgba(80, 20, 210, 0.02)",
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
              color: "#5014d2",
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
              color: "#5014d2",
              borderRadius: 2,
              px: 2,
              "&:hover": { backgroundColor: "rgba(80, 20, 210, 0.06)" },
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

      {TURNSTILE_SITE_KEY ? (
        <Box sx={{ mb: 2.5, display: "flex", justifyContent: "center" }}>
          <Turnstile
            ref={turnstileRef}
            siteKey={TURNSTILE_SITE_KEY}
            onSuccess={setTurnstileToken}
            onExpire={() => setTurnstileToken("")}
            onError={() => {
              setTurnstileToken("");
              toast.error("Captcha failed to load. Please refresh and try again.");
            }}
            options={{ theme: "light" }}
          />
        </Box>
      ) : null}

      <Button
        type="submit"
        fullWidth
        disabled={submitting || (Boolean(TURNSTILE_SITE_KEY) && !turnstileToken)}
        sx={{
          py: 1.6,
          borderRadius: 2.5,
          fontWeight: 800,
          letterSpacing: "0.02em",
          color: "#fff",
          backgroundImage: "linear-gradient(96deg, #5014D2 0%, #DD3CA7 100%)",
          boxShadow: "0 10px 24px rgba(80, 20, 210, 0.28)",
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
    </Box>
  );
}
