import { motion } from "framer-motion";
import { TOTAL_STARS } from "../data/constants.js";
import Star from "./Star.jsx";
import GameButton from "./GameButton.jsx";

/**
 * @param {{collectedStars: number[], onReturnToMap: () => void}} props
 */
export default function HUD({ collectedStars, onReturnToMap }) {
  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        zIndex: 100,
        background: "linear-gradient(180deg, rgba(10,14,39,0.85) 0%, transparent 100%)",
      }}
    >
      <GameButton onClick={onReturnToMap} variant="secondary" size="sm">
        ← Map
      </GameButton>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Star id="hud-star" size={28} animate={false} />
        <motion.span
          key={collectedStars.length}
          initial={{ scale: 1.4 }}
          animate={{ scale: 1 }}
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "var(--gold)",
            textShadow: "0 0 10px rgba(255,215,0,0.5)",
          }}
        >
          {collectedStars.length}/{TOTAL_STARS}
        </motion.span>
      </div>
    </motion.div>
  );
}
