"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import AddLinkIcon from "@mui/icons-material/AddLink";
import { toast } from "react-hot-toast";
import { BRAND, brandButtonSx } from "../../../../lib/brand";

function when(value) {
  if (!value) return null;
  return new Date(value).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // older browsers / non-secure contexts
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    el.remove();
    return ok;
  }
}

/**
 * Share / manage a panel member's private availability link.
 * Props: interviewer (row from /api/admin/interviewers), onClose(), onChange(updatedFields)
 */
export default function AvailabilityLinkDialog({ interviewer, onClose, onChange }) {
  const [busy, setBusy] = useState("");
  const [confirm, setConfirm] = useState(""); // "regenerate" | "revoke"

  if (!interviewer) return null;
  const hasLink = Boolean(interviewer.portalUrl);

  async function run(action) {
    setBusy(action);
    try {
      const res = await fetch(`/api/admin/interviewers/${interviewer.id}/portal`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const json = await res.json().catch(() => ({}));
      if (json.id) onChange(json);
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      return json;
    } catch (err) {
      toast.error(err.message, { duration: 6000 });
      return null;
    } finally {
      setBusy("");
      setConfirm("");
    }
  }

  async function handleCopy() {
    const info = hasLink ? interviewer : await run("link");
    if (!info?.portalUrl) return;
    if (await copyText(info.portalUrl)) toast.success("Link copied");
    else toast.error("Couldn't copy. Select the link and copy it manually.");
  }

  async function handleEmail() {
    const info = await run("email");
    if (info) toast.success(`Link emailed to ${interviewer.email}`);
  }

  async function handleRegenerate() {
    const info = await run("regenerate");
    if (info) toast.success("New link created. The old link no longer works.");
  }

  async function handleRevoke() {
    const info = await run("revoke");
    if (info) toast.success("Link turned off");
  }

  const status = [
    interviewer.portalSentAt ? `Emailed ${when(interviewer.portalSentAt)}` : null,
    interviewer.portalSeenAt ? `Last opened ${when(interviewer.portalSeenAt)}` : hasLink ? "Not opened yet" : null,
  ].filter(Boolean);

  return (
    <Dialog open onClose={busy ? undefined : onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 800, pb: 0.5 }}>Panel page link</DialogTitle>
      <DialogContent>
        <Typography sx={{ color: "#6b7280", fontSize: "0.88rem", mb: 2 }}>
          <strong style={{ color: "#111" }}>{interviewer.name}</strong> can open this private link to see the interviews
          they&apos;re on, view the candidate&apos;s resume, give feedback and mark when they&apos;re free. No login
          needed. Feedback shows on each candidate&apos;s interview page.
        </Typography>

        {!interviewer.active ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            This panel member is inactive, so their link doesn&apos;t work. Switch on Active to share it.
          </Alert>
        ) : null}

        {hasLink ? (
          <>
            <TextField
              fullWidth
              size="small"
              value={interviewer.portalUrl}
              InputProps={{
                readOnly: true,
                sx: { fontSize: "0.82rem", bgcolor: "#f8fafb" },
                endAdornment: (
                  <InputAdornment position="end">
                    <Button size="small" startIcon={<ContentCopyIcon />} onClick={handleCopy} sx={{ textTransform: "none", fontWeight: 700, color: BRAND.primary }}>
                      Copy
                    </Button>
                  </InputAdornment>
                ),
              }}
              onFocus={(e) => e.target.select()}
            />
            {status.length ? (
              <Typography sx={{ mt: 1, fontSize: "0.75rem", color: "#6b7280" }}>{status.join(" · ")}</Typography>
            ) : null}
          </>
        ) : (
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#f8fafb", border: "1px dashed #d6dede", textAlign: "center" }}>
            <Typography sx={{ fontSize: "0.88rem", color: "#4b5563" }}>No link yet. Send or copy one to create it.</Typography>
          </Box>
        )}

        {!interviewer.email ? (
          <Typography sx={{ mt: 1.5, fontSize: "0.78rem", color: "#b45309" }}>
            No email address saved. Edit this panel member to add one, or copy the link and share it another way.
          </Typography>
        ) : null}

        {confirm ? (
          <Alert
            severity="warning"
            sx={{ mt: 2 }}
            action={
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <Button color="inherit" size="small" onClick={() => setConfirm("")} disabled={Boolean(busy)} sx={{ textTransform: "none" }}>
                  Cancel
                </Button>
                <Button
                  color="inherit"
                  size="small"
                  onClick={confirm === "regenerate" ? handleRegenerate : handleRevoke}
                  disabled={Boolean(busy)}
                  sx={{ textTransform: "none", fontWeight: 800 }}
                >
                  {confirm === "regenerate" ? "Create new link" : "Turn off"}
                </Button>
              </Box>
            }
          >
            {confirm === "regenerate"
              ? "The current link will stop working. Their saved availability is kept."
              : "The link will stop working until you create a new one. Their saved availability is kept."}
          </Alert>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, flexWrap: "wrap", gap: 1 }}>
        {hasLink ? (
          <Box sx={{ display: "flex", gap: 0.5, mr: "auto" }}>
            <Button
              size="small"
              startIcon={<AutorenewIcon />}
              onClick={() => setConfirm("regenerate")}
              disabled={Boolean(busy) || !interviewer.active}
              sx={{ textTransform: "none", fontWeight: 600, color: "#4b5563" }}
            >
              New link
            </Button>
            <Button
              size="small"
              startIcon={<LinkOffIcon />}
              onClick={() => setConfirm("revoke")}
              disabled={Boolean(busy)}
              sx={{ textTransform: "none", fontWeight: 600, color: "#b91c1c" }}
            >
              Turn off
            </Button>
          </Box>
        ) : null}
        <Button onClick={onClose} disabled={Boolean(busy)} sx={{ textTransform: "none", fontWeight: 600, color: "#4b5563" }}>
          Close
        </Button>
        {!hasLink ? (
          <Button
            startIcon={<AddLinkIcon />}
            onClick={handleCopy}
            disabled={Boolean(busy) || !interviewer.active}
            sx={{ textTransform: "none", fontWeight: 700, color: BRAND.primary, border: "1px solid rgba(29, 87, 88, 0.25)", px: 2 }}
          >
            Copy link
          </Button>
        ) : null}
        <Button
          variant="contained"
          disableElevation
          startIcon={<SendOutlinedIcon />}
          onClick={handleEmail}
          disabled={Boolean(busy) || !interviewer.email || !interviewer.active}
          sx={{ ...brandButtonSx, fontWeight: 700, px: 2 }}
        >
          {busy === "email" ? "Sending..." : interviewer.portalSentAt ? "Email again" : "Email link"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
