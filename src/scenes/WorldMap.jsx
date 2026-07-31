import { useMemo } from "react";
import { motion } from "framer-motion";
import { SCENE_IDS, SCENE_NAMES, SCENE_ICONS, TOTAL_STARS } from "../data/constants.js";
import { playClick } from "../utils/sounds.js";
import GameButton from "../components/GameButton.jsx";
import Star from "../components/Star.jsx";

/** Node positions on the map (percentage-based for responsiveness) */
const NODE_POSITIONS = [
  { x: 10, y: 50 },
  { x: 30, y: 25 },
  { x: 50, y: 60 },
  { x: 70, y: 30 },
  { x: 85, y: 55 },
  { x: 50, y: 88 },
];

/** Smooth S-curve between two nodes (cubic Bézier) */
function curvePath(a, b) {
  const mx = (a.x + b.x) / 2;
  return `M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
}

/**
 * @param {{onSelectScene: (id:string)=>void, isUnlocked: (id:string)=>boolean, isCompleted: (id:string)=>boolean, collectedStars: number[], resetProgress: () => void}} props
 */
export default function WorldMap({ onSelectScene, isUnlocked, isCompleted, collectedStars, resetProgress }) {
  const paths = useMemo(() => {
    const result = [];
    for (let i = 0; i < NODE_POSITIONS.length - 1; i++) {
      const a = NODE_POSITIONS[i];
      const b = NODE_POSITIONS[i + 1];
      const unlocked = isCompleted(SCENE_IDS[i]);
      result.push({
        key: `${i}-${i + 1}`,
        id: `mapPath-${i}`,
        d: curvePath(a, b),
        unlocked,
      });
    }
    return result;
  }, [isCompleted]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{
          padding: "20px 0 8px",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            background: "linear-gradient(135deg, var(--gold) 0%, var(--accent-pink) 50%, var(--accent-purple) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "none",
          }}
        >
          Birthday Adventure
        </h1>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 6 }}>
          <Star id="map-star" size={22} animate={false} />
          <span style={{ color: "var(--text-secondary)", fontSize: 15 }}>
            {collectedStars.length} / {TOTAL_STARS} Stars
          </span>
        </div>
      </motion.div>

      {/* Map area */}
      <div style={{ position: "relative", flex: 1, width: "100%", maxWidth: 900, margin: "0 auto" }}>
        {/* SVG curved paths */}
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="pathSparkle" x="-200%" y="-200%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="0.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {paths.map((p) => (
            <g key={p.key}>
              {/* soft blurred glow underneath */}
              <path
                d={p.d}
                fill="none"
                stroke={p.unlocked ? "rgba(255,215,0,0.55)" : "rgba(255,255,255,0.12)"}
                strokeWidth="1.6"
                style={{ filter: "blur(2.5px)" }}
                opacity={p.unlocked ? 0.9 : 0.4}
              />
              {/* main flowing dotted path */}
              <path
                id={p.id}
                d={p.d}
                fill="none"
                stroke={p.unlocked ? "rgba(255,215,0,0.9)" : "rgba(255,255,255,0.28)"}
                strokeWidth="0.45"
                strokeLinecap="round"
                strokeDasharray="0.55 0.85"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="2.8"
                  to="0"
                  dur={p.unlocked ? "2.2s" : "6s"}
                  repeatCount="indefinite"
                />
              </path>
              {/* travelling sparkle along unlocked paths */}
              {p.unlocked && (
                <circle r="0.85" fill="#fff3b0" style={{ filter: "url(#pathSparkle)" }}>
                  <animateMotion dur="3.4s" repeatCount="indefinite" rotate="0">
                    <mpath href={`#${p.id}`} />
                  </animateMotion>
                </circle>
              )}
            </g>
          ))}
        </svg>

        {/* Scene nodes */}
        {SCENE_IDS.map((id, i) => {
          const pos = NODE_POSITIONS[i];
          const unlocked = isUnlocked(id);
          const completed = isCompleted(id);

          return (
            <motion.button
              key={id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.1, type: "spring", stiffness: 200 }}
              whileHover={unlocked ? { scale: 1.12, y: -4 } : {}}
              whileTap={unlocked ? { scale: 0.95 } : {}}
              onClick={() => {
                if (!unlocked) return;
                playClick();
                onSelectScene(id);
              }}
              style={{
                position: "absolute",
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: "translate(-50%, -50%)",
                background: "none",
                border: "none",
                padding: 0,
                cursor: unlocked ? "pointer" : "not-allowed",
                fontFamily: "inherit",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                opacity: unlocked ? 1 : 0.55,
                zIndex: 5,
              }}
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
                style={{ position: "relative", width: "min(96px, 15vw)", height: "min(96px, 15vw)" }}
              >
                {/* completion halo behind completed scenes */}
                {completed && (
                  <motion.span
                    style={{
                      position: "absolute",
                      inset: -10,
                      borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(255,215,0,0.35) 0%, rgba(255,180,60,0.12) 45%, transparent 70%)",
                      pointerEvents: "none",
                    }}
                    animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2.4, repeat: Infinity }}
                  />
                )}

                {/* lock */}
                {!unlocked && (
                  <span style={{ position: "absolute", top: -6, right: -6, fontSize: 16, zIndex: 6, filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.4))" }}>
                    🔒
                  </span>
                )}

                {/* elegant glowing completion badge (replaces the green checkmark) */}
                {completed && <CompletionBadge />}

                <LocationArt sceneId={id} completed={completed} unlocked={unlocked} />
              </motion.div>

              {/* label */}
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.3px",
                  color: completed ? "var(--gold)" : unlocked ? "var(--text-primary)" : "var(--text-secondary)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "min(96px, 15vw)",
                  textAlign: "center",
                  textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                }}
              >
                {SCENE_NAMES[id]}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Reset button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{ padding: "12px 0 20px" }}
      >
        <GameButton
          onClick={() => {
            if (window.confirm("Reset ALL progress? This cannot be undone.")) {
              resetProgress();
              window.location.reload();
            }
          }}
          variant="secondary"
          size="sm"
        >
          Reset Progress
        </GameButton>
      </motion.div>
    </motion.div>
  );
}

/** Glowing gold star badge shown on completed scenes */
function CompletionBadge() {
  return (
    <motion.span
      initial={{ scale: 0, rotate: -140, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.3 }}
      style={{ position: "absolute", top: -8, right: -8, width: 26, height: 26, zIndex: 6 }}
    >
      {/* pulsing halo */}
      <motion.span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,215,0,0.9) 0%, rgba(255,150,0,0.3) 55%, transparent 75%)",
          filter: "blur(0.5px)",
        }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.95, 0.45, 0.95] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* glowing star */}
      <motion.span
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 15,
          color: "var(--gold)",
          textShadow: "0 0 10px rgba(255,215,0,1), 0 0 18px rgba(255,215,0,0.7)",
        }}
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        ✦
      </motion.span>
      {/* orbiting sparkle */}
      <motion.span
        style={{ position: "absolute", top: -5, right: -5, fontSize: 9 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], rotate: [0, 90, 180] }}
        transition={{ duration: 1.8, repeat: Infinity, delay: 0.7 }}
      >
        ✨
      </motion.span>
    </motion.span>
  );
}

/** Miniature "real location" artwork for each scene node */
function LocationArt({ sceneId, completed, unlocked }) {
  switch (sceneId) {
    case "scene1":
      return <VillageArt />;
    case "scene2":
      return <BalloonsArt />;
    case "scene3":
      return <CakeArt />;
    case "scene4":
      return <DeskArt />;
    case "scene5":
      return <CinemaArt />;
    default:
      return <FinaleArt />;
  }
}

/** ❄️ Snowy penguin village dome */
function VillageArt() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "52% 52% 12px 12px",
        background: "linear-gradient(180deg, #f6fbff 0%, #c6e3f7 55%, #8fc4ea 100%)",
        boxShadow: "inset 0 -12px 20px rgba(255,255,255,0.5), 0 6px 14px rgba(0,0,0,0.25)",
        overflow: "hidden",
      }}
    >
      <motion.span style={{ position: "absolute", top: 8, left: "16%", fontSize: 12, opacity: 0.85 }} animate={{ y: [0, -3, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.4, repeat: Infinity }}>
        ❄️
      </motion.span>
      <motion.span style={{ position: "absolute", top: 22, right: "14%", fontSize: 10, opacity: 0.7 }} animate={{ y: [0, -4, 0], opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 3, repeat: Infinity }}>
        ❄️
      </motion.span>
      <span style={{ position: "absolute", bottom: 6, left: "16%", fontSize: 26 }}>🐧</span>
      <span style={{ position: "absolute", bottom: 8, right: "18%", fontSize: 16 }}>🎿</span>
      {/* igloo door */}
      <div style={{ position: "absolute", bottom: 0, left: "38%", width: 20, height: 15, borderRadius: "10px 10px 0 0", background: "#6ea8d0", boxShadow: "inset 0 3px 4px rgba(255,255,255,0.5)" }} />
      {/* snow ground */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 8, background: "rgba(255,255,255,0.9)" }} />
    </div>
  );
}

/** 🎈 Balloon cluster */
function BalloonsArt() {
  const balloons = [
    { left: "26%", top: 30, color: "#ff6b9d", size: 18 },
    { left: "50%", top: 16, color: "#ffd700", size: 20 },
    { left: "72%", top: 34, color: "#a855f7", size: 16 },
  ];
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 14,
        background: "linear-gradient(180deg, #d6edff 0%, #93caf2 100%)",
        boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
        overflow: "hidden",
      }}
    >
      {balloons.map((b, i) => (
        <motion.div
          key={i}
          style={{ position: "absolute", left: b.left, top: b.top }}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2.2 + i * 0.5, repeat: Infinity }}
        >
          <div
            style={{
              width: b.size,
              height: b.size * 1.2,
              borderRadius: "50% 50% 46% 46%",
              background: b.color,
              boxShadow: "inset -3px -4px 6px rgba(0,0,0,0.18), inset 3px 3px 6px rgba(255,255,255,0.45)",
            }}
          />
          <div style={{ width: 0, height: 0, margin: "-1px auto 0", borderLeft: "3px solid transparent", borderRight: "3px solid transparent", borderTop: "4px solid " + b.color }} />
          <svg width="3" height="10" style={{ margin: "0 auto", display: "block" }}>
            <path d="M1 0 Q2 5 1 10" stroke="rgba(0,0,0,0.3)" strokeWidth="1" fill="none" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

/** 🎂 Mini birthday cake with flickering candles */
function CakeArt() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 14,
        background: "linear-gradient(180deg, #ffe9d0 0%, #ffcfa0 100%)",
        boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
        overflow: "hidden",
      }}
    >
      {[38, 50, 62].map((left, i) => (
        <div key={i} style={{ position: "absolute", bottom: 56, left, width: 4, height: 15, borderRadius: 2, background: "#ff6b9d" }}>
          <motion.div
            style={{
              position: "absolute",
              top: -9,
              left: "50%",
              transform: "translateX(-50%)",
              width: 6,
              height: 9,
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              background: "radial-gradient(circle at 50% 80%, #fff7cc 0%, #ffb300 100%)",
              boxShadow: "0 0 8px rgba(255,170,40,0.9)",
            }}
            animate={{ scale: [1, 1.35, 0.9, 1] }}
            transition={{ duration: 0.5 + i * 0.15, repeat: Infinity }}
          />
        </div>
      ))}
      <div style={{ position: "absolute", bottom: 26, left: "50%", transform: "translateX(-50%)", width: 52, height: 22, borderRadius: 6, background: "linear-gradient(180deg, #ffd9e8 0%, #ff9ebc 100%)" }} />
      <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", width: 62, height: 16, borderRadius: 6, background: "linear-gradient(180deg, #d9ccff 0%, #b49be0 100%)" }} />
      <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", width: 72, height: 6, borderRadius: 4, background: "rgba(255,255,255,0.9)", boxShadow: "0 2px 4px rgba(0,0,0,0.15)" }} />
    </div>
  );
}

/** 💌 Cozy desk with an envelope and lamp */
function DeskArt() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 10,
        background: "linear-gradient(180deg, #f7e7c9 0%, #ecd2a4 100%)",
        boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
        overflow: "hidden",
      }}
    >
      {/* desk lamp */}
      <div style={{ position: "absolute", top: 8, right: 12, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 3, height: 10, background: "#8a5a34" }} />
        <motion.div
          style={{ width: 16, height: 6, borderRadius: 4, background: "#ffd76a", boxShadow: "0 0 8px rgba(255,215,100,0.9)" }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
        <div style={{ width: 10, height: 4, borderRadius: 2, background: "#b07a4e" }} />
      </div>
      {/* envelope */}
      <motion.span
        style={{ position: "absolute", top: 30, left: "50%", transform: "translateX(-50%)", fontSize: 32, filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.3))" }}
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2.6, repeat: Infinity }}
      >
        💌
      </motion.span>
      {/* desk surface with drawers */}
      <div style={{ position: "absolute", bottom: 8, left: "7%", right: "7%", height: 28, borderRadius: 6, background: "linear-gradient(180deg, #b07a4e 0%, #8a5a34 100%)", boxShadow: "0 6px 10px rgba(0,0,0,0.3)" }}>
        <div style={{ position: "absolute", top: 5, left: 10, right: 10, height: 2, background: "rgba(255,255,255,0.28)" }} />
        <div style={{ position: "absolute", top: 16, left: 10, right: 10, height: 2, background: "rgba(60,30,10,0.35)" }} />
        <div style={{ position: "absolute", top: 14, left: 15, width: 5, height: 5, borderRadius: "50%", background: "var(--gold)" }} />
        <div style={{ position: "absolute", top: 14, right: 15, width: 5, height: 5, borderRadius: "50%", background: "var(--gold)" }} />
      </div>
    </div>
  );
}

/** 🎬 Cinema marquee */
function CinemaArt() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 10,
        background: "linear-gradient(180deg, #3a2a5a 0%, #241640 100%)",
        boxShadow: "0 6px 14px rgba(0,0,0,0.35)",
        overflow: "hidden",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          top: 8,
          left: "50%",
          transform: "translateX(-50%)",
          background: "linear-gradient(135deg, #ff6b9d, #d84d7e)",
          padding: "2px 8px",
          borderRadius: 4,
          fontSize: 7,
          fontWeight: 800,
          color: "#fff",
          letterSpacing: 1,
          boxShadow: "0 0 10px rgba(255,107,157,0.9)",
        }}
        animate={{ opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        CINEMA
      </motion.div>
      {/* screen */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: "50%",
          transform: "translateX(-50%)",
          width: 46,
          height: 26,
          borderRadius: 4,
          background: "linear-gradient(180deg, #16162e 0%, #2a2a55 100%)",
          border: "2px solid var(--gold)",
          boxShadow: "0 0 12px rgba(255,215,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
        }}
      >
        🎬
      </div>
      {/* curtains */}
      <div style={{ position: "absolute", bottom: 8, left: 6, width: 15, height: 24, borderRadius: "0 0 6px 6px", background: "linear-gradient(180deg, #c0183c, #8e1230)" }} />
      <div style={{ position: "absolute", bottom: 8, right: 6, width: 15, height: 24, borderRadius: "0 0 6px 6px", background: "linear-gradient(180deg, #c0183c, #8e1230)" }} />
      {/* popcorn + ticket */}
      <span style={{ position: "absolute", bottom: 5, left: "26%", fontSize: 15 }}>🍿</span>
      <span style={{ position: "absolute", bottom: 6, right: "24%", fontSize: 12 }}>🎟️</span>
    </div>
  );
}

/** ⭐ Grand finale star */
function FinaleArt() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        background: "radial-gradient(circle at 50% 45%, #3a2a6a 0%, #191040 72%)",
        boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
        overflow: "hidden",
      }}
    >
      {/* rays */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.span
          key={i}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 66,
            height: 3,
            transformOrigin: "0 50%",
            transform: `translate(-33px, -1.5px) rotate(${i * 45}deg)`,
            background: "linear-gradient(90deg, rgba(255,215,0,0.75), transparent)",
            borderRadius: 2,
          }}
          animate={{ opacity: [0.35, 0.95, 0.35] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
        />
      ))}
      <motion.span
        style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}
        animate={{ scale: [1, 1.12, 1], rotate: [0, 8, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        ⭐
      </motion.span>
      <motion.span style={{ position: "absolute", top: 10, right: 14, fontSize: 10 }} animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.4] }} transition={{ duration: 1.8, repeat: Infinity }}>
        ✨
      </motion.span>
      <motion.span style={{ position: "absolute", bottom: 14, left: 12, fontSize: 9 }} animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.4] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.6 }}>
        ✨
      </motion.span>
    </div>
  );
}
