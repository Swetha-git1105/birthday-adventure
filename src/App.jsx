import { useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameState } from "./hooks/useGameState.js";
import ParticleCanvas from "./components/ParticleCanvas.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import WorldMap from "./scenes/WorldMap.jsx";
import Scene1 from "./scenes/Scene1.jsx";
import Scene2 from "./scenes/Scene2.jsx";
import Scene3 from "./scenes/Scene3.jsx";
import Scene4 from "./scenes/Scene4.jsx";
import Scene5 from "./scenes/Scene5.jsx";
import Finale from "./scenes/Finale.jsx";
import { SCENE_IDS } from "./data/constants.js";

const SCENE_COMPONENTS = {
  scene1: Scene1,
  scene2: Scene2,
  scene3: Scene3,
  scene4: Scene4,
  scene5: Scene5,
  finale: Finale,
};

export default function App() {
  const game = useGameState();

  const activeSceneId = game.activeScene;

  /** Guard: never render a scene that isn't unlocked or isn't known */
  const safeSceneId = useMemo(() => {
    if (!activeSceneId) return null;
    if (!SCENE_IDS.includes(activeSceneId)) return null;
    if (!game.isSceneUnlocked(activeSceneId)) return null;
    return activeSceneId;
  }, [activeSceneId, game]);

  const handleReturnToMap = useMemo(
    () => () => game.clearActiveScene(),
    [game]
  );

  /** Always start a fresh session at the world map (progress itself is preserved). */
  useEffect(() => {
    if (activeSceneId) {
      game.clearActiveScene();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ActiveScene = safeSceneId ? SCENE_COMPONENTS[safeSceneId] : null;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "var(--bg-deep)",
      }}
    >
      <ParticleCanvas />

      <AnimatePresence mode="wait">
        {ActiveScene ? (
          <motion.div
            key={safeSceneId}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.45 }}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
            }}
          >
            <ErrorBoundary key={`boundary-${safeSceneId}`} onReturnToMap={handleReturnToMap}>
              <ActiveScene
                onReturnToMap={handleReturnToMap}
                onCompleteScene={game.completeScene}
                collectedStars={game.collectedStars}
                collectStar={game.collectStar}
                unlockedMemories={game.unlockedMemories}
                unlockMemory={game.unlockMemory}
                resetProgress={game.resetProgress}
              />
            </ErrorBoundary>
          </motion.div>
        ) : (
          <motion.div
            key="worldmap"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.45 }}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
            }}
          >
            <ErrorBoundary onReturnToMap={handleReturnToMap}>
              <WorldMap
                onSelectScene={game.setActiveScene}
                isUnlocked={game.isSceneUnlocked}
                isCompleted={game.isSceneCompleted}
                collectedStars={game.collectedStars}
                resetProgress={game.resetProgress}
              />
            </ErrorBoundary>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
