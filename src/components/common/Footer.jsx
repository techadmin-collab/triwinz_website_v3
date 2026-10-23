"use client";

import {
  Box,
  Typography,
  IconButton,
  Stack,
  Link as MuiLink,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import LanguageIcon from "@mui/icons-material/Language";
import BrushIcon from "@mui/icons-material/Brush";
import PinterestIcon from "@mui/icons-material/Pinterest";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import { usePathname } from "next/navigation";

import Image from "next/image";

import {
  ContactUsIcon,
  PrivacyPolicyIcon,
  TermsAndConditionsIcon,
} from "./SvgIcons";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <Box
      component="footer"
      sx={{
        borderTop: "1px solid #eee",
        py: 8,
        backgroundColor: "#fff",
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
            xl: "1440px",
          },
        }}
      >
        {/* Main Row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "center", md: "space-between" },
            flexWrap: "wrap",
            gap: 4,
          }}
        >
          {/* Left: Social Icons */}
          <Stack direction="row" spacing={1.5}>
            <SocialIcon
              icon={<InstagramIcon />}
              href="https://www.instagram.com/triwinz_tech?igsh=MXF6c2FycjMxZ2Vkdw=="
            />
            {/* <SocialIcon icon={<XIcon />} />
            <SocialIcon icon={<LanguageIcon />} />
            <SocialIcon icon={<BrushIcon />} />
            <SocialIcon icon={<PinterestIcon />} /> */}
            <SocialIcon
              icon={<LinkedInIcon />}
              href="https://www.linkedin.com/company/triwinz-technologies-india/"
              label="LinkedIn"
            />
            <SocialIcon
              icon={<FacebookIcon />}
              href="https://www.facebook.com/share/18Hr84Z4Mk/"
              label="Facebook"
            />
          </Stack>

          {/* Center: Links */}
          <Box sx={{ textAlign: "center" }}>
            <Stack
              direction="row"
              spacing={3}
              justifyContent="center"
              alignItems="center"
              sx={{ flexWrap: "wrap" }}
            >
              <FooterLink
                icon={<ContactUsIcon />}
                label="Contact Us"
                link="/contact-us"
              />
              <FooterLink
                icon={<PrivacyPolicyIcon />}
                label="Privacy & Policy"
                link="/privacy-policy"
              />
              <FooterLink
                icon={<TermsAndConditionsIcon />}
                label="Terms & Conditions"
                link="/terms-and-conditions"
              />
            </Stack>

            {/* Desktop copyright */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1.5, display: { xs: "none", md: "block" } }}
              fontWeight={500}
            >
              © {new Date().getFullYear()} TriWinz Technologies Pvt. Ltd. | All
              rights reserved.
            </Typography>
          </Box>

          {/* Right: Image */}
          <Image
            src="/Frame-59-1.webp"
            alt="CII"
            width={300}
            height={200}
            style={{ objectFit: "contain" }}
          />
        </Box>

        {/* Mobile copyright (VERY LAST) */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: { xs: "block", md: "none" },
            textAlign: "center",
            mt: 6,
          }}
        >
          © 2025 TriWinz Technologies Pvt. Ltd. | All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}

/* ---------- Helper Components ---------- */

function SocialIcon({ icon, href }) {
  return (
    <IconButton
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        width: 42,
        height: 42,
        borderRadius: "50%",
        background:
          "linear-gradient(#fff, #fff) padding-box, linear-gradient(135deg, #6d28d9, #ec4899) border-box",
        border: "1px solid transparent",
        color: "#111",
        transition: "all 0.3s ease",
        "&:hover": {
          color: "#6d28d9",
          transform: "translateY(-2px)",
        },
      }}
    >
      {icon}
    </IconButton>
  );
}

function FooterLink({ icon, label, link = "#" }) {
  return (
    <MuiLink
      href={link}
      underline="none"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        fontWeight: 600,
        color: "#111",
        transition: "color 0.3s ease",
        "&:hover": {
          color: "#6d28d9",
        },
      }}
    >
      {icon}
      {label}
    </MuiLink>
  );
}
