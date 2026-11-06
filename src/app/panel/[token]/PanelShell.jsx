"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Avatar,
  Badge,
  Box,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import { BRAND } from "../../../lib/brand";

const DRAWER_WIDTH = 248;

const PanelContext = createContext(null);

/** { token, base, me, today, counts, refresh } for pages inside the panel portal */
export function usePanel() {
  return useContext(PanelContext);
}

export default function PanelShell({ token, children }) {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [state, setState] = useState({ loading: true, error: "", me: null, today: null, counts: null });

  const base = `/panel/${token}`;

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/panel/${encodeURIComponent(token)}`, { cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState((s) => ({ ...s, loading: false, error: json.error || "This link is no longer valid." }));
        return;
      }
      setState({ loading: false, error: "", me: json.interviewer, today: json.today, counts: json.counts });
    } catch {
      setState((s) => ({
        ...s,
        loading: false,
        error: s.me ? s.error : "We couldn't load this page. Please check your connection and refresh.",
      }));
    }
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (state.loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", bgcolor: BRAND.pageBg }}>
        <CircularProgress size={30} sx={{ color: BRAND.primary }} />
      </Box>
    );
  }

  if (state.error && !state.me) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: BRAND.pageBg, display: "grid", placeItems: "center", p: 2 }}>
        <Paper elevation={0} sx={{ maxWidth: 440, p: 4, textAlign: "center", borderRadius: 3, border: "1px solid #e5eaea" }}>
          <Box sx={{ position: "relative", width: 150, height: 56, mx: "auto", mb: 2 }}>
            <Image src="/og-image.webp" alt="TriWinz logo" fill style={{ objectFit: "contain" }} />
          </Box>
          <LinkOffIcon sx={{ fontSize: 36, color: "#9ca3af" }} />
          <Typography sx={{ mt: 1, fontWeight: 800, fontSize: "1.1rem", color: "#111" }}>Link not available</Typography>
          <Typography sx={{ mt: 1, color: "#6b7280", fontSize: "0.92rem" }}>{state.error}</Typography>
        </Paper>
      </Box>
    );
  }

  const { me, counts } = state;
  const navItems = [
    { label: "Overview", href: base, icon: DashboardOutlinedIcon, exact: true },
    { label: "My interviews", href: `${base}/interviews`, icon: EventNoteOutlinedIcon, badge: counts?.needsFeedback || 0 },
    { label: "My availability", href: `${base}/availability`, icon: CalendarMonthOutlinedIcon },
  ];
  const isActive = (item) => (item.exact ? pathname === item.href : pathname.startsWith(item.href));
  const pageTitle = navItems.find(isActive)?.label || "Interview panel";
  const initials = me.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");

  const nav = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", background: BRAND.sidebarBg, color: "#fff" }}>
      <Box sx={{ px: 2, py: 2, minHeight: 96, display: "grid", placeItems: "center" }}>
        <Box sx={{ position: "relative", width: 190, height: 74 }}>
          <Image src="/og-image.webp" alt="TriWinz logo" fill priority style={{ objectFit: "contain" }} />
        </Box>
      </Box>
      <Typography sx={{ px: 2.5, pb: 1, fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.1em", color: "rgba(255,255,255,0.6)" }}>
        INTERVIEW PANEL
      </Typography>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.14)" }} />
      <List sx={{ flex: 1, px: 1.25, py: 2 }}>
        {navItems.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={active}
              sx={{
                borderRadius: 1.5,
                mb: 0.5,
                py: 1.1,
                px: 2,
                color: active ? "#fff" : "rgba(255,255,255,0.78)",
                "&.Mui-selected": { bgcolor: "rgba(255,255,255,0.16)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.22)" },
                "&.Mui-selected:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 38, color: "inherit" }}>
                {item.badge ? (
                  <Badge
                    badgeContent={item.badge}
                    max={99}
                    sx={{ "& .MuiBadge-badge": { bgcolor: BRAND.accent, color: "#0b2b2c", fontSize: "0.62rem", height: 16, minWidth: 16, fontWeight: 800 } }}
                  >
                    <Icon sx={{ fontSize: 20 }} />
                  </Badge>
                ) : (
                  <Icon sx={{ fontSize: 20 }} />
                )}
              </ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: active ? 700 : 500 }} />
            </ListItemButton>
          );
        })}
      </List>
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.25, borderTop: "1px solid rgba(255,255,255,0.14)" }}>
        <Avatar sx={{ width: 34, height: 34, bgcolor: "rgba(255,255,255,0.18)", fontSize: "0.8rem", fontWeight: 800 }}>{initials}</Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: "0.84rem", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {me.name}
          </Typography>
          <Typography sx={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.7)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {[me.designation, me.company].filter(Boolean).join(" · ") || "Panel member"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <PanelContext.Provider value={{ token, base, me, today: state.today, counts, refresh }}>
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: BRAND.pageBg }}>
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
                bgcolor: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(10px)",
                borderBottom: "1px solid rgba(29, 87, 88, 0.1)",
              }}
            >
              <IconButton onClick={() => setMobileOpen(true)} size="small" sx={{ color: BRAND.primary }} aria-label="Open menu">
                <MenuIcon />
              </IconButton>
              <Typography fontWeight={700} sx={{ flex: 1, color: "#111" }}>
                {pageTitle}
              </Typography>
            </Box>
            <Drawer
              open={mobileOpen}
              onClose={() => setMobileOpen(false)}
              PaperProps={{ sx: { width: DRAWER_WIDTH, background: BRAND.sidebarBg, border: 0 } }}
            >
              {nav}
            </Drawer>
          </>
        ) : (
          <Box
            sx={{
              width: DRAWER_WIDTH,
              flexShrink: 0,
              position: "fixed",
              inset: "0 auto 0 0",
              borderRight: "1px solid rgba(29, 87, 88, 0.12)",
              zIndex: 1100,
            }}
          >
            {nav}
          </Box>
        )}

        <Box sx={{ flex: 1, ml: { md: `${DRAWER_WIDTH}px` }, width: "100%", minWidth: 0 }}>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1.5,
              px: 4,
              py: 1.75,
              bgcolor: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(10px)",
              borderBottom: "1px solid rgba(29, 87, 88, 0.1)",
            }}
          >
            <Typography sx={{ fontWeight: 800, color: "#111" }}>{pageTitle}</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ textAlign: "right" }}>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#111" }}>{me.name}</Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>TriWinz interview panel</Typography>
              </Box>
              <Avatar sx={{ width: 36, height: 36, backgroundImage: BRAND.gradient, fontSize: "0.85rem", fontWeight: 700 }}>{initials}</Avatar>
            </Box>
          </Box>
          <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, pt: { xs: 9, md: 3.5 }, pb: 5, maxWidth: 1200, mx: "auto" }}>{children}</Box>
        </Box>
      </Box>
    </PanelContext.Provider>
  );
}
