"use client";

import { use } from "react";
import BlogForm from "../../../../components/BlogForm";

export default function EditBlogPage({ params }) {
  const { id } = use(params);
  return <BlogForm blogId={id} />;
}
