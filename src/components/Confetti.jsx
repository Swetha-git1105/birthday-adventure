import { motion } from "framer-motion";

const DEFAULT_COLORS = ["#ff6b9d", "#ffd700", "#4ecdc4", "#a855f7", "#ff8c42", "#5b9aff"];

/**
 * Small confetti burst rendered at fixed screen coordinates.
 * @param {{x: number, y: number, colors?: string[], count?: number}} props
 */
export default function Confetti({ x, y, colors = DEFAULT_COLORS, count = 16 }) {
  const parts = Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: Math.random() * Math.PI * 2,
    dist: 36 + Math.random() * 70,
    size: 4 + Math.random() * 6,
    color: colors[i % colors.length],
    round: i % 3 === 0,
    rotate: Math.random() * 360,
  }));

  return (
    <div style={{ position: "fixed", left: x, top: y, zIndex: 80, pointerEvents: "none" }}>
      {parts.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos(p.angle) * p.dist,
            y: Math.sin(p.angle) * p.dist + 46,
            opacity: 0,
            scale: 0.2,
            rotate: p.rotate,
          }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.round ? "50%" : 3,
          }}
        />
      ))}
    </div>
  );
}
