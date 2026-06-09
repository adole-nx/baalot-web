"use client";

import { useRef } from "react";
import { Play } from "lucide-react";

interface VideoPlaceholderProps {
  src?: string;      // e.g. "/videos/hero.mp4" — TODO: replace with real file
  className?: string;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "21/9";
  autoPlayOnHover?: boolean;
  showPlayIcon?: boolean;
  label?: string;
}

export default function VideoPlaceholder({
  src,
  className = "",
  aspectRatio = "16/9",
  autoPlayOnHover = false,
  showPlayIcon = false,
  label,
}: VideoPlaceholderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const ratio = {
    "16/9":  "56.25%",
    "4/3":   "75%",
    "1/1":   "100%",
    "21/9":  "42.85%",
  }[aspectRatio];

  const handleEnter = () => { if (autoPlayOnHover && videoRef.current) videoRef.current.play().catch(() => {}); };
  const handleLeave = () => { if (autoPlayOnHover && videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; } };

  return (
    <div
      className={`relative overflow-hidden rounded-xl ${className}`}
      style={{ paddingBottom: ratio }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Shimmer placeholder bg */}
      <div className="video-placeholder absolute inset-0" />

      {/* Actual video — hidden until real file added */}
      {/* TODO: replace placeholder — add real video file at src path */}
      {src && (
        <video
          ref={videoRef}
          src={src}
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300"
          muted
          loop
          playsInline
          onLoadedData={(e) => { (e.target as HTMLVideoElement).style.opacity = "1"; }}
        />
      )}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent pointer-events-none" />

      {/* Play icon */}
      {showPlayIcon && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center">
            <Play size={20} className="text-white ml-1" />
          </div>
        </div>
      )}

      {label && (
        <div className="absolute bottom-3 left-3">
          <span className="text-xs font-semibold text-muted bg-bg/70 backdrop-blur-sm px-2 py-1 rounded">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
