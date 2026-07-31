import { useCallback, useSyncExternalStore } from "react";
import { loadGameState, saveGameState, defaultState } from "../utils/storage.js";
import { SCENE_IDS } from "../data/constants.js";

let state = loadGameState();
const listeners = new Set();

function emit() {
  saveGameState(state);
  listeners.forEach((fn) => fn());
}

function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function getSnapshot() {
  return state;
}

/** Returns true if `sceneId` should be unlocked based purely on previous scene completion */
function computeUnlocked(sceneId) {
  const idx = SCENE_IDS.indexOf(sceneId);
  if (idx <= 0) return true;
  return state.completedScenes.includes(SCENE_IDS[idx - 1]);
}

export function useGameState() {
  const snap = useSyncExternalStore(subscribe, getSnapshot);

  const completeScene = useCallback((sceneId) => {
    if (!state.completedScenes.includes(sceneId)) {
      state = { ...state, completedScenes: [...state.completedScenes, sceneId] };
      emit();
    }
  }, []);

  const collectStar = useCallback((starId) => {
    if (!state.collectedStars.includes(starId)) {
      state = { ...state, collectedStars: [...state.collectedStars, starId] };
      emit();
    }
  }, []);

  const setActiveScene = useCallback((sceneId) => {
    if (state.activeScene !== sceneId) {
      state = { ...state, activeScene: sceneId };
      emit();
    }
  }, []);

  const clearActiveScene = useCallback(() => {
    if (state.activeScene !== null) {
      state = { ...state, activeScene: null };
      emit();
    }
  }, []);

  const unlockMemory = useCallback((memId) => {
    if (!state.unlockedMemories.includes(memId)) {
      state = { ...state, unlockedMemories: [...state.unlockedMemories, memId] };
      emit();
    }
  }, []);

  const resetProgress = useCallback(() => {
    state = defaultState();
    emit();
  }, []);

  const isSceneUnlocked = useCallback(
    (sceneId) => computeUnlocked(sceneId),
    [snap.completedScenes]
  );

  const isSceneCompleted = useCallback(
    (sceneId) => snap.completedScenes.includes(sceneId),
    [snap.completedScenes]
  );

  return {
    activeScene: snap.activeScene,
    completedScenes: snap.completedScenes,
    collectedStars: snap.collectedStars,
    unlockedMemories: snap.unlockedMemories,
    settings: snap.settings,
    completeScene,
    collectStar,
    setActiveScene,
    clearActiveScene,
    unlockMemory,
    resetProgress,
    isSceneUnlocked,
    isSceneCompleted,
  };
}
