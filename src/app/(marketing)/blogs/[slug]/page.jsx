"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Divider,
  Stack,
  Avatar,
} from "@mui/material";
// import { useParams } from "next/navigation";

const page = () => {
  // const { slug } = useParams();

  return (
    <Box sx={{ py: 16, fontFamily: "montserrat, inter" }}>
      <Container maxWidth="lg">
        {/* Category + Date */}

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: { xs: 0, lg: 5 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: { xs: "center", lg: "space-between" },
              alignItems: { xs: "center", sm: "center", lg: "flex-start" },
              borderRadius: 3,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ color: "primary.main", fontWeight: 600, mb: 1 }}
            >
              Web Development • Oct 15, 2025
            </Typography>

            {/* Blog Title */}
            <Typography
              variant="h3"
              fontWeight={700}
              lineHeight={1.2}
              mb={3}
              sx={{
                fontSize: { xs: 20, sm: 24, md: 48 },
                textAlign: { xs: "center", sm: "center", lg: "left" },
              }}
            >
              Building Scalable Web Applications with Next.js
            </Typography>

            {/* Author */}
            <Stack direction="row" spacing={2} alignItems="center" mb={4}>
              <Avatar>TW</Avatar>
              <Box>
                <Typography fontWeight={600}>
                  TriWinz Engineering Team
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  6 min read
                </Typography>
              </Box>
            </Stack>
          </Box>
          {/* Featured Image */}
          <Box
            component="img"
            src="https://bigosoft.us/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Frs2athnt%2Fproduction%2Fbaf092238c7be80850df6b8cf4eda3a5b89b204c-1000x582.jpg&w=1920&q=75"
            alt="Blog cover"
            sx={{
              width: 500,
              borderRadius: 3,
              mb: 4,
              alignSelf: { xs: "center", sm: "center", lg: "flex-start" },
            }}
          />
        </Box>
        {/* Blog Content */}
        <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
          Modern web applications demand scalability, performance, and
          maintainability. Next.js has emerged as a powerful framework that
          enables teams to build production-ready applications with ease.
        </Typography>

        <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
          By leveraging server-side rendering, static site generation, and
          incremental static regeneration, Next.js provides flexible rendering
          strategies tailored to different use cases. This allows developers to
          optimize performance without compromising developer experience.
        </Typography>

        {/* Section Heading */}
        <Typography variant="h5" fontWeight={700} mt={5} mb={2}>
          Key Benefits of Using Next.js
        </Typography>

        <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
          One of the major advantages of Next.js is its built-in routing system,
          which simplifies navigation and improves code organization. Combined
          with API routes and middleware, teams can build full-stack solutions
          within a single framework.
        </Typography>

        <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
          Additionally, features like image optimization, font optimization, and
          edge rendering help deliver fast, reliable user experiences at scale.
        </Typography>

        <Divider sx={{ my: 6 }} />

        {/* Conclusion */}
        <Typography variant="h5" fontWeight={700} mb={2}>
          Final Thoughts
        </Typography>

        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
          Next.js empowers development teams to build modern, scalable web
          applications while maintaining high performance and excellent user
          experience. Whether you’re building a startup MVP or an enterprise
          platform, Next.js offers the tools needed to succeed.
        </Typography>
      </Container>
    </Box>
  );
};

export default page;

// import {
//   Box,
//   Container,
//   Typography,
//   Divider,
//   Stack,
//   Avatar,
// } from "@mui/material";

// import { prisma } from "../../../../lib/prisma";
// import { markdownToHtml } from "../../../../lib/markdown";

// export default async function BlogPage({ params }) {
//   const { slug } = params;

//   // 1️⃣ Fetch blog from DB
//   const blog = await prisma.blog.findUnique({
//     where: { slug },
//   });

//   if (!blog || !blog.published) {
//     return <div>Blog not found</div>;
//   }

//   // 2️⃣ Convert Markdown → HTML
//   const contentHtml = await markdownToHtml(blog.content);

//   return (
//     <Box sx={{ py: 16, fontFamily: "montserrat, inter" }}>
//       <Container maxWidth="lg">
//         {/* Header */}
//         <Box sx={{ mb: 5, display: "flex", gap: 6 }}>
//           <Box flex={1}>
//             <Typography
//               variant="subtitle2"
//               sx={{ color: "primary.main", fontWeight: 600, mb: 1 }}
//             >
//               {blog.category || "Web Development"} •{" "}
//               {new Date(blog.createdAt).toDateString()}
//             </Typography>

//             <Typography variant="h3" fontWeight={700} mb={3}>
//               {blog.title}
//             </Typography>

//             <Stack direction="row" spacing={2} alignItems="center" mb={4}>
//               <Avatar>TW</Avatar>
//               <Box>
//                 <Typography fontWeight={600}>
//                   TriWinz Engineering Team
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary">
//                   6 min read
//                 </Typography>
//               </Box>
//             </Stack>
//           </Box>

//           {blog.coverImage && (
//             <Box
//               component="img"
//               src={blog.coverImage}
//               alt={blog.title}
//               sx={{
//                 width: 550,
//                 borderRadius: 3,
//               }}
//             />
//           )}
//         </Box>

//         {/* Blog Content (Markdown → HTML) */}
//         <Box
//           sx={{
//             "& h2": { mt: 5, mb: 2, fontWeight: 700 },
//             "& p": { mb: 3, lineHeight: 1.8 },
//           }}
//           dangerouslySetInnerHTML={{ __html: contentHtml }}
//         />

//         <Divider sx={{ my: 6 }} />
//       </Container>
//     </Box>
//   );
// }
