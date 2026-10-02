export type Post = {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  tag: string;
  tagColor: string;
  excerpt: string;
  author: string;
  authorRole: string;
  body: Section[];
};

type Section = {
  type: "h2" | "p" | "ul" | "blockquote";
  content: string | string[];
};

export const posts: Post[] = [];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
