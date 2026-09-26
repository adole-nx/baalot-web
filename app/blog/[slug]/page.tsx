import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { posts, getPost } from "../posts";
import ArticleView from "./ArticleView";
import { DOMAIN, pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const meta = pageMeta(`/blog/${post.slug}/`, post.title, post.excerpt);
  return { ...meta, openGraph: { ...meta.openGraph, type: "article", publishedTime: new Date(post.date).toISOString() } };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: new Date(post.date).toISOString(),
    author: { "@type": "Person", name: post.author, jobTitle: post.authorRole },
    publisher: { "@type": "Organization", name: "Baalot", logo: { "@type": "ImageObject", url: `${DOMAIN}/icon.png` } },
    mainEntityOfPage: `${DOMAIN}/blog/${post.slug}/`,
    image: `${DOMAIN}/og-image.png`,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <ArticleView post={post} />
    </>
  );
}
