const SAVE_KEY = "birthday-adventure-save";

/**
 * @returns {{activeScene:string|null,completedScenes:string[],collectedStars:number[],unlockedMemories:string[],settings:{sound:boolean,music:boolean}}}
 */
export function loadGameState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        activeScene: parsed.activeScene || null,
        completedScenes: Array.isArray(parsed.completedScenes) ? parsed.completedScenes : [],
        collectedStars: Array.isArray(parsed.collectedStars) ? parsed.collectedStars : [],
        unlockedMemories: Array.isArray(parsed.unlockedMemories) ? parsed.unlockedMemories : [],
        settings: {
          sound: parsed.settings?.sound !== false,
          music: parsed.settings?.music !== false,
        },
      };
    }
  } catch {
    /* corrupt data — fall through */
  }
  return defaultState();
}

/**
 * @param {object} state
 */
export function saveGameState(state) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    /* quota exceeded — silently ignore */
  }
}

/**
 * @returns {object}
 */
export function defaultState() {
  return {
    activeScene: null,
    completedScenes: [],
    collectedStars: [],
    unlockedMemories: [],
    settings: { sound: true, music: true },
  };
}
