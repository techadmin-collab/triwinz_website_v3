"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Slider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { brandButtonSx, BRAND } from "../../../lib/brand";

const MAX_ZOOM = 4;

/**
 * Crop an image to a fixed aspect ratio (no extra libraries).
 * Drag to move, use the slider / mouse wheel to zoom. The frame is always fully covered.
 *
 * Props:
 *  - open, src (object URL or image URL)
 *  - aspect: width / height (e.g. 5 / 7)
 *  - outputWidth: width of the exported image in px (height follows the aspect)
 *  - onCancel(), onDone(blob)
 */
export default function ImageCropDialog({
  open,
  src,
  aspect = 5 / 7,
  outputWidth = 900,
  title = "Crop photo",
  hint = "Drag to position. Use the slider or mouse wheel to zoom.",
  onCancel,
  onDone,
}) {
  const wrapRef = useRef(null);
  const imgRef = useRef(null);
  const drag = useRef(null);

  const [frame, setFrame] = useState({ w: 300, h: 300 / aspect });
  const [natural, setNatural] = useState(null); // { w, h }
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 }); // image top-left inside the frame
  const [loadError, setLoadError] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Frame size: as wide as the dialog allows (max 320px), height from the aspect ratio
  useLayoutEffect(() => {
    if (!open) return;
    const measure = () => {
      const available = wrapRef.current?.clientWidth || 300;
      const w = Math.min(320, available);
      setFrame({ w, h: Math.round(w / aspect) });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [open, aspect]);

  // Reset when a new image is opened
  useEffect(() => {
    if (!open) return;
    setNatural(null);
    setZoom(1);
    setLoadError(false);
    setExporting(false);
  }, [open, src]);

  const baseScale = natural
    ? Math.max(frame.w / natural.w, frame.h / natural.h) // "cover" at zoom 1
    : 1;
  const scale = baseScale * zoom;
  const dispW = natural ? natural.w * scale : 0;
  const dispH = natural ? natural.h * scale : 0;

  const clamp = useCallback(
    (p, w = dispW, h = dispH) => ({
      x: Math.min(0, Math.max(frame.w - w, p.x)),
      y: Math.min(0, Math.max(frame.h - h, p.y)),
    }),
    [frame.w, frame.h, dispW, dispH],
  );

  // Centre the image when it loads or the frame size changes
  useEffect(() => {
    if (!natural) return;
    const s = Math.max(frame.w / natural.w, frame.h / natural.h);
    setZoom(1);
    setPos({
      x: (frame.w - natural.w * s) / 2,
      y: (frame.h - natural.h * s) / 2,
    });
  }, [natural, frame.w, frame.h]);

  function changeZoom(next) {
    if (!natural) return;
    const z = Math.min(MAX_ZOOM, Math.max(1, next));
    const newScale = baseScale * z;
    // keep the point under the frame centre in place
    const cx = frame.w / 2;
    const cy = frame.h / 2;
    const ratio = newScale / scale;
    const p = { x: cx - (cx - pos.x) * ratio, y: cy - (cy - pos.y) * ratio };
    setZoom(z);
    setPos(clamp(p, natural.w * newScale, natural.h * newScale));
  }

  function onPointerDown(e) {
    if (!natural) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX, startY: e.clientY, from: pos };
  }
  function onPointerMove(e) {
    if (!drag.current) return;
    const d = drag.current;
    setPos(clamp({ x: d.from.x + (e.clientX - d.startX), y: d.from.y + (e.clientY - d.startY) }));
  }
  function onPointerUp() {
    drag.current = null;
  }
  function onWheel(e) {
    if (!natural) return;
    changeZoom(zoom * (e.deltaY < 0 ? 1.08 : 1 / 1.08));
  }

  function reset() {
    if (!natural) return;
    setZoom(1);
    setPos({ x: (frame.w - natural.w * baseScale) / 2, y: (frame.h - natural.h * baseScale) / 2 });
  }

  async function handleDone() {
    if (!natural || !imgRef.current) return;
    setExporting(true);
    const outW = outputWidth;
    const outH = Math.round(outputWidth / aspect);
    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    // area of the original image that is visible in the frame
    const sx = -pos.x / scale;
    const sy = -pos.y / scale;
    const sw = frame.w / scale;
    const sh = frame.h / scale;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, outW, outH);
    ctx.drawImage(imgRef.current, sx, sy, sw, sh, 0, 0, outW, outH);
    let blob;
    try {
      blob = await new Promise((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("export failed"))), "image/jpeg", 0.9),
      );
    } catch (err) {
      // e.g. an image from another site that doesn't allow cropping in the browser
      setExporting(false);
      onDone(null, err);
      return;
    }
    try {
      await onDone(blob);
    } finally {
      setExporting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={exporting ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ fontWeight: 800, pb: 0.5 }}>{title}</DialogTitle>
      <DialogContent>
        <Typography sx={{ color: "#6b7280", fontSize: "0.85rem", mb: 2 }}>
          {hint}
        </Typography>

        <Box ref={wrapRef} sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Box
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onWheel={onWheel}
            sx={{
              position: "relative",
              width: frame.w,
              height: frame.h,
              overflow: "hidden",
              borderRadius: 2,
              bgcolor: "#0f1115",
              cursor: natural ? (drag.current ? "grabbing" : "grab") : "default",
              touchAction: "none",
              userSelect: "none",
              boxShadow: `0 0 0 2px ${BRAND.primary}`,
            }}
          >
            {src && !loadError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                ref={imgRef}
                src={src}
                alt=""
                crossOrigin={src.startsWith("blob:") || src.startsWith("data:") ? undefined : "anonymous"}
                draggable={false}
                onLoad={(e) =>
                  setNatural({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })
                }
                onError={() => setLoadError(true)}
                style={{
                  position: "absolute",
                  left: pos.x,
                  top: pos.y,
                  width: dispW || "auto",
                  height: dispH || "auto",
                  maxWidth: "none",
                  visibility: natural ? "visible" : "hidden",
                  pointerEvents: "none",
                }}
              />
            ) : null}

            {/* Rule-of-thirds guide lines */}
            {natural ? (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  backgroundImage:
                    "linear-gradient(to right, transparent calc(33.33% - 0.5px), rgba(255,255,255,0.45) calc(33.33% - 0.5px), rgba(255,255,255,0.45) calc(33.33% + 0.5px), transparent calc(33.33% + 0.5px), transparent calc(66.66% - 0.5px), rgba(255,255,255,0.45) calc(66.66% - 0.5px), rgba(255,255,255,0.45) calc(66.66% + 0.5px), transparent calc(66.66% + 0.5px)), linear-gradient(to bottom, transparent calc(33.33% - 0.5px), rgba(255,255,255,0.45) calc(33.33% - 0.5px), rgba(255,255,255,0.45) calc(33.33% + 0.5px), transparent calc(33.33% + 0.5px), transparent calc(66.66% - 0.5px), rgba(255,255,255,0.45) calc(66.66% - 0.5px), rgba(255,255,255,0.45) calc(66.66% + 0.5px), transparent calc(66.66% + 0.5px))",
                }}
              />
            ) : null}

            {!natural && !loadError ? (
              <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                <CircularProgress size={26} sx={{ color: "#2BD1C7" }} />
              </Box>
            ) : null}
            {loadError ? (
              <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", p: 2 }}>
                <Typography sx={{ color: "#fff", fontSize: "0.85rem", textAlign: "center" }}>
                  This image could not be loaded. Please upload it again.
                </Typography>
              </Box>
            ) : null}
          </Box>
        </Box>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2, px: 0.5 }}>
          <IconButton size="small" onClick={() => changeZoom(zoom - 0.25)} disabled={!natural || zoom <= 1} aria-label="Zoom out">
            <ZoomOutIcon fontSize="small" />
          </IconButton>
          <Slider
            size="small"
            min={1}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            disabled={!natural}
            onChange={(_, v) => changeZoom(v)}
            aria-label="Zoom"
            sx={{ color: BRAND.primary }}
          />
          <IconButton size="small" onClick={() => changeZoom(zoom + 0.25)} disabled={!natural || zoom >= MAX_ZOOM} aria-label="Zoom in">
            <ZoomInIcon fontSize="small" />
          </IconButton>
          <Tooltip title="Reset">
            <span>
              <IconButton size="small" onClick={reset} disabled={!natural} aria-label="Reset">
                <RestartAltIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
        <Typography sx={{ mt: 0.5, textAlign: "center", fontSize: "0.75rem", color: "#9ca3af" }}>
          Saved at {outputWidth} × {Math.round(outputWidth / aspect)} px
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onCancel} disabled={exporting} sx={{ textTransform: "none", fontWeight: 600, color: "#4b5563" }}>
          Cancel
        </Button>
        <Button
          onClick={handleDone}
          disabled={!natural || exporting}
          variant="contained"
          disableElevation
          sx={{ ...brandButtonSx, fontWeight: 700, px: 2.5 }}
        >
          {exporting ? "Saving..." : "Crop & use photo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
