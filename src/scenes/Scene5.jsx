import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SceneWrapper from "../components/SceneWrapper.jsx";
import HUD from "../components/HUD.jsx";
import CollectibleStar from "../components/CollectibleStar.jsx";
import VideoPlayer from "../components/VideoPlayer.jsx";
import { playClick, playTreasureOpen } from "../utils/sounds.js";
import { content } from "../data/content.js";

const CINEMA_STARS = [11, 12, 13, 14];
const STAR_POSITIONS = [
  { x: "9%", y: "22%" },
  { x: "84%", y: "20%" },
  { x: "11%", y: "72%" },
  { x: "80%", y: "68%" },
];

const POSTERS = [
  { emoji: "🎈", from: "Balloon Kingdom", style: "linear-gradient(160deg, #ff9ebc, #7c3aed)" },
  { emoji: "🎂", from: "The Birthday Cake", style: "linear-gradient(160deg, #ffd97a, #ff6b9d)" },
  { emoji: "🌷", from: "The Letter Garden", style: "linear-gradient(160deg, #c9f0e2, #a78ee0)" },
];

const VIDEO_SRC = `${import.meta.env.BASE_URL}videos/${content.videoFileName}`;

/**
 * @param {{onReturnToMap: () => void, onCompleteScene: (id:string)=>void, collectedStars: number[], collectStar: (id:number)=>void}} props
 */
export default function Scene5({ onReturnToMap, onCompleteScene, collectedStars, collectStar }) {
  const [phase, setPhase] = useState("lobby"); // lobby → theatre
  const allCollected = CINEMA_STARS.every((id) => collectedStars.includes(id));

  const enterTheatre = () => {
    playTreasureOpen();
    setPhase("theatre");
  };

  return (
    <SceneWrapper
      sceneId="scene5"
      onReturnToMap={onReturnToMap}
      onCompleteScene={onCompleteScene}
      collectedStars={collectedStars}
      collectStar={collectStar}
    >
      {({ collectStar: cs, isCollected, markComplete }) => (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 50% 30%, #2a1245 0%, #15082a 60%, #0a0418 100%)",
            overflow: "hidden",
          }}
        >
          <HUD collectedStars={collectedStars} onReturnToMap={onReturnToMap} />

          {/* Soft marquee glow */}
          <div
            style={{
              position: "absolute",
              top: "6%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 480,
              height: 90,
              background: "radial-gradient(ellipse, rgba(255,107,157,0.25) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <AnimatePresence mode="wait">
            {phase === "lobby" ? (
              <Lobby key="lobby" onEnter={enterTheatre} />
            ) : (
              <Theatre
                key="theatre"
                onReturnToMap={onReturnToMap}
                collectedStars={collectedStars}
                isCollected={isCollected}
                onCollectStar={(id) => cs(id)}
                allCollected={allCollected}
                onCelebrate={() => markComplete("Cinema Complete!")}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </SceneWrapper>
  );
}

/** Cinema entrance: ticket booth, posters, popcorn, closed curtains */
function Lobby({ onEnter }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.6 }}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
      }}
    >
      <motion.h2
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          fontSize: 32,
          fontWeight: 800,
          letterSpacing: 5,
          color: "#fff",
          textShadow: "0 0 26px rgba(255,107,157,0.7)",
        }}
      >
        🎬 CINEMA
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        style={{ color: "var(--text-secondary)", fontSize: 14, letterSpacing: 2, marginTop: 4, textTransform: "uppercase" }}
      >
        Now showing: {content.movieTitle}
      </motion.p>

      {/* Posters */}
      <div style={{ display: "flex", gap: 18, marginTop: 34, flexWrap: "wrap", justifyContent: "center" }}>
        {POSTERS.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.15, type: "spring" }}
            whileHover={{ y: -8, rotate: i % 2 ? 2 : -2 }}
            style={{
              width: 120,
              height: 168,
              borderRadius: 10,
              background: p.style,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 14px 34px rgba(0,0,0,0.5), inset 0 0 24px rgba(255,255,255,0.12)",
              border: "2px solid rgba(255,255,255,0.15)",
            }}
          >
            <span style={{ fontSize: 46 }}>{p.emoji}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", textAlign: "center", padding: "0 8px" }}>{p.from}</span>
          </motion.div>
        ))}
      </div>

      {/* Ticket booth */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, type: "spring" }}
        className="glass"
        style={{
          marginTop: 30,
          padding: "18px 34px",
          display: "flex",
          alignItems: "center",
          gap: 18,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 40 }}>🎟️</div>
        <div>
          <p style={{ fontSize: 11, color: "var(--text-secondary)", letterSpacing: 2, textTransform: "uppercase" }}>Box Office</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginTop: 2 }}>Admission: One Golden Smile</p>
        </div>
        <motion.button
          onClick={onEnter}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          style={{
            padding: "12px 26px",
            fontSize: 16,
            fontWeight: 700,
            borderRadius: "var(--radius-sm)",
            border: "none",
            cursor: "pointer",
            background: "linear-gradient(135deg, #ff6b9d 0%, #d84d7e 100%)",
            color: "#fff",
            fontFamily: "inherit",
            boxShadow: "0 4px 22px rgba(255,107,157,0.5)",
          }}
        >
          🍿 Get Ticket
        </motion.button>
      </motion.div>

      {/* Popcorn bucket */}
      <motion.span
        style={{ position: "absolute", left: "8%", bottom: "14%", fontSize: 60 }}
        animate={{ rotate: [-4, 4, -4] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        🍿
      </motion.span>
      <motion.span
        style={{ position: "absolute", right: "10%", bottom: "20%", fontSize: 44 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        🎥
      </motion.span>
    </motion.div>
  );
}

/** Theatre: curtains open, projector on, video plays */
function Theatre({ collectedStars, isCollected, onCollectStar, allCollected, onCelebrate }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{ position: "absolute", inset: 0, zIndex: 10 }}
    >
      {/* Curtains (parting open) */}
      <Curtain side="left" />
      <Curtain side="right" />

      {/* Projector beam + dust */}
      <ProjectorBeam />

      {/* Screen area */}
      <div
        style={{
          position: "absolute",
          inset: "0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 16px 20px",
        }}
      >
        <motion.h3
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ fontSize: 18, fontWeight: 700, letterSpacing: 3, color: "var(--gold)", marginBottom: 16, textAlign: "center" }}
        >
          {content.movieTitle}
        </motion.h3>

        {/* Screen */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          style={{
            position: "relative",
            width: "min(700px, 94vw)",
            aspectRatio: "16/9",
            borderRadius: 14,
            overflow: "hidden",
            border: "3px solid rgba(255,255,255,0.12)",
            boxShadow: "0 0 60px rgba(255,107,157,0.35), 0 24px 60px rgba(0,0,0,0.7)",
            background: "#000",
            zIndex: 5,
          }}
        >
          <VideoPlayer src={VIDEO_SRC} title={content.movieTitle} autoPlay />
        </motion.div>

        <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 16, textAlign: "center" }}>
          {allCollected ? "All four stars found!" : "Four magic stars are hiding around the theatre… ✨"}
        </p>

        {allCollected && (
          <motion.button
            onClick={onCelebrate}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.08 }}
            style={{
              marginTop: 14,
              padding: "14px 34px",
              fontSize: 17,
              fontWeight: 700,
              borderRadius: "var(--radius-sm)",
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)",
              color: "#1a1a2e",
              fontFamily: "inherit",
              boxShadow: "0 0 30px rgba(255,215,0,0.5)",
            }}
          >
            🎉 Celebrate!
          </motion.button>
        )}
      </div>

      {/* Stars appear once the projector is on */}
      {STAR_POSITIONS.map((pos, i) => {
        const id = CINEMA_STARS[i];
        if (isCollected(id)) return null;
        return (
          <motion.div
            key={`star-${id}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 + i * 0.25, type: "spring" }}
            style={{ position: "absolute", left: pos.x, top: pos.y, zIndex: 30 }}
          >
            <CollectibleStar
              starId={id}
              onCollect={(sid) => {
                onCollectStar(sid);
                playClick();
              }}
              size={54}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}

/** Projector that switches on and a light beam with drifting dust */
function ProjectorBeam() {
  const dust = [
    { left: 26, top: 20, size: 5, delay: 0, duration: 7 },
    { left: 40, top: 44, size: 4, delay: 1.4, duration: 8 },
    { left: 55, top: 30, size: 6, delay: 0.6, duration: 6 },
    { left: 68, top: 55, size: 3, delay: 2.2, duration: 9 },
    { left: 30, top: 62, size: 4, delay: 3, duration: 7.5 },
    { left: 60, top: 66, size: 5, delay: 4.2, duration: 8 },
    { left: 44, top: 12, size: 3, delay: 5, duration: 6.5 },
    { left: 74, top: 38, size: 4, delay: 6.1, duration: 9.5 },
    { left: 34, top: 36, size: 5, delay: 1, duration: 7 },
    { left: 52, top: 8, size: 3, delay: 2.8, duration: 6 },
  ];
  return (
    <>
      {/* Projector housing */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ position: "absolute", left: 18, top: 84, zIndex: 20, fontSize: 30, filter: "drop-shadow(0 0 8px rgba(255,255,255,0.3))" }}
      >
        📽️
      </motion.div>

      {/* Light beam */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1.2 }}
        style={{
          position: "absolute",
          left: "12%",
          top: "22%",
          width: "46%",
          height: "54%",
          transform: "perspective(600px) rotateY(14deg)",
          background: "linear-gradient(120deg, rgba(255,250,220,0.28) 0%, rgba(255,250,220,0.08) 55%, transparent 85%)",
          clipPath: "polygon(0 0, 100% 22%, 100% 78%, 0 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        {dust.map((d, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{ opacity: [0, 0.85, 0], x: [0, 120, 260], y: [0, 26, -12] }}
            transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              left: `${d.left}%`,
              top: `${d.top}%`,
              width: d.size,
              height: d.size,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,250,210,0.95), rgba(255,250,210,0.15))",
            }}
          />
        ))}
      </motion.div>
    </>
  );
}

/** Red velvet curtain that parts open */
function Curtain({ side }) {
  return (
    <motion.div
      initial={{ width: "50%" }}
      animate={{ width: "0%" }}
      transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        [side]: 0,
        width: "50%",
        zIndex: 15,
        background: "repeating-linear-gradient(90deg, #8e1230 0 26px, #a0183a 26px 52px, #7d0f2a 52px 78px)",
        boxShadow: side === "left" ? "10px 0 40px rgba(0,0,0,0.6)" : "-10px 0 40px rgba(0,0,0,0.6)",
        overflow: "hidden",
      }}
    >
      {/* curtain folds highlight */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "repeating-linear-gradient(90deg, transparent 0 20px, rgba(0,0,0,0.18) 20px 26px, transparent 26px 52px)",
        }}
      />
      {/* golden trim */}
      <div
        style={{
          position: "absolute",
          [side]: 0,
          top: 0,
          bottom: 0,
          width: 10,
          background: "linear-gradient(180deg, #ffd700, #b8860b)",
          opacity: 0.85,
        }}
      />
      {/* curtain rod */}
      <div style={{ position: "absolute", top: -4, left: 0, right: 0, height: 14, background: "linear-gradient(180deg, #3a2a2a, #1a0f0f)", borderRadius: 4, zIndex: 2 }} />
    </motion.div>
  );
}
