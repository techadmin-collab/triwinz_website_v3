"use client";

import {
  Box,
  Container,
  Typography,
  Grid,
  Avatar,
  Stack,
  Link as MuiLink,
} from "@mui/material";
import { useState, useRef } from "react";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

/* ------------------ COMPONENT ------------------ */

// Team members come from the database (Admin -> Team), passed in by the About page.
// Fields: name, role, bio (array of paragraphs), photoUrl, linkedin
export default function TeamSection({ members = [] }) {
  const teamMembers = members;
  const [selectedMember, setSelectedMember] = useState(teamMembers[0] || null);
  const topSectionRef = useRef(null);

  if (!selectedMember) return null;

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        // backgroundImage: "linear-gradient(122deg, #1D5758 0%, #2BD1C7 100%)",
        color: "#000",
        fontFamily: "montserrat, inter",
      }}
    >
      <Container maxWidth="lg">
        {/* ================= CEO MESSAGE ================= */}
        <Box
          ref={topSectionRef}
          sx={{
            display: "flex",
            scrollMarginTop: "100px",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          {/* Image */}
          <Box>
            <Box
              component="img"
              src={selectedMember.photoUrl || undefined}
              alt={selectedMember.name}
              sx={{
                minWidth: 320,
                height: 420, // 👈 fixed height
                borderRadius: 3,
                objectFit: "cover", // 👈 prevents stretching
                objectPosition: "center",
                transition: "transform 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            />
          </Box>
          {/* Text */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h5" fontWeight={700} mb={2}>
              {selectedMember.role}
            </Typography>

            {(selectedMember.bio || []).map((para, index) => (
              <Typography
                key={index}
                sx={{ opacity: 0.9, lineHeight: 1.8, mb: 2 }}
              >
                {para}
              </Typography>
            ))}

            <Box>
              <Typography fontWeight={600} mt={3}>
                — {selectedMember.name}
              </Typography>

              <Typography sx={{ opacity: 0.7 }}>
                {selectedMember.role}
              </Typography>

              {/* <Stack direction="row" spacing={2} mt={1}> */}
              {/* <MuiLink href="#" underline="hover" color="primary">
                  <LinkedInIcon />
                </MuiLink> */}
              {/* <MuiLink href="#" underline="hover" color="primary">
                Instagram
              </MuiLink> */}
              {/* </Stack> */}
            </Box>
          </Box>
        </Box>

        {/* ================= TEAM ================= */}
        <Typography
          variant="h4"
          fontWeight={800}
          textAlign="center"
          my={1}
          mt={10}
        >
          Leadership & Core Delivery Team
        </Typography>

        <Box
          sx={{
            overflow: "hidden",
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          <Grid
            container
            spacing={4}
            sx={{
              flexWrap: "nowrap", // 👈 force one row
              width: "max-content",
              animation: "scrollX 25s linear infinite",
              py: 4,
              "&:hover": {
                animationPlayState: "paused", // 👈 pause on hover (nice UX)
              },
            }}
          >
            {[...teamMembers, ...teamMembers].map((member, index) => (
              <Grid
                item
                key={index}
                onClick={() => {
                  setSelectedMember(member);

                  // smooth scroll to top section
                  topSectionRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                sx={{ cursor: "pointer" }}
              >
                <Box textAlign="center">
                  <Avatar
                    src={member.photoUrl || undefined}
                    alt={member.name}
                    sx={{
                      width: 200,
                      height: 280,
                      mx: "auto",
                      borderRadius: 2,
                      mb: 2,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />

                  <Typography fontWeight={600}>{member.name}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7, width: 250 }}>
                    {member.role}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
