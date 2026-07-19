import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export default function ChemicalTransition() {
  const location = useLocation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [active, setActive] = useState(false);
  const prevPathname = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPathname.current) {
      prevPathname.current = location.pathname;
      setActive(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const startTime = performance.now();
    const duration = 850; // ms transition duration

    // Check prefers-reduced-motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      const timer = setTimeout(() => setActive(false), duration);
      return () => clearTimeout(timer);
    }

    // Canvas sizing
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particles setup
    const particleCount = 45;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      type: "bubble" | "molecule" | "dust";
    }> = [];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const isBubble = Math.random() < 0.35;
      const isMolecule = Math.random() < 0.45;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: isBubble ? -Math.random() * 1.2 - 0.4 : (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 4 + 2,
        color: Math.random() < 0.6 ? "#005FA9" : "#2DD4BF",
        alpha: Math.random() * 0.6 + 0.4,
        type: isBubble ? "bubble" : isMolecule ? "molecule" : "dust",
      });
    }

    // Hexagonal patterns setup
    const hexagonCount = 3;
    const hexagons: Array<{
      x: number;
      y: number;
      size: number;
      rot: number;
      rotSpeed: number;
      alpha: number;
    }> = [];

    for (let i = 0; i < hexagonCount; i++) {
      hexagons.push({
        x: Math.random() * (canvas.width - 200) + 100,
        y: Math.random() * (canvas.height - 200) + 100,
        size: Math.random() * 35 + 25,
        rot: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.008,
        alpha: Math.random() * 0.25 + 0.1,
      });
    }

    // Function to draw hexagon
    const drawHexagon = (cx: number, cy: number, size: number, rot: number) => {
      ctx.beginPath();
      for (let s = 0; s < 6; s++) {
        const angle = rot + (s * Math.PI) / 3;
        const x = cx + size * Math.cos(angle);
        const y = cy + size * Math.sin(angle);
        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Soft liquid ripple / diffusion expanding from the center
      const maxRippleRadius = Math.max(canvas.width, canvas.height) * 0.6;
      const rippleProgress = progress; // 0 to 1
      const rippleRadius = maxRippleRadius * rippleProgress;
      const rippleAlpha = Math.sin(rippleProgress * Math.PI) * 0.12;

      if (rippleAlpha > 0) {
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, rippleRadius, 0, Math.PI * 2);
        
        const gradient = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          rippleRadius * 0.85,
          canvas.width / 2,
          canvas.height / 2,
          rippleRadius
        );
        gradient.addColorStop(0, "rgba(45, 212, 191, 0)");
        gradient.addColorStop(0.7, `rgba(45, 212, 191, ${rippleAlpha * 0.5})`);
        gradient.addColorStop(0.9, `rgba(0, 95, 169, ${rippleAlpha * 0.3})`);
        gradient.addColorStop(1, "rgba(0, 95, 169, 0)");
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 12;
        ctx.stroke();

        // Secondary ripple (delayed/offset)
        if (rippleProgress > 0.2) {
          const r2Progress = (rippleProgress - 0.2) / 0.8;
          ctx.beginPath();
          ctx.arc(canvas.width / 2, canvas.height / 2, maxRippleRadius * r2Progress, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 95, 169, ${Math.sin(r2Progress * Math.PI) * 0.05})`;
          ctx.lineWidth = 4;
          ctx.stroke();
        }
      }

      // 2. Hexagonal molecular patterns (appearing for a fraction of a second)
      const hexAlphaMult = Math.max(0, Math.sin((progress - 0.1) * (1 / 0.8) * Math.PI));
      if (hexAlphaMult > 0) {
        hexagons.forEach((hex) => {
          hex.rot += hex.rotSpeed;
          ctx.save();
          ctx.strokeStyle = `rgba(0, 95, 169, ${hex.alpha * hexAlphaMult * 0.35})`;
          ctx.lineWidth = 1;
          
          drawHexagon(hex.x, hex.y, hex.size, hex.rot);
          ctx.stroke();

          // Vertex nodes
          for (let s = 0; s < 6; s++) {
            const angle = hex.rot + (s * Math.PI) / 3;
            const vx = hex.x + hex.size * Math.cos(angle);
            const vy = hex.y + hex.size * Math.sin(angle);
            
            ctx.beginPath();
            ctx.arc(vx, vy, 3, 0, Math.PI * 2);
            ctx.fillStyle = s % 2 === 0 ? "#2DD4BF" : "#005FA9";
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(vx, vy, 5, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 95, 169, ${hex.alpha * hexAlphaMult * 0.4})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
          ctx.restore();
        });
      }

      // 3. Floating microscopic particles and connecting molecular bonds
      const overallAlpha = Math.sin(progress * Math.PI); // fade-in/fade-out peak in middle

      // Connecting lines for molecular bonds
      ctx.lineWidth = 0.8;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        if (p1.type !== "molecule") continue;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          if (p2.type !== "molecule") continue;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.2 * overallAlpha;
            ctx.strokeStyle = `rgba(0, 95, 169, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Render individual particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const pAlpha = p.alpha * overallAlpha;
        if (pAlpha <= 0) return;

        if (p.type === "bubble") {
          // Hollow chemical bubble
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(45, 212, 191, ${pAlpha * 0.9})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Subtle internal reflection dot
          ctx.beginPath();
          ctx.arc(p.x - p.radius * 0.3, p.y - p.radius * 0.3, 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${pAlpha})`;
          ctx.fill();
        } else if (p.type === "molecule") {
          // Solid molecular node
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 95, 169, ${pAlpha * 0.85})`;
          ctx.fill();

          // Halo ring
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 1.6, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 95, 169, ${pAlpha * 0.3})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        } else {
          // Fine chemical dust / laboratory precipitate
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(45, 212, 191, ${pAlpha * 0.75})`;
          ctx.fill();
        }
      });

      if (progress < 1) {
        animationId = requestAnimationFrame(tick);
      } else {
        setActive(false);
      }
    };

    animationId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-50 bg-transparent"
    />
  );
}
