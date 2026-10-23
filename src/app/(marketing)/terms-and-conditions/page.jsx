import React from "react";
import { Box, Typography, Divider, Link } from "@mui/material";

const page = () => {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          minHeight: { xs: 220, md: 280 },
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(90deg, #3D74FF 0%, #FF4F81 100%)",
          fontFamily: "montserrat, inter",
        }}
      >
        <Box
          sx={{
            maxWidth: 1250,
            width: "100%",
            mx: "auto",
            px: { xs: 2, md: 4 },
          }}
        >
          <Typography
            fontWeight={700}
            sx={{
              color: "#fff",
              fontSize: { xs: "2rem", md: "2.8rem" },
            }}
          >
            Terms and Conditions
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          maxWidth: 1250,
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: { xs: 6, md: 8 },
          fontFamily: "montserrat, inter",
        }}
      >
        {/* 1. Acceptance */}
        <Typography fontWeight={700} sx={{ mb: 1 }}>
          1. Acceptance of Terms
        </Typography>
        <Typography sx={paragraphStyle}>
          By accessing and using our website, you agree to comply with and be
          bound by these Terms and Conditions. If you do not agree to these
          terms, please do not use the Website.
        </Typography>

        {/* 2. Use of Website */}
        <Typography fontWeight={700} sx={{ mt: 4, mb: 1 }}>
          2. Use of the Website
        </Typography>

        <Typography sx={paragraphStyle}>
          <strong>2.1 License:</strong>{" "}
          <Link
            href="/"
            underline="none"
            sx={{ fontWeight: 600, color: "#6B7280" }}
          >
            Triwinz Technologies Pvt Ltd
          </Link>{" "}
          grants you a limited, non-exclusive, and revocable license to access
          and use the Website for informational and non-commercial purposes.
        </Typography>

        <Typography sx={{ ...paragraphStyle, mt: 2 }}>
          <strong>2.2 Prohibited Activities:</strong> You agree not to engage in
          any of the following activities:
        </Typography>

        <Box component="ul" sx={listStyle}>
          <li>Violating any applicable laws or regulations.</li>
          <li>
            Attempting to gain unauthorized access to the Website or its
            servers.
          </li>
          <li>Using the Website for any illegal or unethical purposes.</li>
          <li>Transmitting harmful code or malware.</li>
        </Box>

        {/* 3. Intellectual Property */}
        <Typography fontWeight={700} sx={{ mt: 4, mb: 1 }}>
          3. Intellectual Property
        </Typography>

        <Typography sx={paragraphStyle}>
          <strong>3.1 Copyright:</strong> All content on the Website, including
          text, graphics, logos, and software, is the property of Triwinz
          Technologies and is protected by copyright laws.
        </Typography>

        <Typography sx={paragraphStyle}>
          <strong>3.2 Trademarks:</strong> Any trademarks or logos used on the
          Website are the property of{" "}
          <Link
            href="/"
            underline="hover"
            sx={{ fontWeight: 600, color: "#6B7280" }}
          >
            Triwinz Technologies
          </Link>{" "}
          or their respective owners.
        </Typography>

        {/* 4. Privacy */}
        <Typography fontWeight={700} sx={{ mt: 4, mb: 1 }}>
          4. Privacy Policy
        </Typography>
        <Typography sx={paragraphStyle}>
          Your use of the Website is also governed by our Privacy Policy.
        </Typography>

        {/* 5. Third-party links */}
        <Typography fontWeight={700} sx={{ mt: 4, mb: 1 }}>
          5. Links to Third-Party Websites
        </Typography>
        <Typography sx={paragraphStyle}>
          The Website may contain links to third-party websites.{" "}
          <Link
            href="/"
            underline="hover"
            sx={{ fontWeight: 600, color: "#6B7280" }}
          >
            Triwinz Technologies
          </Link>{" "}
          is not responsible for the content or practices of these websites. You
          access them at your own risk.
        </Typography>

        {/* 6. Disclaimer */}
        <Typography fontWeight={700} sx={{ mt: 4, mb: 1 }}>
          6. Disclaimer of Warranties
        </Typography>

        <Typography sx={paragraphStyle}>
          <strong>6.1</strong> The Website is provided “as is” and “as
          available” without warranties of any kind, including but not limited
          to implied warranties of merchantability, fitness for a particular
          purpose, or non-infringement.
        </Typography>

        <Typography sx={paragraphStyle}>
          <strong>6.2</strong>{" "}
          <Link
            href="/"
            underline="hover"
            sx={{ fontWeight: 600, color: "#6B7280" }}
          >
            Triwinz Technologies
          </Link>{" "}
          does not guarantee the accuracy, completeness, or reliability of any
          information on the Website.
        </Typography>

        {/* 7. Limitation */}
        <Typography fontWeight={700} sx={{ mt: 4, mb: 1 }}>
          7. Limitation of Liability
        </Typography>
        <Typography sx={paragraphStyle}>
          In no event shall{" "}
          <Link
            href="/"
            underline="hover"
            sx={{ fontWeight: 600, color: "#6B7280" }}
          >
            Triwinz Technologies
          </Link>{" "}
          be liable for any direct, indirect, special, incidental, or
          consequential damages arising out of or in connection with your use or
          inability to use the Website.
        </Typography>

        <Typography sx={paragraphStyle}>
          Triwinz Technologies reserves the right to modify these Terms and
          Conditions at any time.
        </Typography>

        <Typography sx={{ mt: 3, fontWeight: 600 }}>
          If you have any questions or concerns, please contact us at{" "}
          <Link
            href="mailto:reachus@triwinz.com"
            underline="hover"
            sx={{ fontWeight: 600, color: "#6B7280" }}
          >
            reachus@triwinz.com
          </Link>
          .
        </Typography>
      </Box>
    </>
  );
};

const paragraphStyle = {
  color: "#374151",
  fontSize: "0.95rem",
  mb: 1.5,
  fontFamily: "montserrat, inter",
};

const listStyle = {
  pl: 3,
  color: "#374151",
  fontSize: "0.95rem",
  "& li": {
    mb: 0.8,
  },
};

export default page;
