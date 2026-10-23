import React from "react";
import { Box, Card, Typography, IconButton } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import Link from "next/link";

const BlogCard = ({ title, description, image, date, category, author }) => {
  console.log(title.replaceAll(" ", "-", "/"));
  return (
    <Link
      href={`/blogs/${title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")}`}
      style={{ textDecoration: "none" }}
      aria-label={`Read blog: ${title}`}
    >
      <Card
        sx={{
          position: "relative",
          width: 300,
          height: 400,
          borderRadius: 3,
          overflow: "hidden",
          cursor: "pointer",

          "&:hover .content": {
            transform: "translateY(0)",
          },
          "&:hover .description": {
            WebkitLineClamp: 6,
          },
          "&:hover .arrow": {
            opacity: 1,
            transform: "translateY(0)",
          },
        }}
      >
        {/* Image */}
        <Box
          component="img"
          src={image}
          alt={title}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Gradient Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.2))",
          }}
        />

        {/* Arrow Icon */}
        <IconButton
          className="arrow"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,

            background: "linear-gradient(122deg, #5014d2ff 0%, #dd3ca7ff 100%)",
            color: "white",

            opacity: 0,
            transform: "translateY(-10px)",
            transition: "all 0.3s ease",

            "&:hover": {
              background: "linear-gradient(90deg, #3D74FF 0%, #FF4F81 100%)",
            },
          }}
        >
          <ArrowOutwardIcon fontSize="small" />
        </IconButton>

        {/* Text Content */}
        <Box
          className="content"
          sx={{
            position: "absolute",
            bottom: 0,
            p: 2,
            color: "white",
            transform: "translateY(60px)",
            transition: "transform 0.4s ease",
          }}
        >
          <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>
            {category} • {date}
          </Typography>

          <Typography variant="h6" fontWeight={700} mt={0.5} mb={1}>
            {title}
          </Typography>

          <Typography
            className="description"
            variant="body2"
            sx={{
              opacity: 0.9,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              transition: "all 0.4s ease",
            }}
          >
            {description}
          </Typography>

          {author && (
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              By {author}
            </Typography>
          )}
        </Box>
      </Card>
    </Link>
  );
};

export default BlogCard;
