/**
 * ============================================================
 *  CENTRAL CONTENT FILE — edit everything personal here.
 *  No React components need to be touched.
 * ============================================================
 *
 *  HOW TO CUSTOMIZE:
 *  1. sisterName / age / signature  → your personal details
 *  2. puzzles  →  SIMPLE UPLOAD SYSTEM:
 *     Drop (or overwrite) three photos into  public/images/puzzles/
 *     named  puzzle1.jpg, puzzle2.jpg, puzzle3.jpg.
 *     That's it — no code needs to be edited. The app reads them
 *     automatically as the three drag-and-drop photo puzzles.
 *  3. letters                       → edit the three letters below
 *  4. videoFileName                 → drop your video into
 *                                     public/videos/birthday.mp4
 *  5. movieTitle                    → shown on the cinema posters
 *  6. finalMessage                  → shown in the ending
 */

export const content = {
  /** Your sister's name (shown in the finale constellation) */
  sisterName: "My Dear Sister",

  /** Her age — also the number of stars in the ending */
  age: 15,

  /** Who the letters are signed by */
  signature: "Your biggest fan, forever",

  /** Cinema movie title */
  movieTitle: "A Birthday To Remember",

  /** File name of your birthday video (placed in public/videos/) */
  videoFileName: "birthday.mp4",

  /** The 3 photo puzzles — images are auto-loaded from public/images/puzzles/ */
  puzzles: [
    {
      image: "/images/puzzles/puzzle1.jpg",
      cols: 2,
      rows: 2,
      caption: "A memory made with love, one piece at a time 📸",
    },
    {
      image: "/images/puzzles/puzzle2.jpg",
      cols: 3,
      rows: 2,
      caption: "Some moments are worth keeping forever 💛",
    },
    {
      image: "/images/puzzles/puzzle3.jpg",
      cols: 2,
      rows: 2,
      caption: "The best stories are the ones we live together 🌟",
    },
  ],

  /** The 3 letters resting on the wooden table */
  envelopes: [
    {
      id: "q-september",
      title: "The September Letter",
      icon: "🍂",
      letter:
        "A little secret from the starry September sky — purely for fun, not science! 🌟\n\nPeople born in September are often said to be:\nthoughtful, calm, creative, organised, determined, caring,\nand wonderfully detail-oriented.\n\nNow, I'm not saying the stars know what they're talking about...\nbut if they do, they clearly had YOU in mind. 😉\n\nWhatever the sky says, one thing is certain —\nyou are wonderfully, perfectly you.",
    },
    {
      id: "q-about-you",
      title: "About You",
      icon: "💛",
      letter:
        "Dear {sisterName},\n\nIf I had to write down everything that makes you beautiful, I'd need more pages than there are stars.\n\nYour heart is the first thing people notice. You care so deeply, you love so openly, and you make everyone around you feel a little warmer just by being there.\n\nYour smile lights up a whole room. Your laugh is my favourite sound. And the way you see the good in people — even on hard days — is a kind of magic the world can't teach.\n\nYou're brave when things are scary, kind when it would be easier not to be, and strong in a quiet way that amazes me every single day.\n\nNever doubt how wonderful you are. Everyone who knows you sees it — and I hope you see it too.\n\nWith all my love,\n{signature}",
    },
    {
      id: "q-birthday",
      title: "Happy Birthday",
      icon: "🎂",
      letter:
        "Happy Birthday, {sisterName}! 🎂\n\nToday the world gets to celebrate the wonderful person you are — and I couldn't be prouder to celebrate with you.\n\nMy wishes for you today and always:\n\n• Endless happiness that finds you even on ordinary days\n• Success in everything you set your heart on\n• Good health and energy for every adventure ahead\n• Quiet confidence in all that you are\n• Big dreams — and the courage to chase them\n• A future as bright and beautiful as you are\n\nMay this new year of your life be your most magical yet.\n\nWith all my heart,\n{signature}",
    },
  ],

  /** Final message in the ending */
  finalMessage:
    "No matter how many birthdays come...\nyou'll always be one of my greatest blessings.",
};
