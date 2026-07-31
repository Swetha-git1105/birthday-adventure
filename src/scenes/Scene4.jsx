import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SceneWrapper from "../components/SceneWrapper.jsx";
import HUD from "../components/HUD.jsx";
import Envelope from "../components/Envelope.jsx";
import GameButton from "../components/GameButton.jsx";
import { playLetterOpen, playPaperUnfold, playHeart, playClick } from "../utils/sounds.js";
import { content } from "../data/content.js";

const STAR_MILESTONES = { 1: 8, 2: 9, 3: 10 };

/**
 * Letter Room — a cozy room where three letters rest on a wooden table.
 * @param {{onReturnToMap: () => void, onCompleteScene: (id:string)=>void, collectedStars: number[], collectStar: (id:number)=>void, unlockedMemories: string[], unlockMemory: (id:string)=>void}} props
 */
export default function Scene4({
  onReturnToMap,
  onCompleteScene,
  collectedStars,
  collectStar,
  unlockedMemories,
  unlockMemory,
}) {
  const [readingId, setReadingId] = useState(null);
  const [heartFx, setHeartFx] = useState(null);
  const [showWish, setShowWish] = useState(false);
  const heartTimer = useRef(null);

  const readSet = useMemo(() => new Set(unlockedMemories), [unlockedMemories]);
  const envelopes = content.envelopes;
  const readCount = envelopes.filter((e) => readSet.has(e.id)).length;
  const allRead = readCount === envelopes.length;
  const milestones = useMemo(() => Object.keys(STAR_MILESTONES).map(Number).sort((a, b) => a - b), []);

  const reading = envelopes.find((e) => e.id === readingId) || null;

  useEffect(() => {
    return () => {
      if (heartTimer.current) clearTimeout(heartTimer.current);
    };
  }, []);

  /** Award a room star for each letter opened (1 → 8, 2 → 9, 3 → 10) */
  useEffect(() => {
    for (const milestone of milestones) {
      if (readCount >= milestone) {
        collectStar(STAR_MILESTONES[milestone]);
      }
    }
  }, [readCount, milestones, collectStar]);

  const letterText = (env) =>
    env.letter
      .replaceAll("{sisterName}", content.sisterName)
      .replaceAll("{signature}", content.signature);

  const openLetter = (id) => {
    unlockMemory(id);
    playLetterOpen();
    setTimeout(() => playPaperUnfold(), 260);
    setReadingId(id);
  };

  const closeLetter = () => {
    const closedId = reading?.id;
    setReadingId(null);
    setHeartFx(Date.now());
    playHeart();
    if (heartTimer.current) clearTimeout(heartTimer.current);
    heartTimer.current = setTimeout(() => setHeartFx(null), 1600);
    if (closedId === "q-birthday") setShowWish(true);
  };

  return (
    <SceneWrapper
      sceneId="scene4"
      onReturnToMap={onReturnToMap}
      onCompleteScene={onCompleteScene}
      collectedStars={collectedStars}
      collectStar={collectStar}
    >
      {({ markComplete }) => (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <HUD collectedStars={collectedStars} onReturnToMap={onReturnToMap} />

          {/* Cozy wall */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, #f7e3c0 0%, #ecd2a4 55%, #e0bc8e 100%)",
            }}
          />
          {/* wallpaper stripes */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "repeating-linear-gradient(90deg, rgba(255,255,255,0.10) 0 44px, transparent 44px 88px)",
              opacity: 0.5,
            }}
          />

          {/* Night window */}
          <div style={{ position: "absolute", left: "6%", top: "14%", width: 150, height: 180, zIndex: 2 }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "#f4e3c2",
                borderRadius: 12,
                boxShadow: "0 12px 28px rgba(120,80,40,0.35)",
                padding: 9,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 9,
                  borderRadius: 8,
                  overflow: "hidden",
                  background: "linear-gradient(180deg, #2b3a67 0%, #4b5d8f 100%)",
                }}
              >
                {/* moon */}
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 16,
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "#fff6d8",
                    boxShadow: "0 0 18px rgba(255,246,216,0.95)",
                  }}
                />
                {/* stars */}
                {[18, 34, 60, 78, 90].map((x, i) => (
                  <motion.span
                    key={i}
                    style={{ position: "absolute", left: `${x}%`, top: `${12 + (i % 3) * 22}%`, width: 3, height: 3, borderRadius: "50%", background: "#fff" }}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                  />
                ))}
                {/* window bars */}
                <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 6, background: "rgba(244,227,194,0.95)" }} />
                <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 6, background: "rgba(244,227,194,0.95)" }} />
              </div>
            </div>
            {/* curtain top */}
            <div style={{ position: "absolute", top: -8, left: -14, width: "120%", height: 14, borderRadius: 8, background: "#d98a6f", boxShadow: "0 2px 6px rgba(120,60,40,0.4)" }} />
            {/* curtain swags */}
            <div style={{ position: "absolute", top: 0, left: -18, width: 34, height: 60, borderRadius: "0 0 18px 18px", background: "linear-gradient(180deg,#e7a284,#cf7f63)", opacity: 0.9 }} />
            <div style={{ position: "absolute", top: 0, right: -18, width: 34, height: 60, borderRadius: "0 0 18px 18px", background: "linear-gradient(180deg,#e7a284,#cf7f63)", opacity: 0.9 }} />
          </div>

          {/* Picture frame on the wall */}
          <div
            style={{
              position: "absolute",
              left: "33%",
              top: "15%",
              width: 84,
              height: 100,
              background: "#f4e3c2",
              borderRadius: 8,
              padding: 7,
              boxShadow: "0 10px 22px rgba(120,80,40,0.3)",
              zIndex: 2,
              transform: "rotate(-2deg)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 4,
                background: "linear-gradient(160deg, #ffd9e8 0%, #ff9ebc 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
              }}
            >
              💖
            </div>
          </div>

          {/* Hanging lamp glow */}
          <div
            style={{
              position: "absolute",
              right: "6%",
              top: 0,
              width: 220,
              height: 240,
              background: "radial-gradient(circle, rgba(255,210,120,0.5) 0%, rgba(255,180,90,0.14) 45%, transparent 70%)",
              zIndex: 1,
            }}
          />
          <motion.span
            style={{ position: "absolute", right: "13%", top: "7%", fontSize: 44, zIndex: 3 }}
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            🪔
          </motion.span>

          {/* Floor */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "30%",
              background: "linear-gradient(180deg, #b98a5e 0%, #9c6a40 100%)",
              boxShadow: "inset 0 14px 26px rgba(90,50,20,0.35)",
            }}
          />
          {/* floor planks */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "30%",
              background: "repeating-linear-gradient(90deg, rgba(120,70,30,0.16) 0 14px, transparent 14px 80px)",
            }}
          />

          {/* Rug */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: "11%",
              transform: "translateX(-50%)",
              width: "min(560px, 82vw)",
              height: 110,
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(205,120,95,0.6) 0%, rgba(170,95,75,0.5) 55%, rgba(150,80,65,0.3) 78%, transparent 82%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: "12.5%",
              transform: "translateX(-50%)",
              width: "min(360px, 56vw)",
              height: 70,
              borderRadius: "50%",
              border: "3px dashed rgba(255,236,200,0.5)",
            }}
          />

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              position: "absolute",
              top: 84,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 5,
              fontSize: 30,
              fontWeight: 800,
              color: "#5a3a20",
              textShadow: "0 2px 0 rgba(255,255,255,0.6)",
              whiteSpace: "nowrap",
            }}
          >
            💌 Letters For You
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              position: "absolute",
              top: 126,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 5,
              color: "rgba(90,58,32,0.85)",
              fontSize: 14,
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            Three letters are waiting for you on the desk…
          </motion.p>

          {/* Cozy desk */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: "24%",
              transform: "translateX(-50%)",
              width: "min(820px, 96vw)",
              zIndex: 10,
            }}
          >
            {/* desk top */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: 128,
                borderRadius: 14,
                background: "linear-gradient(180deg, #b07a4e 0%, #9c6a40 70%, #8a5a34 100%)",
                boxShadow: "0 20px 44px rgba(80,45,15,0.5), inset 0 3px 8px rgba(255,255,255,0.35), inset 0 -6px 14px rgba(60,30,10,0.4)",
              }}
            >
              {/* wood grain */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 14,
                  background: "repeating-linear-gradient(90deg, rgba(120,70,30,0.2) 0 10px, transparent 10px 26px, rgba(120,70,30,0.14) 26px 38px, transparent 38px 72px)",
                }}
              />
              {/* top edge highlight */}
              <div style={{ position: "absolute", top: 4, left: "4%", right: "4%", height: 10, borderRadius: 8, background: "rgba(255,255,255,0.22)" }} />

              {/* front drawer band */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 34,
                  borderRadius: "0 0 14px 14px",
                  background: "linear-gradient(180deg, rgba(120,70,30,0.28) 0%, rgba(60,30,10,0.16) 100%)",
                  borderTop: "2px solid rgba(60,30,10,0.35)",
                }}
              >
                <div style={{ position: "absolute", top: "50%", left: "12%", width: 42, height: 5, borderRadius: 3, background: "var(--gold)", boxShadow: "0 1px 2px rgba(0,0,0,0.4)" }} />
                <div style={{ position: "absolute", top: "50%", right: "12%", width: 42, height: 5, borderRadius: 3, background: "var(--gold)", boxShadow: "0 1px 2px rgba(0,0,0,0.4)" }} />
              </div>

              {/* desk lamp on the right */}
              <div style={{ position: "absolute", right: "5%", top: 12, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}>
                {/* light cone */}
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    right: -2,
                    width: 150,
                    height: 170,
                    background: "radial-gradient(ellipse at 50% 0%, rgba(255,214,106,0.5) 0%, rgba(255,214,106,0.12) 45%, transparent 72%)",
                    transform: "rotate(-8deg)",
                    transformOrigin: "top center",
                    pointerEvents: "none",
                  }}
                />
                {/* shade */}
                <motion.div
                  style={{
                    width: 56,
                    height: 22,
                    borderRadius: "50% 50% 6px 6px",
                    background: "linear-gradient(180deg, #2a6b4a 0%, #1d5038 100%)",
                    boxShadow: "0 0 24px rgba(255,214,106,0.9)",
                    position: "relative",
                    zIndex: 1,
                  }}
                  animate={{ opacity: [0.85, 1, 0.85] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                >
                  <div style={{ position: "absolute", bottom: -3, left: 4, right: 4, height: 4, background: "#ffd76a", borderRadius: "50%", boxShadow: "0 0 14px rgba(255,215,100,1)" }} />
                </motion.div>
                {/* arm */}
                <div style={{ width: 4, height: 22, background: "#3a2a1a", position: "relative", zIndex: 1 }} />
                {/* base */}
                <div style={{ width: 28, height: 8, borderRadius: 4, background: "#4a3520", position: "relative", zIndex: 1 }} />
              </div>

              {/* notebooks and mug on the left */}
              <div style={{ position: "absolute", left: "4%", top: 16, display: "flex", alignItems: "flex-end", gap: 7, zIndex: 2 }}>
                <span style={{ fontSize: 32, filter: "drop-shadow(0 3px 3px rgba(0,0,0,0.3))" }}>📔</span>
                <span style={{ fontSize: 34, filter: "drop-shadow(0 3px 3px rgba(0,0,0,0.3))" }}>📓</span>
                <span style={{ fontSize: 26, transform: "rotate(-12deg)", filter: "drop-shadow(0 3px 3px rgba(0,0,0,0.3))" }}>✏️</span>
                <span style={{ fontSize: 28, filter: "drop-shadow(0 3px 3px rgba(0,0,0,0.3))" }}>☕</span>
              </div>

              {/* The three envelopes on the desk */}
              {envelopes.map((env, i) => {
                const isRead = readSet.has(env.id);
                return (
                  <div
                    key={env.id}
                    style={{
                      position: "absolute",
                      top: 16,
                      left: `${28 + i * 22}%`,
                      transform: "translateX(-50%)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ transform: `rotate(${i === 1 ? 0 : i === 0 ? -5 : 5}deg)` }}>
                      <Envelope
                        title={env.title}
                        isRead={isRead}
                        index={i}
                        titleWidth={122}
                        onOpen={() => openLetter(env.id)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* desk legs */}
            <div style={{ position: "absolute", left: "13%", top: "100%", width: 24, height: 88, borderRadius: 6, background: "linear-gradient(180deg, #8a5a34 0%, #6e4424 100%)", boxShadow: "0 12px 20px rgba(60,30,10,0.4)" }} />
            <div style={{ position: "absolute", right: "13%", top: "100%", width: 24, height: 88, borderRadius: 6, background: "linear-gradient(180deg, #8a5a34 0%, #6e4424 100%)", boxShadow: "0 12px 20px rgba(60,30,10,0.4)" }} />
            {/* lower shelf */}
            <div style={{ position: "absolute", left: "6%", right: "6%", top: "130%", height: 10, borderRadius: 5, background: "linear-gradient(180deg, #8a5a34 0%, #6e4424 100%)", boxShadow: "0 8px 14px rgba(60,30,10,0.35)" }} />
          </div>

          {/* Progress + celebrate */}
          <div
            style={{
              position: "absolute",
              bottom: "5%",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              width: "max-content",
              maxWidth: "92vw",
              textAlign: "center",
            }}
          >
            <div className="glass-sm" style={{ padding: "8px 22px" }}>
              <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                Letters opened: {readCount} / {envelopes.length}
              </span>
            </div>

            {allRead && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <p className="font-hand" style={{ fontSize: 19, color: "#7a4a2b", textAlign: "center" }}>
                  Happy Birthday, {content.sisterName}! 💛
                </p>
                <motion.button
                  onClick={() => {
                    playClick();
                    markComplete("The Letters are Complete!");
                  }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: "14px 34px",
                    fontSize: 17,
                    fontWeight: 700,
                    borderRadius: "var(--radius-sm)",
                    border: "none",
                    cursor: "pointer",
                    background: "linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)",
                    color: "#1a1a2e",
                    fontFamily: "inherit",
                    boxShadow: "0 0 26px rgba(255,215,0,0.55)",
                  }}
                >
                  🎉 Celebrate!
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Letter reading overlay */}
          <AnimatePresence>
            {reading && (
              <LetterModal
                key={reading.id}
                title={reading.title}
                icon={reading.icon}
                text={letterText(reading)}
                onClose={closeLetter}
              />
            )}
          </AnimatePresence>

          {/* Floating heart on close */}
          <AnimatePresence>
            {heartFx && (
              <motion.span
                key={heartFx}
                style={{ position: "fixed", left: "50%", bottom: "30%", fontSize: 30, zIndex: 300, pointerEvents: "none" }}
                initial={{ y: 0, opacity: 0, scale: 0.4 }}
                animate={{ y: -90, opacity: [0, 1, 0], scale: 1.2 }}
                transition={{ duration: 1.6, ease: "easeOut" }}
              >
                💛
              </motion.span>
            )}
          </AnimatePresence>

          {/* Wish scene — appears after reading the birthday letter */}
          <AnimatePresence>
            {showWish && (
              <WishScene
                name={content.sisterName}
                onDone={() => {
                  setShowWish(false);
                  markComplete("The Letters are Complete!");
                }}
              />
            )}
          </AnimatePresence>
        </div>
      )}
    </SceneWrapper>
  );
}

/** Starry night wish interlude with a single shooting star */
function WishScene({ name, onDone }) {
  const stars = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 75,
        size: 1 + Math.random() * 2.5,
        delay: Math.random() * 4,
        dur: 2 + Math.random() * 3,
      })),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 400,
        background: "linear-gradient(180deg, #070b1f 0%, #101a3d 55%, #1d2b55 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* twinkling stars */}
      {stars.map((s) => (
        <motion.span
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "#fff",
          }}
          animate={{ opacity: [0.15, 1, 0.15], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: s.dur, repeat: Infinity, delay: s.delay }}
        />
      ))}

      {/* moon */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "14%",
          width: 54,
          height: 54,
          borderRadius: "50%",
          background: "#fff6d8",
          boxShadow: "0 0 44px rgba(255,246,216,0.9)",
        }}
      />
      <div style={{ position: "absolute", top: "13%", right: "11%", width: 40, height: 40, borderRadius: "50%", background: "#101a3d" }} />

      {/* shooting star */}
      <ShootingStar />

      <div
        style={{
          position: "relative",
          zIndex: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 16px",
          maxWidth: 480,
        }}
      >
        <motion.span style={{ fontSize: 52, marginBottom: 18 }} animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.08, 1] }} transition={{ duration: 2.6, repeat: Infinity }}>
          🌠
        </motion.span>
        <h2
          style={{
            fontSize: 30,
            fontWeight: 800,
            color: "#fff",
            textShadow: "0 0 24px rgba(180,200,255,0.7)",
            margin: 0,
          }}
        >
          Close your eyes, make a wish, then click Continue.
        </h2>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, marginTop: 14, maxWidth: 420 }}>
          The stars are listening, {name}. ✨
        </p>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} style={{ marginTop: 34 }}>
          <GameButton onClick={onDone} variant="gold" size="lg">
            Continue
          </GameButton>
        </motion.div>
      </div>
    </motion.div>
  );
}

/** A single comet sweeping across the night sky */
function ShootingStar() {
  return (
    <motion.div
      initial={{ x: "-25vw", y: "-8vh", opacity: 0 }}
      animate={{ x: "120vw", y: "65vh", opacity: [0, 1, 1, 0] }}
      transition={{ duration: 3.8, repeat: Infinity, delay: 0.8, repeatDelay: 1.2, ease: "easeIn" }}
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 5 }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* trailing glow (extends back toward the top-left) */}
        <div
          style={{
            width: 140,
            height: 2.5,
            borderRadius: 3,
            background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 100%)",
            boxShadow: "0 0 12px rgba(255,255,255,0.6)",
          }}
        />
        <span style={{ fontSize: 24, textShadow: "0 0 20px rgba(255,255,255,1), 0 0 40px rgba(200,220,255,0.8)" }}>☄️</span>
      </div>
    </motion.div>
  );
}

/** Paper letter that unfolds smoothly and folds back */
function LetterModal({ title, icon, text, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 250,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(60,35,15,0.6)",
        backdropFilter: "blur(8px)",
        padding: 16,
      }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ rotateX: 80, scaleY: 0.3, y: 80, opacity: 0 }}
        animate={{ rotateX: 0, scaleY: 1, y: 0, opacity: 1 }}
        exit={{ rotateX: 80, scaleY: 0.3, y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 160, damping: 22 }}
        className="parchment"
        style={{
          width: "min(440px, 92vw)",
          maxHeight: "min(86vh, 680px)",
          display: "flex",
          flexDirection: "column",
          borderRadius: 18,
          overflow: "hidden",
          position: "relative",
          transformStyle: "preserve-3d",
          perspective: 800,
        }}
      >
        {/* header — fixed so it never scrolls */}
        <div
          style={{
            textAlign: "center",
            padding: "26px 26px 6px",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 34 }}>{icon}</span>
          <h3
            className="font-hand"
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#7a4a2b",
              marginTop: 4,
              lineHeight: 1.2,
            }}
          >
            {title}
          </h3>
        </div>

        {/* body — scrolls independently so it never overlaps the button */}
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "12px 26px 6px" }}>
          <p
            className="font-hand"
            style={{
              fontSize: 19,
              lineHeight: 1.75,
              whiteSpace: "pre-wrap",
              color: "#5a3e1b",
              margin: 0,
            }}
          >
            {text}
          </p>
        </div>

        {/* footer — always visible, never overlapped */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "12px 26px 22px",
            flexShrink: 0,
          }}
        >
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "10px 26px",
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "inherit",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(135deg, #ff9ebc, #ff6b9d)",
              color: "#fff",
              boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
            }}
          >
            Fold Letter 💌
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
