import { notFound } from "next/navigation";
import { posts, getPost } from "../posts";
import ArticleView from "./ArticleView";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();
  return <ArticleView post={post} />;
}
