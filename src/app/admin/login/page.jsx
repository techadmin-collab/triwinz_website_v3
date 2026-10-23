"use client";

import { Suspense, useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import {
  getFirstAllowedHref,
  hasAnyModuleAccess,
} from "../../../lib/permissions";

const fieldSx = {
  mb: 2,
  "& .MuiInputBase-root": {
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 1.5,
    color: "#fff",
  },
  "& .MuiInputBase-input": {
    color: "#fff",
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.75)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#fff",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255,255,255,0.28)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255,255,255,0.45)",
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255,255,255,0.7)",
  },
  "& .MuiIconButton-root": {
    color: "rgba(255,255,255,0.8)",
  },
};

function LoginLoading() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(122deg, #5014D2 0%, #DD3CA7 100%)",
      }}
    >
      <CircularProgress size={28} sx={{ color: "#fff" }} />
    </Box>
  );
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [info, setInfo] = useState("");

  useEffect(() => {
    if (searchParams.get("passwordChanged") === "1") {
      setInfo("Password updated successfully. Please sign in again.");
    }
  }, [searchParams]);

  useEffect(() => {
    const shouldClear =
      searchParams.get("clear") === "1" ||
      searchParams.get("logout") === "1";

    if (shouldClear) {
      setClearing(true);
      signOut({ callbackUrl: "/admin/login" });
      return;
    }

    if (status !== "authenticated") return;

    // Authenticated but no modules (or stale cookie) → clear session to stop loops.
    if (!hasAnyModuleAccess(session)) {
      setClearing(true);
      signOut({ callbackUrl: "/admin/login" });
      return;
    }

    router.replace(getFirstAllowedHref(session));
  }, [status, session, router, searchParams]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.refresh();
    router.replace("/admin");
  }

  if (clearing || status === "authenticated" || status === "loading") {
    return <LoginLoading />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        py: 4,
        background: "linear-gradient(122deg, #5014D2 0%, #DD3CA7 100%)",
        fontFamily: "montserrat, inter, system-ui, sans-serif",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 400 }}>
        <Box
          sx={{
            backgroundColor: "#838383CC",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.28)",
            borderRadius: 3,
            p: { xs: 3, sm: 4 },
            boxShadow: "0 20px 50px rgba(15, 17, 21, 0.18)",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box
              sx={{
                position: "relative",
                width: 220,
                height: 96,
                mx: "auto",
                mb: 2,
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
            <Typography
              sx={{ mt: 0.5, fontSize: "0.875rem", color: "rgba(255,255,255,0.8)" }}
            >
              Enter your credentials to continue
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            {info && (
              <Alert
                severity="success"
                sx={{
                  mb: 2,
                  borderRadius: 1.5,
                  bgcolor: "rgba(220, 252, 231, 0.95)",
                }}
              >
                {info}
              </Alert>
            )}
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  borderRadius: 1.5,
                  bgcolor: "rgba(254, 226, 226, 0.92)",
                }}
              >
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              required
              type="email"
              label="Email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={fieldSx}
              size="small"
            />

            <TextField
              fullWidth
              required
              type={showPassword ? "text" : "password"}
              label="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ ...fieldSx, mb: 2.5 }}
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      aria-label="Toggle password visibility"
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffOutlinedIcon fontSize="small" />
                      ) : (
                        <VisibilityOutlinedIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              disableElevation
              sx={{
                py: 1.5,
                px: 5,
                textTransform: "none",
                fontWeight: 500,
                fontSize: "16px",
                lineHeight: 1,
                borderRadius: "10px",
                color: "#fff",
                backgroundImage:
                  "linear-gradient(96deg, #5014D2 0%, #DD3CA7 100%)",
                "&:hover": {
                  backgroundImage:
                    "linear-gradient(96deg, #4310b3 0%, #c43393 100%)",
                },
                "&.Mui-disabled": {
                  color: "#fff",
                  backgroundImage:
                    "linear-gradient(96deg, #5014D2 0%, #DD3CA7 100%)",
                  opacity: 0.75,
                },
              }}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : (
                "Sign in"
              )}
            </Button>
          </Box>
        </Box>

        <Typography
          component={Link}
          href="/"
          sx={{
            display: "block",
            mt: 2.5,
            textAlign: "center",
            fontSize: "0.875rem",
            color: "rgba(255,255,255,0.85)",
            textDecoration: "none",
            "&:hover": { color: "#fff" },
          }}
        >
          ← Back to website
        </Typography>
      </Box>
    </Box>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <AdminLoginForm />
    </Suspense>
  );
}
