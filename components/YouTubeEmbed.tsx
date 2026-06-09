"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  aspectRatio?: "16/9" | "4/3";
  className?: string;
  /** Show inline (auto-load iframe) vs click-to-load (default) */
  autoLoad?: boolean;
  label?: string;
}

/**
 * Lazy YouTube embed: shows thumbnail + play button,
 * swaps to iframe only on click — zero JS weight until interaction.
 */
export default function YouTubeEmbed({
  videoId,
  title = "Video",
  aspectRatio = "16/9",
  className = "",
  autoLoad = false,
  label,
}: YouTubeEmbedProps) {
  const [active, setActive] = useState(autoLoad);
  const thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const padding = aspectRatio === "4/3" ? "75%" : "56.25%";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-surface-2 ${className}`}
      style={{ paddingBottom: padding }}
    >
      {active ? (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&color=white`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          className="absolute inset-0 w-full h-full group"
          onClick={() => setActive(true)}
          aria-label={`Play ${title}`}
        >
          {/* Thumbnail */}
          <Image
            src={thumbUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-bg/40 group-hover:bg-bg/25 transition-colors duration-300" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/15 border border-white/30 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-white/25 transition-all duration-300 shadow-2xl">
              <Play size={22} className="text-white ml-1" fill="white" />
            </div>
          </div>

          {/* Bottom gradient + label */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-bg/80 to-transparent" />
          {label && (
            <div className="absolute bottom-3 left-4">
              <span className="text-xs font-medium text-white/70 bg-bg/60 backdrop-blur-sm px-2 py-1 rounded">
                {label}
              </span>
            </div>
          )}

          {/* YouTube badge */}
          <div className="absolute top-3 right-3">
            <span className="text-[10px] text-white/50 bg-bg/50 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1">
              <svg width="10" height="7" viewBox="0 0 24 17" fill="currentColor">
                <path d="M23.5 2.6s-.2-1.7-1-2.4C21.5.1 20.3.1 19.8 0 16.5-.1 12 0 12 0S7.5-.1 4.2 0C3.7.1 2.5.1 1.5.2.7.9.5 2.6.5 2.6S.3 4.6.3 6.6v1.9c0 2 .2 3.9.2 3.9s.2 1.7 1 2.4c1 1 2.3.9 2.9 1 2.1.2 8.6.3 8.6.3s4.5 0 7.8-.1c.5-.1 1.7-.1 2.7-1 .8-.7 1-2.4 1-2.4s.2-2 .2-3.9V6.6c0-2-.2-4-.2-4zM9.7 11.5V4.7l7.3 3.4-7.3 3.4z"/>
              </svg>
              YouTube
            </span>
          </div>
        </button>
      )}
    </div>
  );
}
