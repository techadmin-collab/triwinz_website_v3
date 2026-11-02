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
import TrainingApplyForm from "./TrainingApplyForm";

export default function TrainingApplyModal({
  buttonLabel = "Apply Now",
  buttonSx = {},
  fullWidth = false,
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        fullWidth={fullWidth}
        onClick={() => setOpen(true)}
        sx={{
          py: 1.5,
          px: 4,
          borderRadius: 2.5,
          fontWeight: 800,
          letterSpacing: "0.02em",
          textTransform: "none",
          fontSize: "1rem",
          color: "#fff",
          backgroundImage: "linear-gradient(96deg, #1D5758 0%, #2BD1C7 100%)",
          boxShadow: "0 10px 24px rgba(29, 87, 88, 0.28)",
          "&:hover": {
            backgroundImage: "linear-gradient(96deg, #164546 0%, #22B3AA 100%)",
            boxShadow: "0 12px 28px rgba(29, 87, 88, 0.35)",
          },
          ...buttonSx,
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
            backgroundImage: "linear-gradient(122deg, #1D5758 0%, #2BD1C7 100%)",
            color: "#fff",
          }}
        >
          Intensive Corporate Training Programme
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
            Apply for the one-year training, internship and project programme
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
