"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  useMediaQuery,
  Avatar,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState } from "react";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import { BRAND } from "../../../lib/brand";
import { hasModuleAccess } from "../../../lib/permissions";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: DashboardOutlinedIcon,
    module: "dashboard",
  },
  {
    label: "Jobs",
    href: "/admin/jobs",
    icon: WorkOutlineIcon,
    module: "jobs",
  },
  {
    label: "Applications",
    href: "/admin/applications",
    icon: AssignmentIndOutlinedIcon,
    module: "applications",
  },
  {
    label: "Training",
    href: "/admin/training",
    icon: SchoolOutlinedIcon,
    module: "training",
  },
  {
    label: "Contacts",
    href: "/admin/contacts",
    icon: MailOutlineIcon,
    module: "contacts",
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: PeopleOutlineIcon,
    module: "users",
  },
];

const drawerWidthExpanded = 264;
const drawerWidthCollapsed = 80;

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const { data: session } = useSession();

  const visibleNavItems = navItems.filter((item) =>
    hasModuleAccess(session, item.module),
  );

  const desktopWidth = sidebarExpanded
    ? drawerWidthExpanded
    : drawerWidthCollapsed;

  async function handleSignOut() {
    setSigningOut(true);
    await signOut({ callbackUrl: "/admin/login" });
  }

  const pageTitle =
    visibleNavItems.find((item) =>
      item.href === "/admin"
        ? pathname === "/admin"
        : pathname.startsWith(item.href),
    )?.label ||
    (pathname.startsWith("/admin/account") ? "Account" : "Admin");

  const footerActions = [
    {
      label: "Account",
      href: "/admin/account",
      icon: ManageAccountsOutlinedIcon,
      active: pathname.startsWith("/admin/account"),
      onClick: () => setMobileOpen(false),
    },
    {
      label: "View website",
      href: "/",
      icon: OpenInNewIcon,
      external: true,
    },
    {
      label: "Sign out",
      icon: LogoutIcon,
      onClick: () => {
        setMobileOpen(false);
        setSignOutOpen(true);
      },
    },
  ];

  const nav = (collapsed) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: BRAND.sidebarBg,
        color: "#fff",
        position: "relative",
      }}
    >
      <Box
        sx={{
          px: collapsed ? 1 : 2,
          py: collapsed ? 1.5 : 2,
          display: "flex",
          flexDirection: collapsed ? "column" : "row",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: collapsed ? 0 : 1,
          minHeight: collapsed ? 64 : 96,
        }}
      >
        {!collapsed ? (
          <Box
            sx={{
              position: "relative",
              width: 200,
              height: 78,
              flexShrink: 0,
              mx: "auto",
            }}
          >
            <Image
              src="/og-image.webp"
              alt="Triwinz logo"
              fill
              priority
              style={{ objectFit: "contain" }}
            />
          </Box>
        ) : null}

        {!isMobile ? (
          <IconButton
            aria-label={collapsed ? "Expand sidebar" : "Minimize sidebar"}
            onClick={() => setSidebarExpanded((prev) => !prev)}
            size="small"
            sx={{
              color: "#fff",
              bgcolor: "rgba(255,255,255,0.12)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.22)" },
              flexShrink: 0,
            }}
          >
            {collapsed ? (
              <ChevronRightIcon fontSize="small" />
            ) : (
              <ChevronLeftIcon fontSize="small" />
            )}
          </IconButton>
        ) : null}
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.14)" }} />

      <List sx={{ flex: 1, px: collapsed ? 0.75 : 1.25, py: 2 }}>
        {visibleNavItems.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          const button = (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={active}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 1.5,
                mb: 0.5,
                py: 1.1,
                px: collapsed ? 1 : 2,
                justifyContent: collapsed ? "center" : "flex-start",
                color: active ? "#fff" : "rgba(255,255,255,0.78)",
                "&.Mui-selected": {
                  bgcolor: "rgba(255,255,255,0.16)",
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.22)",
                },
                "&.Mui-selected:hover": {
                  bgcolor: "rgba(255,255,255,0.2)",
                },
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: collapsed ? 0 : 38,
                  color: "inherit",
                  justifyContent: "center",
                }}
              >
                <Icon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              {!collapsed ? (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                    fontWeight: active ? 700 : 500,
                  }}
                />
              ) : null}
            </ListItemButton>
          );

          return collapsed ? (
            <Tooltip key={item.href} title={item.label} placement="right">
              {button}
            </Tooltip>
          ) : (
            button
          );
        })}
      </List>

      <Box
        sx={{
          p: collapsed ? 1 : 2,
          display: "flex",
          flexDirection: "column",
          alignItems: collapsed ? "center" : "stretch",
          gap: 0.5,
        }}
      >
        {footerActions.map((action) => {
          const Icon = action.icon;
          const sharedSx = {
            justifyContent: collapsed ? "center" : "flex-start",
            minWidth: collapsed ? 44 : undefined,
            width: collapsed ? 44 : "100%",
            textTransform: "none",
            color: action.active ? "#fff" : "rgba(255,255,255,0.78)",
            bgcolor: action.active ? "rgba(255,255,255,0.16)" : "transparent",
            px: collapsed ? 1 : undefined,
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)", color: "#fff" },
          };

          const control = action.href ? (
            <Button
              key={action.label}
              component={Link}
              href={action.href}
              target={action.external ? "_blank" : undefined}
              startIcon={collapsed ? undefined : <Icon sx={{ fontSize: 16 }} />}
              onClick={action.onClick}
              sx={sharedSx}
              aria-label={action.label}
            >
              {collapsed ? <Icon sx={{ fontSize: 20 }} /> : action.label}
            </Button>
          ) : (
            <Button
              key={action.label}
              startIcon={collapsed ? undefined : <Icon sx={{ fontSize: 16 }} />}
              onClick={action.onClick}
              sx={sharedSx}
              aria-label={action.label}
            >
              {collapsed ? <Icon sx={{ fontSize: 20 }} /> : action.label}
            </Button>
          );

          return collapsed ? (
            <Tooltip key={action.label} title={action.label} placement="right">
              {control}
            </Tooltip>
          ) : (
            control
          );
        })}
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: BRAND.pageBg,
        fontFamily: "montserrat, inter, system-ui, sans-serif",
      }}
    >
      {isMobile ? (
        <>
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1200,
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 1.25,
              bgcolor: "rgba(255,255,255,0.88)",
              backdropFilter: "blur(10px)",
              borderBottom: "1px solid rgba(80, 20, 210, 0.1)",
            }}
          >
            <IconButton
              onClick={() => setMobileOpen(true)}
              size="small"
              sx={{ color: BRAND.primary }}
            >
              <MenuIcon />
            </IconButton>
            <Typography fontWeight={700} sx={{ flex: 1, color: "#111" }}>
              {pageTitle}
            </Typography>
          </Box>
          <Drawer
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            PaperProps={{
              sx: {
                width: drawerWidthExpanded,
                height: "100%",
                background: BRAND.sidebarBg,
                border: 0,
              },
            }}
          >
            {nav(false)}
          </Drawer>
        </>
      ) : (
        <Box
          sx={{
            width: desktopWidth,
            flexShrink: 0,
            position: "fixed",
            inset: "0 auto 0 0",
            borderRight: "1px solid rgba(80, 20, 210, 0.12)",
            transition: "width 0.2s ease",
            zIndex: 1100,
          }}
        >
          {nav(!sidebarExpanded)}
        </Box>
      )}

      <Box
        sx={{
          flex: 1,
          ml: { md: `${desktopWidth}px` },
          width: "100%",
          minWidth: 0,
          transition: "margin-left 0.2s ease",
        }}
      >
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 1.5,
            px: 4,
            py: 1.75,
            bgcolor: "rgba(255,255,255,0.82)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(80, 20, 210, 0.1)",
          }}
        >
          <Box sx={{ textAlign: "right" }}>
            <Typography
              sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#111" }}
            >
              {session?.user?.name || "Admin"}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
              {session?.user?.email || "Signed in"}
              {session?.user?.role ? ` · ${session.user.role}` : ""}
            </Typography>
          </Box>
          <Avatar
            component={Link}
            href="/admin/account"
            sx={{
              width: 36,
              height: 36,
              backgroundImage: BRAND.gradient,
              fontSize: "0.85rem",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            {(session?.user?.name || "A").charAt(0)}
          </Avatar>
        </Box>

        <Box
          component="main"
          sx={{
            pt: { xs: 9, md: 0 },
            p: { xs: 2, md: 3.5 },
            width: "100%",
            maxWidth: "100%",
          }}
        >
          {children}
        </Box>
      </Box>

      <ConfirmDeleteDialog
        open={signOutOpen}
        title="Sign out?"
        description="You will need to sign in again to access the admin dashboard."
        confirmLabel="Sign out"
        confirmColor="inherit"
        loading={signingOut}
        onClose={() => setSignOutOpen(false)}
        onConfirm={handleSignOut}
      />
    </Box>
  );
}
