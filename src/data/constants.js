/** @type {string} */
export const STORAGE_KEY = "birthday-adventure-save";

/** @type {string[]} */
export const SCENE_IDS = [
  "scene1",
  "scene2",
  "scene3",
  "scene4",
  "scene5",
  "finale",
];

/** @type {Record<string, number>} star offsets for each scene */
export const SCENE_STAR_RANGES = {
  scene1: [1],
  scene2: [2, 3, 4],
  scene3: [5, 6, 7],
  scene4: [8, 9, 10],
  scene5: [11, 12, 13, 14],
  finale: [15],
};

/** @type {Record<string, string>} human-readable scene names */
export const SCENE_NAMES = {
  scene1: "Snowy Penguin Village",
  scene2: "Balloon Kingdom",
  scene3: "Birthday Cake",
  scene4: "Cozy Letters",
  scene5: "Cinema",
  finale: "Grand Finale",
};

/** @type {Record<string, string>} scene icons */
export const SCENE_ICONS = {
  scene1: "🐧",
  scene2: "🎈",
  scene3: "🎂",
  scene4: "💌",
  scene5: "🎬",
  finale: "🎆",
};

export const TOTAL_STARS = 15;
