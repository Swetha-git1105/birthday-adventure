import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SceneWrapper from "../components/SceneWrapper.jsx";
import HUD from "../components/HUD.jsx";
import CollectibleStar from "../components/CollectibleStar.jsx";
import FireworksCanvas from "../components/FireworksCanvas.jsx";
import { playBlow, playSparkle, playSmoke } from "../utils/sounds.js";
import { content } from "../data/content.js";

const CANDLE_COUNT = 15;
const CAKE_STARS = [5, 6, 7];
const STAR_POSITIONS = [
  { x: "20%", y: "22%" },
  { x: "50%", y: "14%" },
  { x: "80%", y: "26%" },
];

/** Generate 15 candle positions on the top tier (3 rows of 5, candle bottoms anchored) */
function makeCandles() {
  const rows = [
    { bottom: 8, xs: [-56, -28, 0, 28, 56] },
    { bottom: -12, xs: [-56, -28, 0, 28, 56] },
    { bottom: -32, xs: [-56, -28, 0, 28, 56] },
  ];
  const candles = [];
  let id = 0;
  rows.forEach((r) => {
    r.xs.forEach((x) => {
      candles.push({ id: id++, x, bottom: r.bottom });
    });
  });
  return candles;
}

/**
 * @param {{onReturnToMap: () => void, onCompleteScene: (id:string)=>void, collectedStars: number[], collectStar: (id:number)=>void}} props
 */
export default function Scene3({ onReturnToMap, onCompleteScene, collectedStars, collectStar }) {
  const candles = useMemo(makeCandles, []);
  const [lit, setLit] = useState(() => new Set(candles.map((c) => c.id)));
  const [smoke, setSmoke] = useState({});
  const [blowing, setBlowing] = useState(false);
  const smokeTimer = useRef(null);

  const allOut = lit.size === 0;
  const allStars = CAKE_STARS.every((id) => collectedStars.includes(id));

  useEffect(() => {
    return () => {
      if (smokeTimer.current) clearTimeout(smokeTimer.current);
    };
  }, []);

  /** Single interaction: blow out ALL candles together */
  const blowAll = useCallback(() => {
    if (allOut) return;
    setBlowing(true);
    playBlow();
    playSmoke();
    setLit(new Set());
    setSmoke(Object.fromEntries(candles.map((c) => [c.id, Date.now()])));
    if (smokeTimer.current) clearTimeout(smokeTimer.current);
    smokeTimer.current = setTimeout(() => {
      setSmoke({});
      setBlowing(false);
    }, 1200);
  }, [allOut, candles]);

  return (
    <SceneWrapper
      sceneId="scene3"
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
            background: "radial-gradient(ellipse at 50% 40%, #3b2357 0%, #241741 55%, #150c2e 100%)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <HUD collectedStars={collectedStars} onReturnToMap={onReturnToMap} />
          {allOut && <FireworksCanvas active={allOut} />}

          {/* Room darkening spotlight */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: allOut ? 1 : 0 }}
            transition={{ duration: 1.6 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 5,
              pointerEvents: "none",
              background: "radial-gradient(circle at 50% 46%, transparent 0%, rgba(6,4,20,0.25) 32%, rgba(4,3,15,0.85) 68%, rgba(2,2,10,0.95) 100%)",
            }}
          />

          {/* Cake golden glow when all candles out */}
          {allOut && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              style={{
                position: "absolute",
                width: 560,
                height: 460,
                left: "50%",
                top: "56%",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(circle, rgba(255,215,0,0.45) 0%, rgba(255,150,60,0.18) 45%, transparent 70%)",
                zIndex: 6,
                pointerEvents: "none",
              }}
            />
          )}

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontSize: 30,
              fontWeight: 800,
              marginTop: 74,
              textAlign: "center",
              color: "var(--text-primary)",
              textShadow: "0 2px 14px rgba(0,0,0,0.5)",
              zIndex: 10,
            }}
          >
            🎂 The Birthday Cake
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-sm"
            style={{
              marginTop: 10,
              padding: "8px 22px",
              zIndex: 10,
              fontSize: 15,
              color: allOut ? "var(--gold)" : "var(--text-secondary)",
            }}
          >
            {allOut
              ? "All 15 candles out… magic time! ✨"
              : `Candles left: ${lit.size} / 15 — click the cake or the button to blow them all out`}
          </motion.div>

          {/* The cake (click anywhere to blow all candles) */}
          <div
            style={{ position: "relative", marginTop: 64, zIndex: 8 }}
            onClick={blowAll}
            role="button"
            aria-label="Blow out all the candles"
          >
            {/* Candle flames warm glow */}
            {!allOut && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: -30,
                  width: 300,
                  height: 160,
                  transform: "translateX(-50%)",
                  background: "radial-gradient(ellipse, rgba(255,180,70,0.35) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
            )}

            {/* Wind sweep across the candles while blowing */}
            {blowing && (
              <motion.div
                initial={{ left: "-25%", opacity: 0 }}
                animate={{ left: "110%", opacity: [0, 0.75, 0] }}
                transition={{ duration: 1, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  top: -70,
                  height: 44,
                  width: "34%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.45) 35%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.45) 65%, transparent)",
                  filter: "blur(6px)",
                  borderRadius: 22,
                  pointerEvents: "none",
                  zIndex: 12,
                }}
              />
            )}

            {/* Candles + cake body rotate/shake together */}
            <motion.div
              animate={blowing ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }}
              transition={{ duration: 0.6 }}
              style={{ position: "relative" }}
            >
            <motion.div
              animate={{ rotate: allOut ? [0, 1.2, -1.2, 0] : 0 }}
              transition={{ duration: 7, repeat: allOut ? Infinity : 0, ease: "easeInOut" }}
              style={{ position: "relative" }}
            >
              {candles.map((c) => {
                const isLit = lit.has(c.id);
                const isSmoking = smoke[c.id];
                return (
                  <motion.div
                    key={c.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15 + c.id * 0.04, type: "spring", stiffness: 200 }}
                    style={{
                      position: "absolute",
                      left: `calc(50% + ${c.x}px)`,
                      top: `${c.bottom}px`,
                      transform: "translate(-50%, -100%)",
                      width: 12,
                      height: 58,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      zIndex: 9,
                    }}
                  >
                    <AnimatePresence>
                      {isLit && (
                        <motion.div
                          key={`flame-${c.id}`}
                          exit={{ opacity: 0, scale: 0, y: -10 }}
                          style={{
                            width: 11,
                            height: 17,
                            marginBottom: 2,
                            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                            background: "radial-gradient(circle at 50% 80%, #fff7cc 0%, #ffd700 45%, #ff7b00 100%)",
                            boxShadow: "0 0 14px rgba(255,200,80,0.95), 0 0 30px rgba(255,160,40,0.5)",
                            position: "relative",
                          }}
                          animate={{ scale: [1, 1.18, 0.92, 1.06, 1], rotate: [0, 4, -4, 2, 0] }}
                          transition={{ duration: 0.4, repeat: Infinity }}
                        />
                      )}
                    </AnimatePresence>
                    {isSmoking && (
                      <motion.span
                        style={{ position: "absolute", top: -6, width: 8, height: 8, borderRadius: "50%", background: "rgba(200,200,210,0.7)" }}
                        animate={{ y: -34, scale: [0.5, 1.5], opacity: [0.8, 0] }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    )}
                    <div
                      style={{
                        width: 7,
                        height: 40,
                        borderRadius: 3,
                        background: "repeating-linear-gradient(45deg, #ff8fab 0 6px, #ff6b9d 6px 12px)",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                      }}
                    />
                  </motion.div>
                );
              })}

              <Tier width={210} height={62} colors={["#ffc9de", "#ff9ebc"]} drip="#ff8fab" />
              <Tier width={290} height={84} colors={["#c9f0e2", "#8fe3c0"]} drip="#7fd8b0" offset={-40} />
              <Tier width={370} height={106} colors={["#d9ccff", "#b49be0"]} drip="#a78ee0" offset={-80} />
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: -18,
                  transform: "translateX(-50%)",
                  width: 420,
                  height: 24,
                  borderRadius: "50%",
                  background: "radial-gradient(ellipse, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 60%, transparent 75%)",
                }}
              />
            </motion.div>
            </motion.div>
          </div>

          {/* Blow the Candles button */}
          {!allOut && (
            <motion.button
              onClick={blowAll}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              style={{
                marginTop: 36,
                padding: "16px 34px",
                fontSize: 18,
                fontWeight: 700,
                borderRadius: "var(--radius-sm)",
                border: "none",
                cursor: "pointer",
                background: "linear-gradient(135deg, #ff8fab 0%, #ff6b9d 100%)",
                color: "#fff",
                fontFamily: "inherit",
                boxShadow: "0 6px 26px rgba(255,107,157,0.5)",
                zIndex: 10,
              }}
            >
              🎂 Blow the Candles
            </motion.button>
          )}

          {/* Birthday celebration banner */}
          {allOut && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 180, damping: 12, delay: 0.4 }}
              style={{ marginTop: 18, zIndex: 10, textAlign: "center" }}
            >
              <motion.span
                className="font-hand"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  display: "inline-block",
                  fontSize: 32,
                  fontWeight: 700,
                  color: "var(--gold)",
                  textShadow: "0 0 26px rgba(255,215,0,0.9)",
                }}
              >
                🎉 Happy Birthday, {content.sisterName}! 🎉
              </motion.span>
            </motion.div>
          )}

          {/* Sparkles around cake when complete */}
          {allOut &&
            ["12%", "30%", "68%", "86%", "18%", "82%"].map((x, i) => (
              <motion.span
                key={`sp-${i}`}
                style={{ position: "absolute", left: x, top: `${20 + (i % 3) * 22}%`, fontSize: 16 + (i % 3) * 6, zIndex: 7 }}
                animate={{ opacity: [0, 1, 0], scale: [0.4, 1.2, 0.4], y: [0, -18, 0] }}
                transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
              >
                ✨
              </motion.span>
            ))}

          {/* Stars spawn after all candles out */}
          {allOut &&
            STAR_POSITIONS.map((pos, i) => {
              const id = CAKE_STARS[i];
              if (isCollected(id)) return null;
              return (
                <motion.div
                  key={`star-${id}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.25, type: "spring" }}
                  style={{ position: "absolute", left: pos.x, top: pos.y, zIndex: 30 }}
                >
                  <CollectibleStar
                    starId={id}
                    onCollect={(sid) => {
                      cs(sid);
                      playSparkle();
                    }}
                    size={56}
                  />
                </motion.div>
              );
            })}

          {/* Celebrate */}
          {allOut && allStars && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: 14, zIndex: 40 }}
            >
              <motion.button
                onClick={() => markComplete("Cake Magic Complete!")}
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
        </div>
      )}
    </SceneWrapper>
  );
}

/** One cake tier: body + dripping icing + gold decorations */
function Tier({ width, height, colors, drip, offset = 0 }) {
  const [c1, c2] = colors;
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        marginTop: -2,
        marginLeft: offset,
        background: `linear-gradient(180deg, ${c1} 0%, ${c2} 78%, rgba(0,0,0,0.12) 100%)`,
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        boxShadow: "0 14px 30px rgba(0,0,0,0.35), inset 0 6px 14px rgba(255,255,255,0.5), inset 0 -10px 18px rgba(0,0,0,0.12)",
      }}
    >
      {/* subtle top reflection */}
      <div
        style={{
          position: "absolute",
          top: 6,
          left: "12%",
          width: "30%",
          height: 22,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.5)",
          filter: "blur(6px)",
        }}
      />
      {/* icing drips */}
      <Icing width={width} color={drip} />
      {/* gold beads */}
      {Array.from({ length: Math.max(4, Math.floor(width / 46)) }, (_, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            bottom: 12,
            left: `${(i + 0.5) * (100 / Math.max(4, Math.floor(width / 46)))}%`,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 35%, #fff3b0, #e8b800)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
          }}
        />
      ))}
    </div>
  );
}

/** Scalloped icing drip along the top edge */
function Icing({ width, color }) {
  const d = Array.from({ length: 12 }, (_, i) => {
    const x = (i / 11) * width;
    const h = i % 3 === 0 ? 12 : i % 3 === 1 ? 20 : 8;
    return `M${x} ${h} C${x + width / 22} 0, ${x + (width / 22) * 3} 0, ${x + width / 11} ${h}`;
  }).join(" ");
  return (
    <svg width={width} height={26} style={{ position: "absolute", top: -2, left: 0 }} preserveAspectRatio="none">
      <path d={`M0 0 L0 14 ${d} L${width} 14 L${width} 0 Z`} fill={color} />
      <path d={`M0 0 L0 14 ${d} L${width} 14 L${width} 0`} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
    </svg>
  );
}
