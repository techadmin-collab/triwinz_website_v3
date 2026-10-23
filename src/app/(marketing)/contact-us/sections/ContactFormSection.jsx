"use client";

import { Box, Typography, TextField, Button } from "@mui/material";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";

export default function ContactFormSection() {
  const formRef = useRef();
  const [sending, setSending] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();
    if (sending) return;

    const formData = new FormData(formRef.current);
    const payload = {
      full_name: formData.get("full_name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      company: formData.get("company"),
      message: formData.get("message"),
    };

    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed");

      toast.success("Message sent successfully!");
      formRef.current.reset();
    } catch {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        px: 2,
        background: "linear-gradient(122deg, #5014D2 0%, #DD3CA7 100%)",
        display: "flex",
        justifyContent: "center",
        fontFamily: "montserrat, inter",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 720 }}>
        {/* Heading */}
        <Typography
          fontWeight={800}
          sx={{
            color: "#fff",
            textAlign: "center",
            fontSize: { xs: "2rem", md: "2.6rem" },
            mb: 1.5,
          }}
        >
          Send us a message or give a call
        </Typography>

        <Typography
          sx={{
            color: "rgba(255,255,255,0.9)",
            textAlign: "center",
            mb: 5,
          }}
        >
          Drop us a message and our team will get back to you within one
          business day.
        </Typography>

        {/* Form Card */}
        <Box
          component="form"
          ref={formRef}
          onSubmit={sendEmail}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            backgroundColor: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
        >
          <FormInput placeholder="Full Name" name="full_name" />
          <FormInput placeholder="Email Address" name="email" type="email" />
          <FormInput placeholder="Contact Number" name="phone" />
          <FormInput placeholder="Company Name" name="company" />

          <TextField
            multiline
            rows={4}
            placeholder="Tell us about your project or requirements..."
            name="message"
            fullWidth
            required
            sx={inputStyle}
          />

          <Button
            fullWidth
            type="submit"
            disabled={sending}
            sx={{
              mt: 3,
              py: 1.6,
              borderRadius: 2,
              fontWeight: 700,
              backgroundColor: "#fff",
              color: "#6A1BFF",
              "&:hover": {
                backgroundColor: "#F3F3F3",
              },
            }}
          >
            {sending
              ? "SENDING..."
              : "SEND MESSAGE & BOOK CONSULTATION"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

/* Reusable input */
function FormInput({ placeholder, name, type = "text" }) {
  return (
    <TextField
      placeholder={placeholder}
      name={name}
      type={type}
      fullWidth
      required
      sx={inputStyle}
    />
  );
}

/* Shared styles */
const inputStyle = {
  mb: 2.2,
  "& .MuiInputBase-root": {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 2,
    color: "#fff",
  },
  "& input, & textarea": {
    color: "#fff",
  },
  "& ::placeholder": {
    color: "rgba(255,255,255,0.8)",
    opacity: 0.65,
  },
  "& fieldset": {
    border: "1px solid rgba(255,255,255,0.3)",
  },
};
