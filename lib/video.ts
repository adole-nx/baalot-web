/**
 * Master switch for every YouTube video on the site.
 *
 * Off: each embed (YouTubeEmbed and the hero's Watch Demo modal) renders as a
 * plain black frame of the same size, and nothing is loaded from YouTube.
 * The video IDs stay in place at each call site, so turning this back on
 * restores them unchanged.
 */
export const YOUTUBE_ENABLED = false;
