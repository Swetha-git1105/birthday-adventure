import { memo } from "react";
import { motion } from "framer-motion";

const BODY_COLORS = {
  red: ["#ff5252", "#d81f45"],
  blue: ["#5b9aff", "#2f6fd6"],
  purple: ["#a855f7", "#7c3aed"],
  pink: ["#ff8fab", "#ff6b9d"],
  orange: ["#ffb347", "#ff8c42"],
  green: ["#7dff82", "#3ecf6b"],
};

/**
 * A single floating balloon.
 * @param {{balloon: object, onPop: (e: React.PointerEvent, balloon: object) => void}} props
 */
function Balloon({ balloon, onPop }) {
  const { color, size, swayDur, dur, delay, golden } = balloon;
  const body = golden ? ["#ffe873", "#ffb300"] : BODY_COLORS[color];
  const gradId = `bloon-${balloon.id}`;

  return (
    <div
      style={{
        position: "absolute",
        left: `${balloon.x}%`,
        top: 0,
        width: 0,
        height: 0,
        zIndex: golden ? 6 : 3,
        animation: `balloon-rise ${dur}s linear infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <motion.div
        onClick={(e) => {
          e.stopPropagation();
          onPop(e, balloon);
        }}
        style={{
          position: "absolute",
          left: -size / 2,
          top: -size / 2,
          cursor: "pointer",
          animation: `balloon-sway ${swayDur}s ease-in-out infinite`,
          filter: golden ? "drop-shadow(0 0 14px rgba(255,215,0,0.9))" : "drop-shadow(0 2px 6px rgba(0,0,0,0.2))",
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
      >
        {golden && (
          <motion.span
            style={{ position: "absolute", left: size * 0.28, top: -size * 0.12, fontSize: size * 0.28, pointerEvents: "none" }}
            animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.15, 0.9] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            ✨
          </motion.span>
        )}
        <BalloonSVG size={size} top={body[0]} bottom={body[1]} gradId={gradId} />
      </motion.div>
    </div>
  );
}

export default memo(Balloon);

/**
 * @param {{size: number, top: string, bottom: string, gradId: string}} props
 */
function BalloonSVG({ size, top, bottom, gradId }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 80 100">
      <defs>
        <radialGradient id={gradId} cx="0.35" cy="0.25" r="0.9">
          <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
          <stop offset="45%" stopColor={top} />
          <stop offset="100%" stopColor={bottom} />
        </radialGradient>
      </defs>
      <ellipse cx="40" cy="38" rx="28" ry="34" fill={`url(#${gradId})`} opacity="0.92" />
      <path d="M40 70 L37 84 L43 84 Z" fill={bottom} opacity="0.9" />
      <path
        d="M40 4 Q24 18 26 38"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="30" cy="28" rx="7" ry="11" fill="rgba(255,255,255,0.35)" transform="rotate(-20 30 28)" />
    </svg>
  );
}
