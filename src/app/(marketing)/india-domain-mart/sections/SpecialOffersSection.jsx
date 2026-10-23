import { Box, Container, Typography } from "@mui/material";

const offers = [
  {
    title: "Free",
    description: "Domain + hosting for the first year (select packages)",
  },
  {
    title: "Custom",
    description: "Packages for agencies, resellers, and multi-site operators",
  },
  {
    title: "24/7",
    description: "Packages for agencies, resellers, and multi-site operators",
  },
];

export default function SpecialOffersSection() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        color: "#fff",
        background: "linear-gradient(122deg, #5014d2ff 0%, #dd3ca7ff 100%)",
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
        {/* Top Content */}
        <Box textAlign="center" mb={6}>
          <Typography
            fontWeight={800}
            gutterBottom
            sx={{
              fontSize: { xs: "1.9rem", sm: "2.4rem", md: "3rem" },
            }}
          >
            Ready to Transform Your Digital Presence?
          </Typography>

          <Typography
            sx={{
              maxWidth: 800,
              mx: "auto",
              opacity: 0.9,
              mb: 2,
              fontSize: { xs: "0.95rem", md: "1.05rem" },
              fontWeight: 600,
            }}
          >
            Whether you're a startup, a digital agency, an SME looking to go
            online, or an enterprise upgrading your web infrastructure
          </Typography>

          <Typography
            sx={{
              opacity: 0.95,
              fontWeight: 700,
            }}
          >
            IndiaDomainMart makes it easier to launch, run, and grow online
          </Typography>
        </Box>

        {/* Special Offers Title */}
        <Typography
          textAlign="center"
          fontWeight={700}
          mb={4}
          sx={{ fontSize: { xs: "1.3rem", md: "1.6rem" } }}
        >
          Special Offers
        </Typography>

        {/* Offers Card */}
        <Box
          sx={{
            backgroundColor: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(10px)",
            borderRadius: 4,
            p: { xs: 3, md: 4 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          {offers.map((offer, index) => (
            <Box
              key={index}
              sx={{
                flex: {
                  xs: "1 1 100%",
                  sm: "1 1 50%",
                  md: "1 1 33.333%",
                },
                textAlign: "center",
                px: 2,
              }}
            >
              <Typography
                fontWeight={800}
                sx={{
                  fontSize: { xs: "1.8rem", md: "2.2rem" },
                  mb: 1,
                }}
              >
                {offer.title}
              </Typography>

              <Typography
                sx={{
                  opacity: 0.95,
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  lineHeight: 1.6,
                  fontWeight: 600,
                }}
              >
                {offer.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
