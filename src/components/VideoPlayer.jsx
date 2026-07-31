import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playClick } from "../utils/sounds.js";

/**
 * Custom HTML5 video player with graceful placeholder if the file is missing.
 * @param {{src: string, title?: string, autoPlay?: boolean}} props
 */
export default function VideoPlayer({ src, title = "Birthday Movie", autoPlay = false }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [status, setStatus] = useState("loading"); // loading | ready | missing
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);
  const [vol, setVol] = useState(1);
  const [muted, setMuted] = useState(false);
  const [full, setFull] = useState(false);
  const [pipOn, setPipOn] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [needsUserPlay, setNeedsUserPlay] = useState(false);

  const pipSupported = typeof document !== "undefined" && document.pictureInPictureEnabled;

  /** Start playback with sound enabled. Returns whether play() resolved. */
  const playWithSound = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.defaultMuted = false;
    if (v.volume === 0) v.volume = 1;
    setMuted(false);
    const p = v.play();
    if (p !== undefined) {
      p.then(() => {
        // A browser may still start playback muted if the gesture was lost.
        if (v.muted) v.muted = false;
        setNeedsUserPlay(false);
      }).catch(() => {
        setNeedsUserPlay(true);
      });
    } else {
      setNeedsUserPlay(false);
    }
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    playClick();
    if (v.paused) {
      playWithSound();
    } else {
      v.pause();
    }
  }, [playWithSound]);

  const skip = useCallback(
    (s) => {
      const v = videoRef.current;
      if (!v) return;
      v.currentTime = Math.min(Math.max(0, v.currentTime + s), v.duration || Infinity);
    },
    []
  );

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    playClick();
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  const togglePip = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    playClick();
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setPipOn(false);
      } else if (v.requestPictureInPicture) {
        await v.requestPictureInPicture();
        setPipOn(true);
      }
    } catch {
      /* not supported */
    }
  }, []);

  const seek = useCallback((e) => {
    const v = videoRef.current;
    const bar = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - bar.left) / bar.width));
    if (v && v.duration) v.currentTime = ratio * v.duration;
  }, []);

  const format = (s) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const onChange = () => setFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onEnded = () => setPlaying(false);
    const onWaiting = () => setBuffering(true);
    const onCanPlay = () => setBuffering(false);
    v.addEventListener("ended", onEnded);
    v.addEventListener("waiting", onWaiting);
    v.addEventListener("canplay", onCanPlay);
    return () => {
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("waiting", onWaiting);
      v.removeEventListener("canplay", onCanPlay);
    };
  }, [status]);

  /** Try to auto-play with sound; if the browser blocks it, show a Play button. */
  useEffect(() => {
    if (!autoPlay || status !== "ready") return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.defaultMuted = false;
    v.volume = v.volume === 0 ? 1 : v.volume;
    setMuted(false);
    const p = v.play();
    if (p !== undefined) {
      p.then(() => {
        // A browser may still start playback muted if the gesture was lost.
        if (v.muted) v.muted = false;
        setNeedsUserPlay(false);
      }).catch(() => {
        // Only offer the Play-with-Sound fallback if playback truly didn't start.
        setTimeout(() => {
          const el = videoRef.current;
          if (el && el.paused) setNeedsUserPlay(true);
        }, 0);
      });
    }
  }, [autoPlay, status]);

  if (status === "missing") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          textAlign: "center",
          padding: 24,
        }}
      >
        <motion.span
          style={{ fontSize: 72 }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        >
          🎬
        </motion.span>
        <h3 style={{ fontSize: 24, fontWeight: 800, color: "var(--gold)" }}>Movie Coming Soon</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, maxWidth: 320, lineHeight: 1.6 }}>
          Your birthday movie is still being polished. Drop your video into{" "}
          <code style={{ background: "rgba(255,255,255,0.15)", padding: "2px 6px", borderRadius: 4 }}>public/videos/birthday.mp4</code>{" "}
          and it will appear here.
        </p>
      </motion.div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#000",
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      <video
        ref={videoRef}
        src={src}
        preload="metadata"
        playsInline
        muted={false}
        style={{ width: "100%", height: "100%", objectFit: "contain", background: "#000" }}
        onLoadedMetadata={(e) => {
          setDur(e.currentTarget.duration || 0);
          setStatus("ready");
        }}
        onError={() => setStatus("missing")}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onPlay={() => {
          setPlaying(true);
          setNeedsUserPlay(false);
        }}
        onPause={() => setPlaying(false)}
        onVolumeChange={(e) => {
          setVol(e.currentTarget.volume);
          setMuted(e.currentTarget.muted);
        }}
      />

      {/* Buffering spinner */}
      {buffering && status === "ready" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", zIndex: 5 }}>
          <motion.div
            style={{ width: 40, height: 40, border: "4px solid rgba(255,255,255,0.2)", borderTopColor: "var(--gold)", borderRadius: "50%" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}

      {/* Autoplay with sound was blocked — ask the player to start it */}
      {needsUserPlay && status === "ready" && !playing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(2px)",
          }}
        >
          <motion.span style={{ fontSize: 60 }} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.8, repeat: Infinity }}>
            🔊
          </motion.span>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, textAlign: "center", maxWidth: 300, lineHeight: 1.5 }}>
            Press play to start the movie with sound.
          </p>
          <motion.button
            onClick={playWithSound}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "14px 34px",
              fontSize: 17,
              fontWeight: 700,
              borderRadius: "var(--radius-sm)",
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)",
              color: "#1a1a2e",
              fontFamily: "inherit",
              boxShadow: "0 0 26px rgba(255,215,0,0.55)",
            }}
          >
            ▶️ Play with Sound
          </motion.button>
        </motion.div>
      )}

      {/* Big play overlay when paused & ready (autoplay permitted) */}
      {!playing && status === "ready" && !needsUserPlay && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={togglePlay}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 4,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.span whileHover={{ scale: 1.15 }} style={{ fontSize: 64, filter: "drop-shadow(0 0 20px rgba(255,215,0,0.6))" }}>
            ▶️
          </motion.span>
        </motion.button>
      )}

      {/* Controls */}
      <div
        style={{
          position: "absolute",
          left: 8,
          right: 8,
          bottom: 8,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 12px",
          borderRadius: 12,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(8px)",
        }}
      >
        <button
          onClick={togglePlay}
          style={ctrlStyle}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? "⏸" : "▶"}
        </button>
        <button onClick={() => skip(-10)} style={ctrlStyle} aria-label="Back 10 seconds">
          ⏪10
        </button>
        <span style={{ fontSize: 12, color: "#fff", minWidth: 78, textAlign: "center" }}>
          {format(time)} / {format(dur)}
        </span>
        <div
          onClick={seek}
          style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.25)", borderRadius: 3, cursor: "pointer", position: "relative" }}
        >
          <div
            style={{
              width: `${dur ? (time / dur) * 100 : 0}%`,
              height: "100%",
              background: "linear-gradient(90deg, var(--accent-pink), var(--gold))",
              borderRadius: 3,
            }}
          />
        </div>
        <button onClick={toggleMute} style={ctrlStyle} aria-label="Mute">
          {muted || vol === 0 ? "🔇" : "🔊"}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={muted ? 0 : vol}
          onChange={(e) => {
            const v = videoRef.current;
            if (v) {
              v.volume = parseFloat(e.target.value);
            }
          }}
          style={{ width: 64, accentColor: "var(--gold)" }}
          aria-label="Volume"
        />
        <button onClick={() => skip(10)} style={ctrlStyle} aria-label="Forward 10 seconds">
          10⏩
        </button>
        {pipSupported && (
          <button onClick={togglePip} style={ctrlStyle} aria-label="Picture in picture">
            {pipOn ? "🖥️" : "📺"}
          </button>
        )}
        <button onClick={toggleFullscreen} style={ctrlStyle} aria-label="Fullscreen">
          {full ? "⤓" : "⤢"}
        </button>
      </div>
    </div>
  );
}

const ctrlStyle = {
  background: "rgba(255,255,255,0.12)",
  border: "none",
  color: "#fff",
  fontSize: 14,
  padding: "6px 10px",
  borderRadius: 8,
  cursor: "pointer",
  fontFamily: "inherit",
  fontWeight: 600,
  minWidth: 34,
};
