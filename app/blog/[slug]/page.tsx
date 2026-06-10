import { notFound } from "next/navigation";
import { posts, getPost } from "../posts";
import ArticleView from "./ArticleView";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return <ArticleView post={post} />;
}
