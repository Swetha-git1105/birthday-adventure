# Drop-in assets — put your personal files here

Nothing here is required for the app to run; placeholders / fallbacks are shown when
files are missing. Replace them to make the adventure truly yours.

## images/puzzles/
Photo puzzles hidden in the golden balloons (Scene 2 – Balloon Kingdom).
Filenames must match `content.js` → `puzzles[].image`:

- `puzzle1.jpg` — (default: 2x2 grid)
- `puzzle2.jpg` — (default: 3x2 grid)
- `puzzle3.jpg` — (default: 2x3 grid)

Square or landscape photos work best. While an image is loading (or if it is
missing), a shimmering "✨" placeholder appears instead of a broken image.

## images/gallery/
Room for future gallery images. Not currently referenced by scenes.

## videos/
Birthday video played in the cinema (Scene 5).
Filename must match `content.js` → `videoFileName` (default: `birthday.mp4`).

- MP4 (H.264) is the most compatible format.
- If the file is missing, the cinema shows a "🎬 Movie Coming Soon" placeholder
  screen instead of a broken player.
