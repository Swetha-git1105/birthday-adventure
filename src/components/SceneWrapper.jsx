import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { playComplete, playStarCollect, playCelebration } from "../utils/sounds.js";
import Modal from "./Modal.jsx";

/**
 * Shared logic for wrapping a scene with completion flow.
 *
 * @param {{sceneId: string, onReturnToMap: () => void, onCompleteScene: (id:string)=>void, children: (helpers: SceneHelpers) => React.ReactNode}} props
 *
 * @typedef {{collectStar: (id:number)=>void, isCollected: (id:number)=>boolean, markComplete: ()=>void}} SceneHelpers
 */
export default function SceneWrapper({ sceneId, onReturnToMap, onCompleteScene, collectedStars, collectStar: gsCollect, children }) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationText, setCelebrationText] = useState("Scene Complete!");

  const handleCollect = useCallback(
    (starId) => {
      if (!collectedStars.includes(starId)) {
        gsCollect(starId);
        playStarCollect();
      }
    },
    [collectedStars, gsCollect]
  );

  const isCollected = useCallback(
    (starId) => collectedStars.includes(starId),
    [collectedStars]
  );

  const markComplete = useCallback(
    (text = "Scene Complete!") => {
      onCompleteScene(sceneId);
      setCelebrationText(text);
      setShowCelebration(true);
      playComplete();
    },
    [sceneId, onCompleteScene]
  );

  useEffect(() => {
    if (!showCelebration) return;
    playCelebration();
    const timer = setTimeout(() => {
      setShowCelebration(false);
      onReturnToMap();
    }, 2500);
    return () => clearTimeout(timer);
  }, [showCelebration, onReturnToMap]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
      }}
    >
      {children({ collectStar: handleCollect, isCollected, markComplete })}

      <Modal show={showCelebration} title={celebrationText}>
        <p style={{ color: "var(--text-secondary)", fontSize: 16, marginTop: 8 }}>
          Returning to map...
        </p>
      </Modal>
    </motion.div>
  );
}
