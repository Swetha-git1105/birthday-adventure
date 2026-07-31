import { motion } from "framer-motion";
import { playClick, playButtonHover } from "../utils/sounds.js";

/**
 * @param {{children: React.ReactNode, onClick?: () => void, variant?: 'primary'|'secondary'|'gold', size?: 'sm'|'md'|'lg', disabled?: boolean, className?: string}} props
 */
export default function GameButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
}) {
  const variants = {
    primary: {
      background: "linear-gradient(135deg, #4ecdc4 0%, #44a8b3 100%)",
      color: "#fff",
    },
    secondary: {
      background: "var(--glass-bg)",
      color: "var(--text-primary)",
      border: "1px solid var(--glass-border)",
    },
    gold: {
      background: "linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)",
      color: "#1a1a2e",
    },
  };

  const sizes = {
    sm: { padding: "8px 20px", fontSize: "14px" },
    md: { padding: "12px 28px", fontSize: "16px" },
    lg: { padding: "16px 40px", fontSize: "20px" },
  };

  return (
    <motion.button
      className={className}
      onClick={() => {
        if (!disabled) {
          playClick();
          onClick?.();
        }
      }}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.05, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      onHoverStart={() => {
        if (!disabled) playButtonHover();
      }}
      style={{
        ...variants[variant],
        ...sizes[size],
        border: variants[variant].border || "none",
        borderRadius: "var(--radius-sm)",
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 600,
        letterSpacing: "0.5px",
        opacity: disabled ? 0.5 : 1,
        fontFamily: "inherit",
        boxShadow: disabled ? "none" : "0 4px 20px rgba(0,0,0,0.3)",
        transition: "opacity 0.2s",
      }}
    >
      {children}
    </motion.button>
  );
}
