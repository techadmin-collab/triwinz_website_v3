"use client";

import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Stack,
  Divider,
} from "@mui/material";
import BlogCard from "./sections/BlogCard";

export const blogData = [
  {
    title: "Building Scalable Web Applications with Next.js",
    description:
      "Learn best practices for structuring scalable Next.js applications using modern architecture, performance optimization, and server components.",
    image:
      "https://bigosoft.us/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Frs2athnt%2Fproduction%2Fbaf092238c7be80850df6b8cf4eda3a5b89b204c-1000x582.jpg&w=1920&q=75",
    date: "Sep 12, 2025",
    category: "Web Development",
    author: "TriWinz Engineering Team",
  },
  {
    title: "Why Cloud-Native Architecture is the Future",
    description:
      "Explore how cloud-native solutions enable scalability, flexibility, and faster deployment for modern enterprises.",
    image:
      "https://accuweb.cloud/blog/wp-content/uploads/2023/10/word-image-33039-2.png",
    date: "Sep 18, 2025",
    category: "Cloud Computing",
    author: "DevOps Team",
  },
  {
    title: "AI in Business: Practical Use Cases That Drive Growth",
    description:
      "From automation to predictive analytics, discover real-world AI applications that help businesses scale smarter.",
    image:
      "https://ismg-cdn.nyc3.cdn.digitaloceanspaces.com/articles/report-generative-ai-key-driver-for-business-growth-showcase_image-10-a-26182.jpg",
    date: "Sep 25, 2025",
    category: "Artificial Intelligence",
    author: "AI Solutions Group",
  },
  {
    title: "Cybersecurity Best Practices for Modern Enterprises",
    description:
      "Protect your digital assets with proven cybersecurity strategies, threat detection, and compliance-ready solutions.",
    image:
      "https://www.xperteks.com/wp-content/uploads/2023/09/Xperteks-Top-10-Cybersecurity-Best-Practices-Banner-image.jpg.webp",
    date: "Oct 2, 2025",
    category: "Cybersecurity",
    author: "Security Team",
  },
  {
    title: "UI/UX Design Principles for High-Converting Products",
    description:
      "Understand how user-centric design, accessibility, and usability directly impact product success.",
    image: "https://thepermatech.com/wp-content/uploads/2025/08/15.png",
    date: "Oct 8, 2025",
    category: "UI/UX Design",
    author: "Design Team",
  },
  {
    title: "DevOps Automation: CI/CD Pipelines Explained",
    description:
      "A beginner-friendly guide to setting up CI/CD pipelines for faster, safer, and more reliable deployments.",
    image:
      "https://images.prismic.io/bunnyshell-blog/e5a32974-9914-4dbc-bc97-6793dd232f4a_what-is-CI-CD-CT-in-devops.png?ixlib=gatsbyFP&auto=compress%2Cformat&fit=max&rect=0%2C256%2C1080%2C568&w=1140&h=600",
    date: "Oct 15, 2025",
    category: "DevOps",
    author: "Platform Engineering",
  },
];

export default function page() {
  return (
    <>
      <Box
        sx={{
          minHeight: { xs: "auto", md: "100vh", xl: "80vh" },
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
          position: "relative",
          overflow: "hidden",
          fontFamily: "montserrat, inter",
          color: "#fff",
          py: { xs: 12, md: 18 },
        }}
      >
        {/* Wave overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(122deg, #5014d2ff 0%, #dd3ca73d 100%), url('/about/bg-1-1.webp')", // optional
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          {/* Tag */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                px: 2.5,
                py: 0.8,
                borderRadius: "999px",
                backgroundColor: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                backdropFilter: "blur(6px)",
                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                fontWeight: 500,
              }}
            >
              Blogs
            </Box>
          </Box>

          {/* Heading */}
          <Typography
            textAlign="center"
            fontWeight={800}
            sx={{
              fontSize: { xs: "2.2rem", md: "3.5rem" },
              lineHeight: 1.15,
              mb: 3,
            }}
          >
            Insights, Ideas & Innovation
          </Typography>

          {/* Subheading */}
          <Typography
            textAlign="center"
            sx={{
              fontSize: { xs: "1rem", md: "1.25rem" },
              fontWeight: 500,
              mb: 3,
              opacity: 0.95,
            }}
          >
            Stay Updated with the Latest in Technology & Digital Trends
          </Typography>

          {/* Description */}
          <Typography
            textAlign="center"
            sx={{
              maxWidth: 900,
              mx: "auto",
              lineHeight: 1.7,
              fontSize: "0.95rem",
              opacity: 0.9,
            }}
          >
            Explore expert-written articles, product updates, and practical
            guides covering web development, cloud, AI, and modern business
            technology. Learn, grow, and stay ahead with insights crafted for
            builders and decision-makers.
          </Typography>
        </Container>
      </Box>
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, py: 8 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            justifyContent: "center",
          }}
        >
          {blogData.map((blog) => (
            <BlogCard
              key={blog.title}
              title={blog.title}
              description={blog.description}
              image={blog.image}
              date={blog.date}
              category={blog.category}
              author={blog.author}
            />
          ))}
        </Box>
      </Container>
    </>
  );
}
