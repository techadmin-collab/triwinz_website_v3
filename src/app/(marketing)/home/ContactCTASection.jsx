"use client";

import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";

const inputStyles = {
  backgroundColor: "#ffffff1c",
  borderRadius: "6px",
  border: "1px solid #ffffff23",

  "& .MuiInputBase-input": {
    color: "#fff",
    fontSize: "16px",
    fontWeight: 400,
  },

  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },

  "&::placeholder": {
    color: "#FFFFFFB3",
  },
};

export default function ContactCTASection() {
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
      id="contact-us"
      sx={{
        py: { xs: 8, md: 12 },
        px: 2,
        background: "linear-gradient(122deg, #5014D2 0%, #DD3CA7 100%)",
        color: "#fff",
        minHeight: "100vh",
        fontFamily: "montserrat, inter",
      }}
    >
      <Box
        sx={{
          width: "100%",
          mx: "auto",
          px: { xs: 2, md: 0 },
          maxWidth: {
            xs: "1250px",
            xl: "xl",
          },
        }}
      >
        {/* Heading */}
        <Typography
          variant="h3"
          fontWeight={700}
          textAlign="center"
          gutterBottom
        >
          Let’s Talk About Scaling Your Business
        </Typography>

        <Typography
          textAlign="center"
          sx={{ maxWidth: 720, mx: "auto", mb: 6, opacity: 0.9 }}
        >
          Whether you’re exploring digital transformation, smarter
          infrastructure, or tailored IT strategies our experts are here to
          help. Book a quick call and let’s build something great together.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 4,
            flexDirection: { xs: "column", md: "row" },
            alignItems: "stretch",
            justifyContent: "space-between",
          }}
        >
          {/* Left Info */}
          <Box
            sx={{
              flex: { xs: "1 1 100%", md: "1 1 35%" },
              alignContent: "center",
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Get in Touch
            </Typography>

            <InfoItem
              icon={<LocationOnIcon />}
              title="Corporate Headquarters"
              text={`No 192, Old No 03\nSakthi Nagar Main Road,\nArumbakkam, Chennai, Tamil Nadu,\nIndia, 600106.`}
            />

            <InfoItem
              icon={<PhoneIcon />}
              title="Phone"
              text="+91 814 829 3231"
            />

            <InfoItem
              icon={<EmailIcon />}
              title="Email"
              text="corpconnect@triwinz.com"
            />

            <InfoItem
              icon={<AccessTimeIcon />}
              title="Business Hours"
              text={`Mon – Fri: 9:00 AM – 6:00 PM IST
Sat: 9:00 AM – 2:00 PM IST`}
            />
          </Box>
          {/* Right Form */}
          <Box
            sx={{
              flex: { xs: "1 1 100%", md: "0 0 60%" },
              backgroundColor: "#FFFFFF1A",
              borderRadius: "16px",
              maxWidth: "800px",
              mx: "auto",
            }}
          >
            <Box
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.09)",
                borderRadius: "16px",
                p: { xs: 3, md: 4 },
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Let’s Talk About Scaling Your Business
              </Typography>

              <Typography sx={{ mb: 3, opacity: 0.9 }}>
                Book a call, let’s build something together.
              </Typography>

              {/* FORM */}
              <Box
                component="form"
                ref={formRef}
                onSubmit={sendEmail}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Full Name"
                  name="full_name"
                  sx={{
                    ...inputStyles,

                    "& .MuiInputBase-input": {
                      height: "40px",
                      boxSizing: "border-box",
                      display: "flex",
                      alignItems: "center",
                      color: "#fff",
                    },
                  }}
                />

                <TextField
                  fullWidth
                  placeholder="Email Address"
                  type="email"
                  name="email"
                  sx={{
                    ...inputStyles,

                    "& .MuiInputBase-input": {
                      height: "40px",
                      boxSizing: "border-box",
                      display: "flex",
                      alignItems: "center",
                      color: "#fff",
                    },
                  }}
                />

                <TextField
                  fullWidth
                  placeholder="Contact Number"
                  name="phone"
                  sx={{
                    ...inputStyles,

                    "& .MuiInputBase-input": {
                      height: "40px",
                      boxSizing: "border-box",
                      display: "flex",
                      alignItems: "center",
                      color: "#fff",
                    },
                  }}
                />

                <TextField
                  fullWidth
                  placeholder="Company Name"
                  name="company"
                  sx={{
                    ...inputStyles,

                    "& .MuiInputBase-input": {
                      height: "40px",
                      boxSizing: "border-box",
                      display: "flex",
                      alignItems: "center",
                      color: "#fff",
                    },
                  }}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Tell us about your project or requirements..."
                  name="message"
                  sx={{
                    ...inputStyles,

                    "& .MuiInputBase-input": {
                      boxSizing: "border-box",
                      display: "flex",
                      alignItems: "center",
                      color: "#fff",
                    },
                  }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={sending}
                  sx={{
                    mt: 1,
                    color: "#fff",
                    fontWeight: 700,
                    py: 1.3,
                    borderRadius: "8px",
                    backgroundImage:
                      "linear-gradient(96deg, #5014D2 0%, #DD3CA7 100%)",
                    boxShadow: "0 10px 24px rgba(80, 20, 210, 0.28)",
                    "&:hover": {
                      backgroundImage:
                        "linear-gradient(96deg, #4510b8 0%, #c43395 100%)",
                    },
                    "&.Mui-disabled": {
                      color: "#fff",
                      opacity: 0.75,
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
        </Box>
      </Box>
    </Box>
  );
}

/* ---------- Helper ---------- */

function InfoItem({ icon, title, text }) {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography fontWeight={600}>{title}</Typography>
        <Typography sx={{ whiteSpace: "pre-line", opacity: 0.9 }}>
          {text}
        </Typography>
      </Box>
    </Box>
  );
}
