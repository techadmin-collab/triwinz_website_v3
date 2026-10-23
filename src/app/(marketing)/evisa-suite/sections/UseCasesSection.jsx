import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import NationalVisaSystems from "../icons/NationalVisaSystems";
import ConsularVisa from "../icons/Embassy/ConsularVisa";
import PilgrimageAndGroup from "../icons/PilgrimageAndGroup";
import B2BAggregators from "../icons/B2BAggregators";
import EventSpecificVisa from "../icons/EventSpecificVisa";

const useCases = [
  {
    title: "National Visa Systems",
    description:
      "Complete digitization of national-level visa processing infrastructure.",
    icon: <NationalVisaSystems />,
  },
  {
    title: "Embassy/Consular Visa Processing",
    description:
      "Streamlined visa management for embassies and consulates worldwide.",
    icon: <ConsularVisa />,
  },
  {
    title: "Pilgrimage & Group Travel Handling",
    description:
      "Specialized workflows for large-scale religious and group travel visas.",
    icon: <PilgrimageAndGroup />,
  },
  {
    title: "B2B Aggregators & Visa Partners",
    description:
      "White-label solutions for visa facilitation partners and agents.",
    icon: <B2BAggregators />,
  },
  {
    title: "Event-Specific Visa Programs",
    description:
      "Temporary visa systems for conferences, sports events, and exhibitions.",
    icon: <EventSpecificVisa />,
  },
];

export default function UseCasesSection() {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
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
            xl: "xl",
          },
        }}
      >
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography
            sx={{ fontSize: { xs: 24, md: 48 } }}
            fontWeight={700}
            gutterBottom
          >
            Use Cases
          </Typography>
          <Typography color="text.secondary" fontWeight={600}>
            Versatile solutions for diverse visa processing requirements
          </Typography>
        </Box>

        {/* Cards */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 4,
          }}
        >
          {useCases.map((item, index) => (
            <Box
              key={index}
              sx={{
                flex: {
                  xs: "1 1 100%",
                  sm: "1 1 calc(50% - 32px)",
                  md: "1 1 calc(33.333% - 32px)",
                },
                maxWidth: {
                  xs: "100%",
                  sm: "calc(50% - 32px)",
                  md: "calc(33.333% - 32px)",
                },
                display: "flex",
              }}
            >
              <Card
                elevation={0}
                sx={{
                  flexGrow: 1,
                  borderRadius: 3,
                  border: "1px solid #eee",
                  textAlign: "center",
                  p: 3,
                  boxShadow: "0px 4px 20px rgba(0,0,0,0.06)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0px 10px 30px rgba(0,0,0,0.12)",
                    transform: "translateY(-4px)",
                    backgroundImage:
                      "linear-gradient(122deg, #5014d2ff 0%, #dd3ca7ff 100%)",
                    "&:hover .MuiTypography-root": {
                      color: "#fff",
                    },
                    transition: "all 0.3s ease",
                  },
                }}
              >
                <CardContent>
                  <Avatar
                    sx={{
                      mx: "auto",
                      mb: 2,
                      width: 56,
                      height: 56,
                      bgcolor: "#F2ECFF",
                      color: "#7C4DFF",
                    }}
                  >
                    {item.icon}
                  </Avatar>

                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {item.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
