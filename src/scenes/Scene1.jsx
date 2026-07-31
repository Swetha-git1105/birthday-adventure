import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SceneWrapper from "../components/SceneWrapper.jsx";
import HUD from "../components/HUD.jsx";
import GameButton from "../components/GameButton.jsx";

const SPECIAL_LETTER =
  "Dear Birthday Girl,\n\nHappy Birthday from all of us in the Snowy Penguin Village! 🎉\n\nPippin and the penguin crew heard it was your special day, and we just had to send you a little note.\n\nYour adventure is only beginning — six magical worlds, fifteen golden stars, and one very special surprise waiting at the end. Follow the stars, trust the journey, and never stop smiling.\n\nWaddle on, adventurer!\n\nWith love and snowflakes,\nPippin the Penguin 🐧";

function Snowflakes() {
  const flakes = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 4 + Math.random() * 6,
    size: 4 + Math.random() * 8,
    opacity: 0.3 + Math.random() * 0.5,
  }));

  return (
    <>
      {flakes.map((f) => (
        <motion.div
          key={f.id}
          initial={{ y: "-5vh", x: `${f.x}vw`, opacity: f.opacity }}
          animate={{ y: "105vh", opacity: 0 }}
          transition={{
            duration: f.duration,
            delay: f.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            width: f.size,
            height: f.size,
            borderRadius: "50%",
            background: "white",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      ))}
    </>
  );
}

/** Cute emoji penguin roaming the background */
function Penguin({ style }) {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
      style={{ fontSize: 48, userSelect: "none", ...style }}
    >
      🐧
    </motion.div>
  );
}

/** Composed penguin character that walks in toward the player */
function PenguinCharacter({ mood, style }) {
  const sassy = mood === "sassy";
  return (
    <motion.div
      initial={{ x: -180, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 130, damping: 17 }}
      style={{ ...style }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "relative", width: 110, height: 130, userSelect: "none" }}
      >
        {/* body */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: 110,
            height: 120,
            background: "radial-gradient(circle at 35% 30%, #2a3040, #14161f)",
            borderRadius: "55% 55% 42% 42% / 50% 50% 35% 35%",
            boxShadow: "0 8px 18px rgba(0,0,0,0.35)",
          }}
        />
        {/* belly */}
        <div
          style={{
            position: "absolute",
            bottom: 6,
            left: "50%",
            transform: "translateX(-50%)",
            width: 70,
            height: 82,
            background: "linear-gradient(180deg, #ffffff, #eef1f6)",
            borderRadius: "50% 50% 42% 42%",
          }}
        />
        {/* wings */}
        <div style={{ position: "absolute", bottom: 14, left: -8, width: 20, height: 46, background: "#14161f", borderRadius: "40%", transform: sassy ? "rotate(6deg)" : "rotate(14deg)", transition: "transform 0.3s" }} />
        <div style={{ position: "absolute", bottom: 14, right: -8, width: 20, height: 46, background: "#14161f", borderRadius: "40%", transform: sassy ? "rotate(-6deg)" : "rotate(-14deg)", transition: "transform 0.3s" }} />
        {/* eyes */}
        <motion.div
          animate={sassy ? { scaleY: [1, 0.45, 1] } : {}}
          transition={{ duration: 0.35, repeat: Infinity, repeatDelay: 1.1 }}
          style={{
            position: "absolute",
            top: 40,
            left: 26,
            width: 9,
            height: 10,
            background: "#1b1e27",
            borderRadius: "50%",
          }}
        />
        <motion.div
          animate={sassy ? { scaleY: [1, 0.45, 1] } : {}}
          transition={{ duration: 0.35, repeat: Infinity, repeatDelay: 1.1 }}
          style={{
            position: "absolute",
            top: 40,
            right: 26,
            width: 9,
            height: 10,
            background: "#1b1e27",
            borderRadius: "50%",
          }}
        />
        {/* eye shine */}
        <div style={{ position: "absolute", top: 38, left: 29, width: 3, height: 3, background: "#fff", borderRadius: "50%" }} />
        <div style={{ position: "absolute", top: 38, right: 29, width: 3, height: 3, background: "#fff", borderRadius: "50%" }} />
        {/* beak */}
        <div
          style={{
            position: "absolute",
            top: 56,
            left: "50%",
            transform: "translateX(-50%)",
            width: 16,
            height: 9,
            background: "#ff9f43",
            clipPath: "polygon(0 20%, 100% 20%, 50% 100%)",
          }}
        />
        {/* feet */}
        <div style={{ position: "absolute", bottom: -4, left: 18, width: 22, height: 9, background: "#ff9f43", borderRadius: 6 }} />
        <div style={{ position: "absolute", bottom: -4, right: 18, width: 22, height: 9, background: "#ff9f43", borderRadius: 6 }} />
        {/* blush */}
        <div style={{ position: "absolute", top: 52, left: 12, width: 9, height: 5, background: "rgba(255,150,160,0.6)", borderRadius: "50%", filter: "blur(0.5px)" }} />
        <div style={{ position: "absolute", top: 52, right: 12, width: 9, height: 5, background: "rgba(255,150,160,0.6)", borderRadius: "50%", filter: "blur(0.5px)" }} />
        {/* playful huff when sassy */}
        {sassy && (
          <motion.span
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.4, 1.1, 1, 0.9], y: [0, -8, -14, -20] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            style={{ position: "absolute", top: -12, right: -6, fontSize: 26, pointerEvents: "none" }}
          >
            😤
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
}

/** Speech bubble above the penguin */
function DialogBubble({ text, children }) {
  return (
    <motion.div
      key="bubble"
      initial={{ opacity: 0, scale: 0.85, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 12 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="glass"
      style={{
        maxWidth: 400,
        width: "88%",
        padding: "18px 22px",
        borderRadius: 18,
        position: "relative",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: -11,
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderTop: "12px solid rgba(255,255,255,0.14)",
        }}
      />
      <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--text-primary)", textAlign: "center", margin: 0 }}>
        {text}
      </p>
      {children}
    </motion.div>
  );
}

/**
 * @param {{onReturnToMap: () => void, onCompleteScene: (id:string)=>void, collectedStars: number[], collectStar: (id:number)=>void}} props
 */
export default function Scene1({ onReturnToMap, onCompleteScene, collectedStars, collectStar }) {
  // ask → letter | playful → letter → done
  const [dialogPhase, setDialogPhase] = useState("ask");

  const mood = dialogPhase === "playful" ? "sassy" : "happy";

  return (
    <SceneWrapper
      sceneId="scene1"
      onReturnToMap={onReturnToMap}
      onCompleteScene={onCompleteScene}
      collectedStars={collectedStars}
      collectStar={collectStar}
    >
      {({ markComplete }) => (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, #1a2a4a 0%, #2d4a7a 40%, #e8eef4 70%, #ffffff 100%)",
            overflow: "hidden",
          }}
        >
          <HUD collectedStars={collectedStars} onReturnToMap={onReturnToMap} />

          {/* Ground */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "25%",
              background: "linear-gradient(180deg, #e8eef4 0%, #ffffff 100%)",
              borderRadius: "50% 50% 0 0 / 20% 20% 0 0",
            }}
          />

          <Snowflakes />

          {/* Background penguins */}
          <Penguin style={{ position: "absolute", bottom: "18%", left: "8%", fontSize: 36, zIndex: 2 }} />
          <Penguin style={{ position: "absolute", bottom: "16%", right: "12%", fontSize: 52, zIndex: 2 }} />
          <Penguin style={{ position: "absolute", bottom: "22%", right: "30%", fontSize: 28, zIndex: 2 }} />

          {/* Content */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              gap: 20,
              padding: "84px 20px 90px",
              overflowY: "auto",
            }}
          >
            <h2
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: "#fff",
                textShadow: "0 2px 10px rgba(0,0,0,0.35)",
                margin: 0,
                flexShrink: 0,
                textAlign: "center",
              }}
            >
              🐧 Snowy Penguin Village
            </h2>

            <AnimatePresence mode="wait">
              {dialogPhase === "letter" ? (
                <motion.div
                  key="letter"
                  initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="parchment"
                  style={{ maxWidth: 420, width: "88%", padding: "28px 26px", flexShrink: 0 }}
                >
                  <pre
                    style={{
                      whiteSpace: "pre-wrap",
                      fontFamily: "'Georgia', serif",
                      fontSize: 15,
                      lineHeight: 1.7,
                      color: "#5b3a1e",
                      textAlign: "center",
                      margin: 0,
                    }}
                  >
                    {SPECIAL_LETTER}
                  </pre>
                  <div style={{ marginTop: 22, display: "flex", justifyContent: "center" }}>
                    <GameButton onClick={() => setDialogPhase("done")} variant="gold">
                      It's beautiful! 💖
                    </GameButton>
                  </div>
                </motion.div>
              ) : (
                <DialogBubble
                  text={
                    {
                      ask: "I found a special letter for you. 🐧💌 Would you like to open it?",
                      playful: "How dare you! 😤 I carried this all the way here. You HAVE to open it!",
                      done: "Hehe, told you it was worth it! ✨ Now go, adventurer — your adventure awaits!",
                    }[dialogPhase]
                  }
                >
                  <div style={{ marginTop: 14, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                    {dialogPhase === "ask" && (
                      <>
                        <GameButton onClick={() => setDialogPhase("letter")} variant="gold">
                          ❤️ Yes
                        </GameButton>
                        <GameButton onClick={() => setDialogPhase("playful")} variant="secondary">
                          🙈 Maybe Later
                        </GameButton>
                      </>
                    )}
                    {dialogPhase === "playful" && (
                      <GameButton onClick={() => setDialogPhase("letter")} variant="gold">
                        ❤️ Okay, I'll open it.
                      </GameButton>
                    )}
                  </div>
                </DialogBubble>
              )}
            </AnimatePresence>

            <PenguinCharacter mood={mood} />

            <div style={{ flexShrink: 0 }}>
              <GameButton
                onClick={() => markComplete("Snowy Penguin Village Complete!")}
                variant="gold"
                size="lg"
              >
                Continue Adventure →
              </GameButton>
            </div>
          </div>
        </div>
      )}
    </SceneWrapper>
  );
}
