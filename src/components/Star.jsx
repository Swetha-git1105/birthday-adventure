import { motion } from "framer-motion";

/**
 * @param {{id?: string, size?: number, style?: React.CSSProperties, animate?: boolean}} props
 */
export default function Star({ id = "star", size = 40, style = {}, animate = true }) {
  return (
    <motion.svg
      key={id}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={style}
      initial={animate ? { scale: 0, rotate: -180 } : false}
      animate={animate ? { scale: 1, rotate: 0 } : false}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <motion.path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="#ffd700"
        stroke="#ffaa00"
        strokeWidth="0.5"
        style={{
          filter: "drop-shadow(0 0 8px rgba(255,215,0,0.8))",
        }}
        animate={
          animate
            ? {
                filter: [
                  "drop-shadow(0 0 6px rgba(255,215,0,0.8))",
                  "drop-shadow(0 0 14px rgba(255,215,0,1))",
                  "drop-shadow(0 0 6px rgba(255,215,0,0.8))",
                ],
              }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.svg>
  );
}
