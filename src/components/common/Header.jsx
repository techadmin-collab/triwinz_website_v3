"use client";

import Link from "next/link";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Drawer, IconButton } from "@mui/material";
import { usePathname } from "next/navigation";
const TRAINING_PROGRAM_PATH = "/careers/intensive-corporate-training";

const menuItemStyle = {
  px: 2,
  py: 1.2,
  display: "block",
  textDecoration: "none",
  color: "#fff",
  fontWeight: 500,
  transition: "color 0.25s ease, background-color 0.25s ease",
  "&:hover": {
    color: "#000",
  },
};

const mobileLinkStyle = {
  justifyContent: "flex-start",
  color: "#000",
  py: 1.2,
};

const mobileSubLinkStyle = {
  justifyContent: "flex-start",
  color: "#fff",
  py: 0.8,
  fontWeight: 500,
  pl: 2,
  "&:hover": {
    color: "#000",
  },
};

const dropdownStyle = (open, width) => ({
  position: "absolute",
  top: "100%",
  left: 0,
  width,
  borderRadius: 2,
  backgroundColor: "#ACACACB8",
  color: "#fff",
  py: 1,
  zIndex: 1300,

  opacity: open ? 1 : 0,
  transform: open ? "translateY(6px)" : "translateY(0px)",
  transition: "opacity 0.2s ease, transform 0.2s ease",

  pointerEvents: open ? "auto" : "none",

  mt: "-4px",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-8px",
    left: 0,
    right: 0,
    height: "8px",
  },
});

export default function Header() {
  const [productOpen, setProductOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [careersOpen, setCareersOpen] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileCareersOpen, setMobileCareersOpen] = useState(false);

  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <AppBar
        position="fixed"
        elevation={1}
        className="mt-7 mb-7 h-12.5 rounded-xl"
        sx={{
          maxWidth: { sm: "1250px", xl: "xl" },
          mx: "auto",
          left: 0,
          right: 0,
          justifyContent: "center",
          alignContent: "center",
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#838383CC",
          fontFamily: "montserrat, inter",
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: "50px",
            px: 0.6,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link href="/">
            <Box
              sx={{
                position: "relative", // 👈 REQUIRED for fill
                width: 220,
                height: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 1,
                borderRadius: 2,
                cursor: "pointer",
              }}
            >
              <Image
                src="/og-image.webp"
                alt="Triwinz logo"
                fill
                priority
                style={{
                  objectFit: "contain",
                }}
              />
            </Box>
          </Link>

          {/* Navigation */}
          <Box sx={{ display: { xs: "none", lg: "flex" }, gap: 2 }}>
            <Button
              color="inherit"
              component={Link}
              href="/"
              sx={{
                color: "inherit",
                transition: "color 0.25s ease-in-out",
                "&:hover": {
                  color: "#000",
                },
              }}
            >
              Home
            </Button>
            <Button
              component={Link}
              href="/about"
              sx={{
                color: pathname === "/about" ? "#000" : "inherit",
                transition: "color 0.25s ease-in-out",
                "&:hover": {
                  color: "#000",
                },
              }}
            >
              About
            </Button>

            <Box
              onMouseEnter={() => setProductOpen(true)}
              onMouseLeave={() => setProductOpen(false)}
              sx={{ position: "relative" }}
            >
              <Button
                color="inherit"
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                  color: "inherit",
                  transition: "color 0.25s ease-in-out",
                  "&:hover": { color: "#000" },
                }}
              >
                Products
              </Button>

              {/* Dropdown */}
              <Box sx={dropdownStyle(productOpen, 200)}>
                <Box
                  component={Link}
                  href="/evisa-suite/"
                  sx={{
                    ...menuItemStyle,
                    color:
                      pathname === "/evisa-suite" ? "#000000a4" : "inherit",
                  }}
                >
                  eVisa Suite
                </Box>
                <Box
                  component={Link}
                  href="/india-domain-mart"
                  sx={{
                    ...menuItemStyle,
                    color:
                      pathname === "/india-domain-mart"
                        ? "#000000a4"
                        : "inherit",
                  }}
                >
                  India Domain Mart
                </Box>
                <Box
                  component={Link}
                  href="/triwinz-cloudkart"
                  sx={{
                    ...menuItemStyle,
                    color:
                      pathname === "/triwinz-cloudkart"
                        ? "#000000a4"
                        : "inherit",
                  }}
                >
                  TriWinz CloudKart
                </Box>
                <Box
                  component={Link}
                  href="/bisbuddy-erp"
                  sx={{
                    ...menuItemStyle,
                    color:
                      pathname === "/bisbuddy-erp" ? "#000000a4" : "inherit",
                  }}
                >
                  BisBuddy ERP
                </Box>
              </Box>
            </Box>

            <Box
              onMouseEnter={() => setServiceOpen(true)}
              onMouseLeave={() => setServiceOpen(false)}
              sx={{ position: "relative" }}
            >
              <Button
                color="inherit"
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                  color: "inherit",
                  transition: "color 0.25s ease-in-out",
                  "&:hover": { color: "#000" },
                }}
              >
                Services
              </Button>

              <Box sx={dropdownStyle(serviceOpen, 250)}>
                <Box
                  component={Link}
                  href="/it-digital-transformation"
                  sx={{
                    ...menuItemStyle,
                    color:
                      pathname === "/it-digital-transformation"
                        ? "#000000a4"
                        : "inherit",
                  }}
                >
                  IT & Digital Transformation
                </Box>
                <Box
                  component={Link}
                  href="/sap-consulting-support-services"
                  sx={{
                    ...menuItemStyle,
                    color:
                      pathname === "/sap-consulting-support-services"
                        ? "#000000a4"
                        : "inherit",
                  }}
                >
                  SAP Consulting & Support Services
                </Box>
                <Box
                  component={Link}
                  href="/cloud-and-web-infrastruture"
                  sx={{
                    ...menuItemStyle,
                    color:
                      pathname === "/cloud-and-web-infrastruture"
                        ? "#000000a4"
                        : "inherit",
                  }}
                >
                  Cloud and Web Infrastructure
                </Box>
                <Box
                  component={Link}
                  href="/custom-software-erp-development"
                  sx={{
                    ...menuItemStyle,
                    color:
                      pathname === "/custom-software-erp-development"
                        ? "#000000a4"
                        : "inherit",
                  }}
                >
                  Custom Software & ERP Development
                </Box>
                <Box
                  component={Link}
                  href="/egovernance-visa-platform-solutions"
                  sx={{
                    ...menuItemStyle,
                    color:
                      pathname === "/egovernance-visa-platform-solutions"
                        ? "#000000a4"
                        : "inherit",
                  }}
                >
                  eGovernance & Visa Platform Solutions
                </Box>
              </Box>
            </Box>

            <Button
              color="inherit"
              component={Link}
              href="/case-studies"
              sx={{
                color: "inherit",
                transition: "color 0.25s ease-in-out",
                "&:hover": {
                  color: "#000",
                },
              }}
            >
              Case Studies
            </Button>
            <Box
              onMouseEnter={() => setCareersOpen(true)}
              onMouseLeave={() => setCareersOpen(false)}
              sx={{ position: "relative" }}
            >
              <Button
                color="inherit"
                component={Link}
                href="/careers"
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                  color: pathname?.startsWith("/careers") ? "#000" : "inherit",
                  transition: "color 0.25s ease-in-out",
                  "&:hover": { color: "#000" },
                }}
              >
                Careers
              </Button>

              <Box sx={dropdownStyle(careersOpen, 290)}>
                <Box
                  component={Link}
                  href="/careers"
                  onClick={() => setCareersOpen(false)}
                  sx={{
                    ...menuItemStyle,
                    color: pathname === "/careers" ? "#000000a4" : "inherit",
                  }}
                >
                  Open Positions
                </Box>
                <Box
                  component={Link}
                  href={TRAINING_PROGRAM_PATH}
                  onClick={() => setCareersOpen(false)}
                  sx={{
                    ...menuItemStyle,
                    color:
                      pathname === TRAINING_PROGRAM_PATH ? "#000000a4" : "inherit",
                  }}
                >
                  Intensive Corporate Training Programme
                </Box>
              </Box>
            </Box>
            {/* <Button
              color="inherit"
              component={Link}
              href="/blogs"
              sx={{
                color: "inherit",
                transition: "color 0.25s ease-in-out",
                "&:hover": {
                  color: "#000",
                },
              }}
            >
              Blogs
            </Button> */}
          </Box>
          <Box>
            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{
                display: { xs: "flex", lg: "none" },
                color: "#fff",
                alignItems: "end",
                justifyContent: "end",
              }}
            >
              <MenuIcon />
            </IconButton>
            <Button
              color="inherit"
              component={Link}
              href="/contact-us"
              sx={{
                backgroundImage:
                  "linear-gradient(96deg, #5014D2 0%, #DD3CA7 100%)",
                borderRadius: "10px",
                px: 5,
                py: 1.5,
                color: "white",

                display: { xs: "none", lg: "flex" },
                alignItems: "center",
                justifyContent: "center",

                textTransform: "none", // optional (cleaner text)
                lineHeight: 1, // important for vertical centering
                fontWeight: "500",
                fontSize: "16px",
              }}
            >
              Connect Us
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        SlideProps={{
          timeout: {
            enter: 300,
            exit: 200,
          },
        }}
      >
        <Box sx={{ width: 350 }}>
          {/* Close */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#838383CC",
              // mb: 2,
            }}
          >
            <Link href="/">
              <Box
                sx={{
                  position: "relative", // 👈 REQUIRED for fill
                  width: 220,
                  height: 100,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                  cursor: "pointer",
                }}
              >
                <Image
                  src="/og-image.webp"
                  alt="Triwinz logo"
                  fill
                  priority
                  style={{
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Link>

            <IconButton onClick={() => setMobileOpen(false)}>
              <CloseIcon sx={{ color: "#fff" }} />
            </IconButton>
          </Box>

          {/* Links */}
          <Button
            component={Link}
            href="/"
            fullWidth
            sx={mobileLinkStyle}
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Button>

          <Button
            component={Link}
            href="/about"
            fullWidth
            sx={mobileLinkStyle}
            onClick={() => setMobileOpen(false)}
          >
            About Us
          </Button>

          {/* Products */}
          <Box>
            <Button
              fullWidth
              onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
              sx={{
                justifyContent: "space-between",
                color: "#000",
                py: 1.2,
              }}
              endIcon={
                <KeyboardArrowDownIcon
                  sx={{
                    transform: mobileProductsOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "0.2s",
                  }}
                />
              }
            >
              Products
            </Button>

            <Box
              sx={{
                maxHeight: mobileProductsOpen ? 400 : 0,
                overflow: "hidden",
                transition: "max-height 0.3s ease",
                backgroundColor: "#acacac4d",
              }}
            >
              <Button
                component={Link}
                href="/evisa-suite/"
                fullWidth
                sx={{
                  ...mobileSubLinkStyle,
                  color:
                    pathname === "/evisa-suite" ? "#000000a4" : "#000000a4",
                  fontWeight: pathname === "/evisa-suite" ? 700 : 600,
                }}
                onClick={() => setMobileOpen(false)}
              >
                eVisa Suite
              </Button>
              <Button
                component={Link}
                href="/india-domain-mart"
                fullWidth
                sx={{
                  ...mobileSubLinkStyle,
                  color:
                    pathname === "/india-domain-mart"
                      ? "#000000a4"
                      : "#000000a4",
                  fontWeight: pathname === "/india-domain-mart" ? 700 : 600,
                }}
                onClick={() => setMobileOpen(false)}
              >
                India Domain Mart
              </Button>
              <Button
                component={Link}
                href="/triwinz-cloudkart"
                fullWidth
                sx={{
                  ...mobileSubLinkStyle,
                  color:
                    pathname === "/triwinz-cloudkart"
                      ? "#000000a4"
                      : "#000000a4",
                  fontWeight: pathname === "/triwinz-cloudkart" ? 700 : 600,
                }}
                onClick={() => setMobileOpen(false)}
              >
                Triwinz CloudKart
              </Button>
              <Button
                component={Link}
                href="/bisbuddy-erp"
                fullWidth
                sx={{
                  ...mobileSubLinkStyle,
                  color:
                    pathname === "/bisbuddy-erp" ? "#000000a4" : "#000000a4",
                  fontWeight: pathname === "/bisbuddy-erp" ? 700 : 600,
                }}
                onClick={() => setMobileOpen(false)}
              >
                BisBuddy ERP
              </Button>
            </Box>
          </Box>

          {/* Services */}
          <Box>
            <Button
              fullWidth
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              sx={{
                justifyContent: "space-between",
                color: "#000",
                py: 1.2,
              }}
              endIcon={
                <KeyboardArrowDownIcon
                  sx={{
                    transform: mobileServicesOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "0.2s",
                  }}
                />
              }
            >
              Services
            </Button>

            <Box
              sx={{
                maxHeight: mobileServicesOpen ? 500 : 0,
                overflow: "hidden",
                transition: "max-height 0.3s ease",
                backgroundColor: "#acacac4d",
              }}
            >
              <Button
                component={Link}
                href="/it-digital-transformation"
                fullWidth
                sx={{
                  ...mobileSubLinkStyle,
                  color:
                    pathname === "/it-digital-transformation"
                      ? "#000000a4"
                      : "#000000a4",
                  fontWeight:
                    pathname === "/it-digital-transformation" ? 700 : 600,
                }}
                onClick={() => setMobileOpen(false)}
              >
                IT & Digital Transformation
              </Button>

              <Button
                component={Link}
                href="/sap-consulting-support-services"
                fullWidth
                sx={{
                  ...mobileSubLinkStyle,
                  color:
                    pathname === "/sap-consulting-support-services"
                      ? "#000000a4"
                      : "#000000a4",
                  fontWeight:
                    pathname === "/sap-consulting-support-services" ? 700 : 600,
                }}
                onClick={() => setMobileOpen(false)}
              >
                SAP Consulting & Support Services
              </Button>

              <Button
                component={Link}
                href="/cloud-and-web-infrastruture"
                fullWidth
                sx={{
                  ...mobileSubLinkStyle,
                  color:
                    pathname === "/cloud-and-web-infrastruture"
                      ? "#000000a4"
                      : "#000000a4",
                  fontWeight:
                    pathname === "/cloud-and-web-infrastruture" ? 700 : 600,
                }}
                onClick={() => setMobileOpen(false)}
              >
                Cloud and Web Infrastructure
              </Button>

              <Button
                component={Link}
                href="/custom-software-erp-development"
                fullWidth
                sx={{
                  ...mobileSubLinkStyle,
                  color:
                    pathname === "/custom-software-erp-development"
                      ? "#000000a4"
                      : "#000000a4",
                  fontWeight:
                    pathname === "/custom-software-erp-development" ? 700 : 600,
                }}
                onClick={() => setMobileOpen(false)}
              >
                Custom Software & ERP Development
              </Button>

              <Button
                component={Link}
                href="/egovernance-visa-platform-solutions"
                fullWidth
                sx={{
                  ...mobileSubLinkStyle,
                  color:
                    pathname === "/egovernance-visa-platform-solutions"
                      ? "#000000a4"
                      : "#000000a4",
                  fontWeight:
                    pathname === "/egovernance-visa-platform-solutions"
                      ? 700
                      : 600,
                }}
                onClick={() => setMobileOpen(false)}
              >
                eGovernance & Visa Platform Solutions
              </Button>
            </Box>
          </Box>

          {/* <Box>
            <Button
              component={Link}
              href="/blogs"
              fullWidth
              sx={mobileLinkStyle}
              onClick={() => setMobileOpen(false)}
            >
              Blog
            </Button>
          </Box> */}

          <Box>
            <Button
              component={Link}
              href="/case-studies"
              fullWidth
              sx={mobileLinkStyle}
              onClick={() => setMobileOpen(false)}
            >
              Case Studies
            </Button>
          </Box>

          {/* Careers */}
          <Box>
            <Button
              fullWidth
              onClick={() => setMobileCareersOpen(!mobileCareersOpen)}
              sx={{
                justifyContent: "space-between",
                color: "#000",
                py: 1.2,
              }}
              endIcon={
                <KeyboardArrowDownIcon
                  sx={{
                    transform: mobileCareersOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "0.2s",
                  }}
                />
              }
            >
              Careers
            </Button>

            <Box
              sx={{
                maxHeight: mobileCareersOpen ? 200 : 0,
                overflow: "hidden",
                transition: "max-height 0.3s ease",
                backgroundColor: "#acacac4d",
              }}
            >
              <Button
                component={Link}
                href="/careers"
                fullWidth
                sx={{
                  ...mobileSubLinkStyle,
                  color: "#000000a4",
                  fontWeight: pathname === "/careers" ? 700 : 600,
                }}
                onClick={() => setMobileOpen(false)}
              >
                Open Positions
              </Button>
              <Button
                component={Link}
                href={TRAINING_PROGRAM_PATH}
                fullWidth
                sx={{
                  ...mobileSubLinkStyle,
                  color: "#000000a4",
                  fontWeight: pathname === TRAINING_PROGRAM_PATH ? 700 : 600,
                }}
                onClick={() => setMobileOpen(false)}
              >
                Intensive Corporate Training Programme
              </Button>
            </Box>
          </Box>

          <Button
            component={Link}
            href="/contact-us"
            fullWidth
            sx={mobileLinkStyle}
            onClick={() => setMobileOpen(false)}
          >
            Contact Us
          </Button>

          <Box sx={{ mx: 2 }}>
            <Button
              component={Link}
              href="/contact-us"
              fullWidth
              sx={{
                mt: 2,
                backgroundImage:
                  "linear-gradient(96deg, #5014D2 0%, #DD3CA7 100%)",
                color: "#fff",
                borderRadius: "10px",
                py: 1.4,
                fontWeight: "500",
              }}
            >
              Connect Us
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
