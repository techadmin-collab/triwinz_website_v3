import { Box, Container, Typography } from "@mui/material";
import React from "react";

const Section = ({ title, children }) => (
  <Box sx={{ mb: 4, fontFamily: "montserrat, inter" }}>
    <Typography fontWeight={700} sx={{ fontSize: "1.15rem", mb: 1.2 }}>
      {title}
    </Typography>
    {children}
  </Box>
);

const Bullet = ({ children }) => (
  <Typography
    component="li"
    sx={{
      ml: 2,
      mb: 0.8,
      color: "#374151",
      fontFamily: "montserrat, inter",
    }}
  >
    {children}
  </Typography>
);

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
            Privacy Policy
          </Typography>
        </Box>
      </Box>

      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Box
          sx={{
            maxWidth: 1250,
            width: "100%",
            mx: "auto",
            px: { xs: 2, md: 4 },
          }}
        >
          {/* Introduction */}
          <Section title="Introduction">
            <Typography sx={{ color: "#374151", mb: 2 }}>
              This Privacy Policy explains how we collect, use, and protect your
              personal information when you access or use this website. We are
              committed to safeguarding your privacy and ensuring the security
              of your data.
            </Typography>

            <Typography sx={{ color: "#374151", mb: 2 }}>
              By using this website, you agree to the terms outlined in this
              Privacy Policy. If you do not agree with the terms, please
              discontinue using the website.
            </Typography>

            <Typography sx={{ color: "#374151" }}>
              We may update this policy from time to time. Please review this
              page periodically for any changes.
            </Typography>
          </Section>

          {/* Information We Collect */}
          <Section title="Information We Collect">
            <Typography sx={{ color: "#374151", mb: 1.5 }}>
              We may collect the following information:
            </Typography>

            <Box component="ul" sx={{ pl: 0 }}>
              <Bullet>
                <strong>Personal Information:</strong> Such as name, job title,
                and contact details (e.g., email address).
              </Bullet>
              <Bullet>
                <strong>Demographic Information:</strong> Including preferences,
                interests, and location data (e.g., postcode).
              </Bullet>
              <Bullet>
                <strong>Additional Information:</strong> Relevant to surveys,
                feedback, or promotional offers.
              </Bullet>
            </Box>
          </Section>

          {/* How We Use */}
          <Section title="How We Use Your Information">
            <Typography sx={{ color: "#374151", mb: 1.5 }}>
              The information we collect is used to:
            </Typography>

            <Box component="ul" sx={{ pl: 0 }}>
              <Bullet>Maintain internal records.</Bullet>
              <Bullet>
                Improve our products, services, and website functionality.
              </Bullet>
              <Bullet>
                Send periodic promotional communications, special offers, or
                updates.
              </Bullet>
              <Bullet>
                Conduct market research via email, phone, or other contact
                methods.
              </Bullet>
              <Bullet>
                Customize the website experience based on your preferences.
              </Bullet>
            </Box>
          </Section>

          {/* Security */}
          <Section title="Security">
            <Typography sx={{ color: "#374151" }}>
              We implement appropriate physical, electronic, and managerial
              measures to safeguard your personal information from unauthorized
              access, use, or disclosure.
            </Typography>
          </Section>

          {/* Cookies */}
          <Section title="Cookies">
            <Typography sx={{ color: "#374151", mb: 1.5 }}>
              Cookies are small files stored on your device to enhance your
              browsing experience. We use cookies to:
            </Typography>

            <Box component="ul" sx={{ pl: 0 }}>
              <Bullet>Analyze website traffic and user behavior.</Bullet>
              <Bullet>
                Customize website functionality based on your preferences.
              </Bullet>
            </Box>

            <Typography sx={{ color: "#374151", mt: 1.5 }}>
              You can accept or decline cookies through your browser settings.
              Declining cookies may limit certain website features.
            </Typography>
          </Section>

          {/* External Links */}
          <Section title="Links to Other Websites">
            <Typography sx={{ color: "#374151" }}>
              This website may include links to external websites. We are not
              responsible for the privacy practices or content of such websites.
              Please review their privacy policies when visiting.
            </Typography>
          </Section>

          {/* Managing Info */}
          <Section title="Managing Your Personal Information">
            <Typography sx={{ color: "#374151", mb: 1.5 }}>
              You may restrict the collection or use of your personal
              information by:
            </Typography>

            <Box component="ul" sx={{ pl: 0 }}>
              <Bullet>
                Indicating your preferences when filling out forms on the
                website.
              </Bullet>
              <Bullet>
                Contacting us to withdraw consent for direct marketing
                communications.
              </Bullet>
            </Box>

            <Typography sx={{ color: "#374151", mt: 1.5 }}>
              We will not sell, lease, or distribute your personal information
              to third parties without your permission, unless required by law.
            </Typography>
          </Section>

          {/* Corrections */}
          <Typography
            sx={{ color: "#374151", mb: 2, fontFamily: "montserrat, inter" }}
          >
            If you believe that the information we hold about you is incorrect
            or incomplete, please contact us promptly to make corrections.
          </Typography>

          <Typography
            sx={{ color: "#374151", mb: 3, fontFamily: "montserrat, inter" }}
          >
            If you have questions or concerns regarding this Privacy Policy,
            please use the contact details provided on this website.
          </Typography>

          {/* Footer Note */}
          <Typography
            fontWeight={600}
            sx={{ color: "#111827", fontFamily: "montserrat, inter" }}
          >
            Triwinz Technologies Pvt Ltd.
          </Typography>
          <Typography
            sx={{ color: "#374151", fontFamily: "montserrat, inter" }}
          >
            reserves the right to amend this Privacy Policy at any time.
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default page;
