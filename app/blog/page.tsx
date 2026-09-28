"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { posts } from "./posts";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function BlogPage() {
  return (
    <main className="bg-bg min-h-screen">

      {/* Hero */}
      <section className="section-pad pt-36 pb-16">
        <div className="max-w-site mx-auto">
          <motion.p
            className="label-tag mb-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
          >
            Blog
          </motion.p>
          <motion.h1
            className="font-syne font-extrabold text-5xl md:text-6xl text-white mb-4 leading-[0.95]"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            Thoughts on elections,<br className="hidden md:block" /> democracy, and tech.
          </motion.h1>
          <motion.p
            className="text-muted text-lg max-w-xl"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          >
            Written by the Baalot team — engineering decisions, pilot stories, and ideas about what trustworthy voting infrastructure actually looks like.
          </motion.p>
        </div>
      </section>

      {/* Posts */}
      <section className="pb-32 px-5 md:px-10 lg:px-16">
        <div className="max-w-site mx-auto">
          {posts.length === 0 && (
            <p className="text-muted text-sm">No posts yet.</p>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, filter: "blur(10px)", y: 16 }}
                whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                whileHover={{ y: -4, transition: { duration: 0.22 } }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              >
                <Link href={`/blog/${post.slug}`} className="group block h-full">
                  <div
                    className="h-full flex flex-col p-7 rounded-2xl transition-colors duration-300 group-hover:bg-white/[0.04]"
                    style={{ border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    {/* Tag */}
                    <span
                      className="self-start px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-5"
                      style={{
                        background: `${post.tagColor}18`,
                        color: post.tagColor,
                        border: `1px solid ${post.tagColor}30`,
                      }}
                    >
                      {post.tag}
                    </span>

                    {/* Title */}
                    <h2 className="font-syne font-extrabold text-xl text-white mb-3 leading-snug group-hover:text-white/90 transition-colors">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-muted text-sm leading-relaxed flex-1 mb-6">
                      {post.excerpt}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white text-xs font-semibold">{post.author}</p>
                        <p className="text-muted text-[11px] mt-0.5">{post.date} · {post.readTime}</p>
                      </div>
                      <span
                        className="text-xs font-semibold transition-all duration-200 group-hover:translate-x-1"
                        style={{ color: post.tagColor }}
                      >
                        Read →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
