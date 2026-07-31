import { memo } from "react";
import { motion } from "framer-motion";

/**
 * A cute envelope. Wiggles gently, glows on hover, shows a golden ribbon once read.
 * @param {{title: string, isRead: boolean, golden?: boolean, onOpen: () => void, index: number, titleWidth?: number}} props
 */
function Envelope({ title, isRead, golden = false, onOpen, index, titleWidth = 78 }) {
  const wiggleDelay = 2.5 + (index % 5) * 1.1;
  const pastel = golden ? "#ffd76a" : ["#ffc9de", "#bfe3ff", "#d9ccff", "#c3f2dd", "#ffe6b8", "#ffd4c9"][index % 6];

  return (
    <motion.div
      onClick={onOpen}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}
      whileHover={{ scale: 1.12 }}
    >
      <motion.div
        animate={{ rotate: isRead ? [0, -3, 3, 0] : [0, -4, 4, 0] }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          repeatDelay: isRead ? 5 + (index % 4) : 2.5 + (index % 5) * 0.9,
        }}
        style={{ position: "relative", width: 74, height: 52 }}
      >
        {/* body */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 8,
            background: golden
              ? "linear-gradient(135deg, #fff3b0 0%, #ffd76a 55%, #f0a500 100%)"
              : `linear-gradient(135deg, ${pastel} 0%, ${pastel} 100%)`,
            boxShadow: golden
              ? "0 0 24px rgba(255,215,0,0.85), inset 0 0 14px rgba(255,255,255,0.5)"
              : isRead
              ? "0 0 12px rgba(255,215,0,0.35)"
              : "0 6px 18px rgba(0,0,0,0.25)",
            opacity: isRead ? 0.85 : 1,
            transition: "box-shadow 0.3s, opacity 0.3s",
          }}
        />
        {/* flap */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            borderLeft: "37px solid transparent",
            borderRight: "37px solid transparent",
            borderTop: "26px solid rgba(255,255,255,0.65)",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />
        {/* seal */}
        <motion.div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: 18,
            filter: golden ? "drop-shadow(0 0 6px rgba(255,255,255,0.9))" : "none",
          }}
          animate={{ scale: golden ? [1, 1.15, 1] : 1 }}
          transition={{ duration: 1.6, repeat: golden ? Infinity : 0 }}
        >
          {golden ? "⭐" : "💌"}
        </motion.div>
        {/* ribbon when read */}
        {isRead && (
          <motion.span
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{ position: "absolute", right: -12, top: -12, fontSize: 22, filter: "drop-shadow(0 0 4px rgba(255,215,0,0.8))" }}
          >
            🎀
          </motion.span>
        )}
      </motion.div>
      <span
        className="env-title"
        style={{
          fontSize: 10,
          maxWidth: titleWidth,
          textAlign: "center",
          lineHeight: 1.25,
          color: isRead ? "var(--gold)" : "var(--text-secondary)",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {title}
      </span>
    </motion.div>
  );
}

export default memo(Envelope);
