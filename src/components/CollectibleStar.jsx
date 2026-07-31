import { motion } from "framer-motion";

/**
 * An interactive collectible star floating in a scene.
 * @param {{starId: number, onCollect: (id:number) => void, size?: number, style?: React.CSSProperties}} props
 */
export default function CollectibleStar({ starId, onCollect, size = 52, style = {} }) {
  return (
    <motion.button
      onClick={() => onCollect(starId)}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0, rotate: -180, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18, delay: Math.random() * 0.3 }}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        ...style,
      }}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        animate={{
          y: [0, -8, 0],
          filter: [
            "drop-shadow(0 0 8px rgba(255,215,0,0.8))",
            "drop-shadow(0 0 18px rgba(255,215,0,1))",
            "drop-shadow(0 0 8px rgba(255,215,0,0.8))",
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill="#ffd700"
          stroke="#ffaa00"
          strokeWidth="0.5"
        />
      </motion.svg>
    </motion.button>
  );
}
