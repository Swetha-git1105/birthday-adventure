import { useEffect, useRef } from "react";
import { playFirework } from "../utils/sounds.js";

const COLORS = ["#ff6b9d", "#ffd700", "#4ecdc4", "#a855f7", "#5b9aff", "#ff8c42"];

/**
 * Full-screen canvas fireworks display.
 * @param {{active: boolean, launchInterval?: number}} props
 */
export default function FireworksCanvas({ active, launchInterval = 450 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const rockets = [];

    function launch() {
      rockets.push({
        x: 100 + Math.random() * Math.max(200, canvas.width - 200),
        y: canvas.height,
        vy: -(8 + Math.random() * 4),
        targetY: 60 + Math.random() * (canvas.height * 0.4),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        particles: null,
      });
    }

    function explode(rocket) {
      rocket.particles = [];
      const count = 40 + Math.floor(Math.random() * 30);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.1;
        const speed = 2 + Math.random() * 3;
        rocket.particles.push({
          x: rocket.x,
          y: rocket.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.008 + Math.random() * 0.012,
          size: 1.5 + Math.random() * 2,
        });
      }
      playFirework();
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        if (r.particles) {
          let alive = false;
          for (const p of r.particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05;
            p.life -= p.decay;
            if (p.life > 0) {
              alive = true;
              ctx.globalAlpha = Math.max(0, p.life);
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fillStyle = r.color;
              ctx.fill();
            }
          }
          if (!alive) {
            rockets.splice(i, 1);
          }
        } else {
          r.y += r.vy;
          r.vy += 0.08;
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = r.color;
          ctx.fill();
          if (r.y <= r.targetY) {
            explode(r);
          }
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    }

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    const interval = setInterval(launch, launchInterval);
    draw();
    window.addEventListener("resize", resize);

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [active, launchInterval]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 20,
        pointerEvents: "none",
      }}
    />
  );
}
