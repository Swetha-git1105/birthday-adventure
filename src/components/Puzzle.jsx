import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playPuzzleSolved, playSparkle } from "../utils/sounds.js";

const FALLBACK_GRADIENTS = [
  ["#ffd9e8", "#ff9ebc"],
  ["#d7f0ff", "#7ec8e3"],
  ["#e8d7ff", "#b49be0"],
  ["#fff7cc", "#ffd97a"],
];

/** Generates a decorative fallback image so missing photos never break the game */
function makeFallbackImage(seed) {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");
    const [c1, c2] = FALLBACK_GRADIENTS[seed % FALLBACK_GRADIENTS.length];
    const g = ctx.createLinearGradient(0, 0, 640, 480);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 640, 480);
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.font = "bold 72px 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🖼️", 320, 220);
    ctx.font = "28px 'Segoe UI', sans-serif";
    ctx.fillText("Drop a photo here!", 320, 320);
    return canvas.toDataURL("image/jpeg", 0.8);
  } catch {
    return "";
  }
}

/** Builds a shuffled starting order with only a few misplaced tiles */
function makeShuffle(n) {
  const order = Array.from({ length: n }, (_, i) => i);
  const swaps = n <= 4 ? 2 : 3;
  for (let s = 0; s < swaps; s++) {
    const a = Math.floor(Math.random() * n);
    let b = Math.floor(Math.random() * n);
    while (b === a) b = Math.floor(Math.random() * n);
    const tmp = order[a];
    order[a] = order[b];
    order[b] = tmp;
  }
  // never start solved
  if (order.every((v, i) => v === i)) {
    const t = order[0];
    order[0] = order[1];
    order[1] = t;
  }
  return order;
}

/**
 * Resolves an image URL with a graceful decorative fallback if it fails to load.
 * @param {string} src
 * @param {number} seed
 * @returns {{image: string, loaded: boolean}}
 */
export function useImage(src, seed = 0) {
  const [image, setImage] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImage(src);
      setLoaded(true);
    };
    img.onerror = () => {
      setImage(makeFallbackImage(seed));
      setLoaded(true);
    };
    img.src = src;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, seed]);

  return { image, loaded };
}

/**
 * Drag-to-solve photo puzzle. Pieces start almost in place; drag a tile onto another to swap.
 * @param {{src: string, cols?: number, rows?: number, seed?: number, onSolved: () => void}} props
 */
export default function Puzzle({ src, cols = 2, rows = 2, seed = 0, onSolved }) {
  const n = cols * rows;
  const [order, setOrder] = useState(() => makeShuffle(n));
  const [solved, setSolved] = useState(false);
  const [drag, setDrag] = useState(null);
  const tileRefs = useRef([]);
  const solvedRef = useRef(false);
  const { image, loaded } = useImage(src, seed);

  const checkSolved = useCallback(
    (nextOrder) => {
      if (nextOrder.every((v, i) => v === i)) {
        setSolved(true);
        if (!solvedRef.current) {
          solvedRef.current = true;
          playPuzzleSolved();
          onSolved();
        }
      }
    },
    [onSolved]
  );

  const swapTiles = useCallback(
    (from, to) => {
      setOrder((prev) => {
        const next = [...prev];
        const tmp = next[from];
        next[from] = next[to];
        next[to] = tmp;
        checkSolved(next);
        return next;
      });
    },
    [checkSolved]
  );

  const handlePointerDown = (e, i) => {
    if (solved || !loaded) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDrag({ from: i, x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e) => {
    if (!drag) return;
    setDrag((d) => ({ ...d, x: e.clientX, y: e.clientY }));
  };

  const handlePointerUp = (e) => {
    if (!drag) return;
    const { from } = drag;
    let target = from;
    tileRefs.current.forEach((el, idx) => {
      if (el && idx !== from) {
        const r = el.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
          target = idx;
        }
      }
    });
    setDrag(null);
    if (target !== from) swapTiles(from, target);
  };

  const tileBg = (logical) => {
    const row = Math.floor(logical / cols);
    const col = logical % cols;
    return {
      backgroundImage: `url(${image})`,
      backgroundSize: `${cols * 100}% ${rows * 100}%`,
      backgroundPosition: `${cols > 1 ? (col / (cols - 1)) * 100 : 50}% ${rows > 1 ? (row / (rows - 1)) * 100 : 50}%`,
    };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div
        style={{
          position: "relative",
          width: "min(360px, 84vw)",
          aspectRatio: `${cols} / ${rows}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gap: 3,
            background: "rgba(0,0,0,0.25)",
            padding: 3,
            borderRadius: 10,
          }}
        >
          {order.map((logical, slot) => {
            const isDragging = drag?.from === slot;
            return (
              <div
                key={slot}
                ref={(el) => {
                  tileRefs.current[slot] = el;
                }}
                onPointerDown={(e) => handlePointerDown(e, slot)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 5,
                  background: loaded ? undefined : "linear-gradient(100deg, rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.06) 60%)",
                  backgroundSize: "200% 100%",
                  animation: loaded ? undefined : "shimmer 1.6s linear infinite",
                  cursor: "grab",
                  touchAction: "none",
                  userSelect: "none",
                  zIndex: isDragging ? 5 : 1,
                  boxShadow: isDragging ? "0 10px 30px rgba(0,0,0,0.5)" : "none",
                  transform: isDragging ? `translate(${drag.x}px, ${drag.y}px) scale(1.12)` : "none",
                  opacity: loaded ? 1 : 0.6,
                }}
              >
                {loaded && <div style={{ position: "absolute", inset: 0, ...tileBg(logical) }} />}
                {logical !== slot && !solved && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      border: "2px solid rgba(255,215,0,0.55)",
                      borderRadius: 5,
                      pointerEvents: "none",
                      animation: "starPulse 2s ease-in-out infinite",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Solved overlay: full image fades in */}
        <AnimatePresence>
          {solved && (
            <motion.div
              key="solved"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9 }}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 10,
                overflow: "hidden",
                zIndex: 10,
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0 0 40px rgba(255,215,0,0.5)",
              }}
            >
              {/* sparkles */}
              {[12, 28, 55, 74, 88].map((x, i) => (
                <motion.span
                  key={i}
                  style={{ position: "absolute", left: `${x}%`, top: `${18 + (i % 3) * 30}%`, fontSize: 18 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0.5] }}
                  transition={{ duration: 1.4, delay: 0.3 + i * 0.2, repeat: Infinity }}
                >
                  ✨
                </motion.span>
              ))}
              {/* floating hearts */}
              {[18, 46, 72].map((x, i) => (
                <motion.span
                  key={`h-${i}`}
                  style={{ position: "absolute", left: `${x}%`, fontSize: 20 }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: -30, opacity: [0, 1, 0] }}
                  transition={{ duration: 2.2, delay: 0.6 + i * 0.5, repeat: Infinity }}
                >
                  💛
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p style={{ color: "var(--text-secondary)", fontSize: 13, textAlign: "center", minHeight: 18 }}>
        {solved ? "" : "Drag a tile onto another to swap it"}
      </p>
    </div>
  );
}
