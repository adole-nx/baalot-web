"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { posts, type Post } from "../posts";

const EASE = [0.16, 1, 0.3, 1] as const;

function renderBody(post: Post) {
  return post.body.map((section, i) => {
    if (section.type === "h2") {
      return (
        <h2 key={i} className="font-syne font-extrabold text-2xl md:text-3xl text-white mt-12 mb-4">
          {section.content as string}
        </h2>
      );
    }
    if (section.type === "p") {
      return (
        <p key={i} className="text-white/70 leading-[1.85] mb-5 text-base md:text-lg">
          {section.content as string}
        </p>
      );
    }
    if (section.type === "blockquote") {
      return (
        <blockquote
          key={i}
          className="my-8 pl-6 py-4 font-syne font-bold text-xl md:text-2xl text-white leading-snug"
          style={{ borderLeft: `3px solid ${post.tagColor}` }}
        >
          {section.content as string}
        </blockquote>
      );
    }
    if (section.type === "ul") {
      return (
        <ul key={i} className="mb-5 space-y-2">
          {(section.content as string[]).map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-white/70 text-base leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: post.tagColor }} />
              {item}
            </li>
          ))}
        </ul>
      );
    }
    return null;
  });
}

export default function ArticleView({ post }: { post: Post }) {
  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <main className="bg-bg min-h-screen">

      {/* Back + header */}
      <section className="section-pad pt-32 pb-10">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <Link href="/blog" className="inline-flex items-center gap-2 text-muted hover:text-white transition-colors text-sm mb-10">
              <ArrowLeft size={14} /> All posts
            </Link>
          </motion.div>

          <motion.span
            className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-5"
            style={{ background: `${post.tagColor}18`, color: post.tagColor, border: `1px solid ${post.tagColor}30` }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          >
            {post.tag}
          </motion.span>

          <motion.h1
            className="font-syne font-extrabold text-4xl md:text-5xl text-white mb-6 leading-[1.05]"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {post.title}
          </motion.h1>

          <motion.div
            className="flex items-center gap-4 pb-10"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-syne font-bold text-xs flex-shrink-0"
              style={{ background: `${post.tagColor}20`, color: post.tagColor, border: `1px solid ${post.tagColor}30` }}
            >
              {post.author.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p className="text-white text-sm font-semibold">{post.author}</p>
              <p className="text-muted text-xs">{post.authorRole}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-white/50 text-xs">{post.date}</p>
              <p className="text-white/40 text-xs">{post.readTime}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <section className="px-5 md:px-10 lg:px-16 pb-24">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
        >
          {renderBody(post)}
        </motion.div>
      </section>

      {/* More posts */}
      {others.length > 0 && (
        <section className="section-pad pt-0 pb-32">
          <div className="max-w-site mx-auto">
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} className="pt-16">
              <p className="label-tag mb-8">More from Baalot</p>
              <div className="grid md:grid-cols-2 gap-6">
                {others.map((other) => (
                  <Link key={other.slug} href={`/blog/${other.slug}`} className="group block">
                    <div
                      className="p-6 rounded-2xl transition-colors duration-300 group-hover:bg-white/[0.04]"
                      style={{ border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4"
                        style={{ background: `${other.tagColor}18`, color: other.tagColor, border: `1px solid ${other.tagColor}30` }}
                      >
                        {other.tag}
                      </span>
                      <h3 className="font-syne font-bold text-lg text-white mb-2 leading-snug group-hover:text-white/90 transition-colors">
                        {other.title}
                      </h3>
                      <p className="text-muted text-sm leading-relaxed line-clamp-2">{other.excerpt}</p>
                      <p className="text-xs mt-4" style={{ color: other.tagColor }}>Read more</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

    </main>
  );
}
