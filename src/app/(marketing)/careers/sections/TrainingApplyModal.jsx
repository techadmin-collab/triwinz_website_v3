"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import TrainingApplyForm from "./TrainingApplyForm";

export default function TrainingApplyModal({
  buttonLabel = "Join Our Training Program",
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        startIcon={<SchoolOutlinedIcon />}
        sx={{
          py: 1.5,
          px: 4,
          borderRadius: 2.5,
          fontWeight: 800,
          letterSpacing: "0.02em",
          textTransform: "none",
          fontSize: "1rem",
          color: "#5014d2",
          backgroundColor: "#fff",
          boxShadow: "0 10px 24px rgba(0, 0, 0, 0.18)",
          "&:hover": {
            backgroundColor: "#f4efff",
            boxShadow: "0 12px 28px rgba(0, 0, 0, 0.24)",
          },
        }}
      >
        {buttonLabel}
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            fontSize: "1.25rem",
            pr: 6,
            pb: 1.5,
            backgroundImage: "linear-gradient(122deg, #5014d2 0%, #dd3ca7 100%)",
            color: "#fff",
          }}
        >
          Join Our Training Program
          <Box
            component="span"
            sx={{
              display: "block",
              mt: 0.5,
              fontSize: "0.9rem",
              fontWeight: 500,
              opacity: 0.9,
            }}
          >
            Fill in your details and our team will get in touch
          </Box>
          <IconButton
            aria-label="Close"
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
              color: "#fff",
              "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: { xs: 3, md: 3.5 }, pt: 3 }}>
          <TrainingApplyForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
