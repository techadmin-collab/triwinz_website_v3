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
import ApplyForm from "./ApplyForm";

export default function ApplyModal({
  jobTitle,
  jobSlug,
  buttonLabel = "Apply for this role",
  buttonSx = {},
  fullWidth = false,
}) {
  const [open, setOpen] = useState(false);

  function handleSuccess() {
    setOpen(false);
  }

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
          backgroundImage: "linear-gradient(96deg, #5014D2 0%, #DD3CA7 100%)",
          boxShadow: "0 10px 24px rgba(80, 20, 210, 0.28)",
          "&:hover": {
            backgroundImage: "linear-gradient(96deg, #4512b8 0%, #c73596 100%)",
            boxShadow: "0 12px 28px rgba(80, 20, 210, 0.35)",
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
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            fontSize: "1.25rem",
            pr: 6,
            pb: 0.5,
            backgroundImage:
              "linear-gradient(122deg, #5014d2 0%, #dd3ca7 100%)",
            color: "#fff",
          }}
        >
          Apply for this role
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
            {jobTitle}
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

        <DialogContent sx={{ p: { xs: 3, md: 3.5 }, pt: 5 }}>
          <ApplyForm
            jobTitle={jobTitle}
            jobSlug={jobSlug}
            showHeader={false}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
