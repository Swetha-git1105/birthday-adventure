import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SceneWrapper from "../components/SceneWrapper.jsx";
import HUD from "../components/HUD.jsx";
import Balloon from "../components/Balloon.jsx";
import Confetti from "../components/Confetti.jsx";
import Puzzle, { useImage } from "../components/Puzzle.jsx";
import { playPop, playSparkle, playTreasureOpen, playPuzzleSolved } from "../utils/sounds.js";
import { content } from "../data/content.js";

const BALLOON_COUNT = 30;
const GOLDEN_COUNT = 3;
const BALLOON_COLORS = ["red", "blue", "purple", "pink", "orange", "green"];
const GOLD_COLORS = ["#ffd700", "#ffe873", "#ffb300", "#fff3b0"];
const PUZZLE_STARS = [2, 3, 4];

/** Pick N distinct random indices */
function pickRandom(total, count) {
  const pool = Array.from({ length: total }, (_, i) => i);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count).sort((a, b) => a - b);
}

/**
 * @param {{onReturnToMap: () => void, onCompleteScene: (id:string)=>void, collectedStars: number[], collectStar: (id:number)=>void}} props
 */
export default function Scene2({ onReturnToMap, onCompleteScene, collectedStars, collectStar }) {
  const [popped, setPopped] = useState({});
  const [fx, setFx] = useState([]); // pop effects {id,x,y,golden}
  const [chest, setChest] = useState(null); // puzzle index currently in the chest
  const chestRef = useRef(null);

  const balloons = useMemo(() => {
    const goldenIdx = pickRandom(BALLOON_COUNT, GOLDEN_COUNT);
    return Array.from({ length: BALLOON_COUNT }, (_, i) => ({
      id: i,
      x: (i / BALLOON_COUNT) * 88 + 6 + (Math.random() - 0.5) * 8,
      size: 44 + Math.random() * 28,
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      swayDur: 2.6 + Math.random() * 2.2,
      dur: 15 + Math.random() * 13,
      delay: -Math.random() * 26,
      golden: goldenIdx.includes(i),
      puzzleIndex: goldenIdx.indexOf(i),
    }));
  }, []);

  /** Which puzzles are already solved (derived from persistent star collection) */
  const solvedPuzzles = useMemo(
    () => new Set(PUZZLE_STARS.filter((id) => collectedStars.includes(id)).map((id) => id - 2)),
    [collectedStars]
  );
  const solvedCount = solvedPuzzles.size;

  useEffect(() => {
    return () => {
      if (chestRef.current) clearTimeout(chestRef.current);
    };
  }, []);

  const normalPop = useCallback((e, b) => {
    setPopped((p) => ({ ...p, [b.id]: true }));
    setFx((f) => [...f, { id: Date.now(), x: e.clientX, y: e.clientY, golden: false }]);
    playPop();
  }, []);

  const goldenPop = useCallback((e, b) => {
    setPopped((p) => ({ ...p, [b.id]: true }));
    setFx((f) => [...f, { id: Date.now(), x: e.clientX, y: e.clientY, golden: true }]);
    playSparkle();
    if (b.puzzleIndex >= 0 && !solvedPuzzles.has(b.puzzleIndex)) {
      setChest(b.puzzleIndex);
    }
  }, [solvedPuzzles]);

  const handleBalloonPop = useCallback(
    (e, b) => {
      if (b.golden) {
        goldenPop(e, b);
      } else {
        normalPop(e, b);
      }
    },
    [goldenPop, normalPop]
  );

  const removeFx = useCallback((id) => {
    setFx((f) => f.filter((x) => x.id !== id));
  }, []);

  return (
    <SceneWrapper
      sceneId="scene2"
      onReturnToMap={onReturnToMap}
      onCompleteScene={onCompleteScene}
      collectedStars={collectedStars}
      collectStar={collectStar}
    >
      {({ collectStar: cs, isCollected, markComplete }) => (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, #0f2547 0%, #1e4a8a 45%, #7ec8e3 100%)",
            overflow: "hidden",
          }}
        >
          <HUD collectedStars={collectedStars} onReturnToMap={onReturnToMap} />

          {/* Sun + clouds */}
          <div style={{ position: "absolute", top: "8%", right: "12%", width: 90, height: 90, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,220,130,0.9), rgba(255,180,80,0.2) 60%, transparent)", filter: "blur(2px)", zIndex: 1 }} />
          {["8%", "30%", "58%", "80%"].map((x, i) => (
            <motion.div
              key={`cloud-${i}`}
              animate={{ x: [0, 30, 0], y: [0, -8, 0] }}
              transition={{ duration: 11 + i * 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: "absolute", top: `${8 + i * 14}%`, left: x, fontSize: 40 + i * 6, opacity: 0.45, pointerEvents: "none", zIndex: 1 }}
            >
              ☁️
            </motion.div>
          ))}

          {/* Balloons */}
          {balloons.map((b) =>
            popped[b.id] ? null : <Balloon key={b.id} balloon={b} onPop={handleBalloonPop} />
          )}

          {/* Pop effects */}
          <AnimatePresence>
            {fx.map((f) => (
              <motion.div key={f.id} initial={{ opacity: 1 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
                {f.golden ? (
                  <GoldenBurst x={f.x} y={f.y} onDone={() => removeFx(f.id)} />
                ) : (
                  <Confetti x={f.x} y={f.y} count={14} />
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* HUD bottom hint */}
          <div
            className="glass-sm"
            style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", padding: "10px 22px", textAlign: "center", zIndex: 40 }}
          >
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 4 }}>
              {solvedCount === 3
                ? "All three photos found!"
                : "Pop balloons… three golden ones hide photo treasures! 🎈"}
            </p>
            <p style={{ fontSize: 13, color: "var(--gold)" }}>Puzzles found: {solvedCount} / 3</p>
          </div>

          {/* Celebration when done */}
          {solvedCount === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ position: "absolute", bottom: 96, left: "50%", transform: "translateX(-50%)", zIndex: 60 }}
            >
              <motion.button
                onClick={() => markComplete("Balloon Kingdom Complete!")}
                style={{
                  padding: "16px 36px",
                  fontSize: 18,
                  fontWeight: 700,
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  cursor: "pointer",
                  background: "linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)",
                  color: "#1a1a2e",
                  boxShadow: "0 0 30px rgba(255,215,0,0.5)",
                  fontFamily: "inherit",
                }}
                whileHover={{ scale: 1.08 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                🎉 Celebrate!
              </motion.button>
            </motion.div>
          )}

          {/* Treasure chest modal */}
          <AnimatePresence>
            {chest !== null && (
              <TreasureChest
                index={chest}
                onClose={() => setChest(null)}
                onSolve={() => {
                  cs(PUZZLE_STARS[chest]);
                }}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </SceneWrapper>
  );
}

/** Golden sparkle burst (larger than confetti) */
function GoldenBurst({ x, y, onDone }) {
  return (
    <div style={{ position: "fixed", left: x, top: y, zIndex: 70, pointerEvents: "none" }}>
      {Array.from({ length: 22 }, (_, i) => (
        <motion.span
          key={i}
          style={{ position: "absolute", fontSize: 12 + (i % 4) * 4 }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
          animate={{
            x: Math.cos((i / 22) * Math.PI * 2) * (40 + (i % 3) * 22),
            y: Math.sin((i / 22) * Math.PI * 2) * (40 + (i % 3) * 22),
            opacity: 0,
            scale: 1.3,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          onAnimationComplete={i === 0 ? onDone : undefined}
        >
          {i % 3 === 0 ? "⭐" : "✨"}
        </motion.span>
      ))}
    </div>
  );
}

/** Treasure chest that opens and reveals the photo puzzle */
function TreasureChest({ index, onClose, onSolve }) {
  const [stage, setStage] = useState("closed"); // closed → opening → puzzle → solved
  const puzzle = content.puzzles[index];
  const { image, loaded } = useImage(puzzle.image, index);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setStage("opening");
      playTreasureOpen();
    }, 500);
    const t2 = setTimeout(() => setStage("puzzle"), 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(10,14,39,0.8)",
        backdropFilter: "blur(10px)",
      }}
    >
      <motion.div
        initial={{ scale: 0.7, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        className="glass"
        style={{
          padding: "26px 28px",
          width: "min(520px, 92vw)",
          maxHeight: "88vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
        }}
      >
        {stage === "closed" && (
          <motion.div style={{ textAlign: "center", padding: "30px 0" }}>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 1.4, repeat: Infinity }}
              style={{ fontSize: 84, filter: "drop-shadow(0 0 30px rgba(255,215,0,0.6))" }}
            >
              🎁
            </motion.div>
            <p style={{ color: "var(--gold)", fontSize: 18, fontWeight: 700, marginTop: 10 }}>
              A golden treasure!
            </p>
          </motion.div>
        )}

        {stage === "opening" && (
          <motion.div style={{ textAlign: "center", padding: "30px 0" }}>
            <motion.div
              initial={{ scale: 1.1, rotate: -4 }}
              animate={{ scale: 1.25, rotate: 6 }}
              transition={{ duration: 0.8 }}
              style={{ fontSize: 100 }}
            >
              🪙
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ color: "var(--gold)", fontSize: 16, fontWeight: 700 }}
            >
              A hidden photo is revealed… put it back together!
            </motion.p>
          </motion.div>
        )}

        {stage === "puzzle" && (
          <>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--gold)", textAlign: "center" }}>
              {puzzle.caption}
            </h3>
            <Puzzle
              key={`puzzle-${index}`}
              src={puzzle.image}
              cols={puzzle.cols}
              rows={puzzle.rows}
              seed={index}
              onSolved={() => {
                setStage("solved");
                playPuzzleSolved();
                onSolve();
              }}
            />
          </>
        )}

        {stage === "solved" && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                width: "min(360px, 84vw)",
                aspectRatio: `${puzzle.cols} / ${puzzle.rows}`,
                borderRadius: 10,
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 0 40px rgba(255,215,0,0.5)",
              }}
            >
              {loaded && <img src={image} alt={puzzle.caption} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              {[12, 35, 58, 80].map((x, i) => (
                <motion.span
                  key={i}
                  style={{ position: "absolute", left: `${x}%`, top: `${16 + (i % 2) * 40}%`, fontSize: 20 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0.4], y: [0, -20, 0] }}
                  transition={{ duration: 1.6, delay: i * 0.3, repeat: Infinity }}
                >
                  ✨
                </motion.span>
              ))}
              <motion.span
                style={{ position: "absolute", right: 10, top: 10, fontSize: 30 }}
                animate={{ y: [0, -12, 0], opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              >
                💛
              </motion.span>
            </motion.div>
            <p className="font-hand" style={{ fontSize: 20, color: "var(--gold)", textAlign: "center", lineHeight: 1.4 }}>
              {puzzle.caption}
            </p>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "12px 28px",
                fontSize: 15,
                fontWeight: 700,
                borderRadius: "var(--radius-sm)",
                border: "none",
                cursor: "pointer",
                background: "linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)",
                color: "#1a1a2e",
                fontFamily: "inherit",
              }}
            >
              🔍 Continue Searching
            </motion.button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
