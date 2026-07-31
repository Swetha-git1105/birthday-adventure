import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SceneWrapper from "../components/SceneWrapper.jsx";
import HUD from "../components/HUD.jsx";
import CollectibleStar from "../components/CollectibleStar.jsx";
import GameButton from "../components/GameButton.jsx";
import FireworksCanvas from "../components/FireworksCanvas.jsx";
import { playCelebration } from "../utils/sounds.js";
import { content } from "../data/content.js";

/** 15 star positions in a heart shape (viewBox 0 0 100 66) */
const CONSTELLATION = [
  { x: 22, y: 18 },
  { x: 30, y: 12 },
  { x: 38, y: 16 },
  { x: 44, y: 22 },
  { x: 26, y: 26 },
  { x: 34, y: 34 },
  { x: 42, y: 42 },
  { x: 50, y: 52 },
  { x: 58, y: 42 },
  { x: 66, y: 34 },
  { x: 74, y: 26 },
  { x: 56, y: 22 },
  { x: 62, y: 16 },
  { x: 70, y: 12 },
  { x: 78, y: 18 },
];

/** A star with a glowing comet tail sweeping across the sky once */
function ShootingStar() {
  return (
    <motion.div
      initial={{ opacity: 0, x: "-20vw", y: "-10vh", rotate: 28 }}
      animate={{ opacity: [0, 1, 1, 0], x: "115vw", y: "40vh", rotate: 28 }}
      transition={{ duration: 3.2, delay: 1.6, ease: "easeIn" }}
      style={{ position: "absolute", top: "6%", left: 0, zIndex: 25, pointerEvents: "none" }}
    >
      <div
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 0 12px #fff, 0 0 30px rgba(255,255,255,0.8)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 1.5,
          left: 4,
          width: 130,
          height: 2,
          borderRadius: 2,
          background: "linear-gradient(270deg, rgba(255,255,255,0.85), transparent)",
        }}
      />
    </motion.div>
  );
}

/**
 * @param {{onReturnToMap: () => void, onCompleteScene: (id:string)=>void, collectedStars: number[], collectStar: (id:number)=>void, resetProgress: () => void}} props
 */
export default function Finale({ onReturnToMap, onCompleteScene, collectedStars, collectStar, resetProgress }) {
  const [revealed, setRevealed] = useState(() => collectedStars.includes(15));
  const celebrateRef = useRef(false);

  const handleStarCollect = useCallback(
    (id) => {
      collectStar(id);
      setRevealed(true);
      playCelebration();
    },
    [collectStar]
  );

  const finishScene = useCallback(() => {
    if (!celebrateRef.current) {
      celebrateRef.current = true;
      onCompleteScene("finale");
    }
  }, [onCompleteScene]);

  return (
    <SceneWrapper
      sceneId="finale"
      onReturnToMap={onReturnToMap}
      onCompleteScene={onCompleteScene}
      collectedStars={collectedStars}
      collectStar={collectStar}
    >
      {({ isCollected, markComplete }) => (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, #1a0f3e 0%, #0a0a1f 70%)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <HUD collectedStars={collectedStars} onReturnToMap={onReturnToMap} />

          {/* Twinkling background stars */}
          <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
            {Array.from({ length: 42 }).map((_, i) => {
              const left = (i * 37 + 11) % 100;
              const top = (i * 53 + 7) % 100;
              return (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.15, 0.9, 0.15], scale: [1, 1.3, 1] }}
                  transition={{ duration: 2 + (i % 5) * 0.7, repeat: Infinity, delay: (i % 9) * 0.3 }}
                  style={{
                    position: "absolute",
                    left: `${left}%`,
                    top: `${top}%`,
                    width: 2 + (i % 3),
                    height: 2 + (i % 3),
                    borderRadius: "50%",
                    background: "#fff",
                  }}
                />
              );
            })}
          </div>

          {revealed && <FireworksCanvas active />}
          {revealed && <ShootingStar />}

          <AnimatePresence mode="wait">
            {!revealed && (
              <motion.div
                key="collect"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={{ textAlign: "center", zIndex: 30, padding: "0 20px" }}
              >
                <motion.h2
                  style={{
                    fontSize: 34,
                    fontWeight: 800,
                    color: "var(--gold)",
                    textShadow: "0 0 30px rgba(255,215,0,0.6)",
                    marginBottom: 16,
                  }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✨ The Final Star ✨
                </motion.h2>
                <p style={{ color: "var(--text-secondary)", fontSize: 16, marginBottom: 28 }}>
                  One last star to make your constellation shine.
                </p>
                {!isCollected(15) && (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <CollectibleStar starId={15} onCollect={handleStarCollect} size={90} />
                  </div>
                )}
              </motion.div>
            )}

            {revealed && (
              <motion.div
                key="finale"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ position: "relative", zIndex: 30, textAlign: "center", padding: "0 20px", display: "flex", flexDirection: "column", alignItems: "center" }}
              >
                <motion.h1
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                  style={{
                    fontSize: 40,
                    fontWeight: 900,
                    background: "linear-gradient(135deg, var(--gold) 0%, var(--accent-pink) 50%, var(--accent-purple) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    marginBottom: 6,
                  }}
                >
                  Happy {content.age}th Birthday, {content.sisterName}!
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  style={{ color: "var(--text-secondary)", fontSize: 15, marginBottom: 18 }}
                >
                  All {content.age} stars collected. Your constellation shines bright! ✨
                </motion.p>

                {/* 15-star constellation */}
                <svg viewBox="0 0 100 66" style={{ width: 560, maxWidth: "92vw", height: "auto", marginBottom: 12 }}>
                  {CONSTELLATION.slice(0, -1).map((p, i) => {
                    const n = CONSTELLATION[i + 1];
                    return (
                      <motion.line
                        key={`line-${i}`}
                        x1={p.x}
                        y1={p.y}
                        x2={n.x}
                        y2={n.y}
                        stroke="rgba(255,215,0,0.55)"
                        strokeWidth="0.25"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.7, delay: 1 + i * 0.09 }}
                      />
                    );
                  })}
                  {CONSTELLATION.map((p, i) => (
                    <g key={`star-${i}`}>
                      <circle cx={p.x} cy={p.y} r="1.3" fill="rgba(255,215,0,0.3)">
                        <animate attributeName="r" values="1.3;2.4;1.3" dur="2s" begin={`${i * 0.25}s`} repeatCount="indefinite" />
                      </circle>
                      <path
                        d="M0 -1.7 L0.495 -0.525 L1.617 -0.525 L0.693 0.19 L1 1.325 L0 0.675 L-1 1.325 L-0.693 0.19 L-1.617 -0.525 L-0.495 -0.525 Z"
                        transform={`translate(${p.x} ${p.y}) scale(1.6)`}
                        fill="#ffd700"
                        opacity={0.95}
                        filter="url(#starGlow)"
                        shapeRendering="geometricPrecision"
                      />
                    </g>
                  ))}
                  <defs>
                    <filter id="starGlow" x="-60%" y="-60%" width="220%" height="220%">
                      <feGaussianBlur stdDeviation="0.8" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                </svg>

                {/* Final message */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.6 }}
                  className="parchment"
                  style={{ maxWidth: 540, width: "90%", marginBottom: 24, whiteSpace: "pre-line" }}
                >
                  <p style={{ fontFamily: "var(--font-hand)", fontSize: 20, lineHeight: 1.7, color: "var(--text-primary)" }}>
                    {content.finalMessage}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3.1 }}
                  style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}
                >
                  <GameButton
                    onClick={() => markComplete("The Birthday Adventure is Complete!")}
                    variant="gold"
                    size="lg"
                  >
                    🎂 Happy Birthday!
                  </GameButton>
                  <GameButton
                    onClick={() => {
                      finishScene();
                      if (window.confirm("Restart the adventure from the beginning? All progress will be reset.")) {
                        resetProgress();
                        window.location.reload();
                      }
                    }}
                    variant="secondary"
                    size="md"
                  >
                    🔄 Replay Adventure
                  </GameButton>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </SceneWrapper>
  );
}
