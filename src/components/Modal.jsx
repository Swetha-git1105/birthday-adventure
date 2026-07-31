import { motion, AnimatePresence } from "framer-motion";

/**
 * @param {{show: boolean, title: string, children: React.ReactNode}} props
 */
export default function Modal({ show, title, children }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(10,14,39,0.8)",
            backdropFilter: "blur(8px)",
            zIndex: 1000,
          }}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="glass"
            style={{
              padding: "36px 44px",
              textAlign: "center",
              maxWidth: 440,
              width: "90%",
            }}
          >
            <h2
              style={{
                fontSize: 28,
                fontWeight: 700,
                background: "linear-gradient(135deg, var(--gold) 0%, var(--accent-pink) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: 16,
              }}
            >
              {title}
            </h2>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
