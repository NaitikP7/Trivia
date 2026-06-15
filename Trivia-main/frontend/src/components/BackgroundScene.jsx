import { useRef, useEffect, useCallback } from 'react';

export default function BackgroundScene() {
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);

  // Parallax on mouse move
  const handleMouseMove = useCallback((e) => {
    if (!imageRef.current) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    imageRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
  }, []);

  // Dust particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Init particles
    const count = 60;
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: Math.random() * 0.2 + 0.05,
      opacity: Math.random() * 0.4 + 0.1,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;

        if (p.y > canvas.height + 10) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 190, 170, ${p.opacity})`;
        ctx.fill();
      });
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Blood drips
  const drips = Array.from({ length: 4 }, (_, i) => ({
    left: `${15 + i * 22}%`,
    height: `${40 + Math.random() * 80}px`,
    animationDuration: `${6 + Math.random() * 6}s`,
    animationDelay: `${Math.random() * 8}s`,
  }));

  return (
    <div className="bg-scene" onMouseMove={handleMouseMove}>
      <div ref={imageRef} className="bg-scene__image" />
      <div className="bg-scene__overlay" />

      {/* Atmospheric decoration images */}
      <img src="/new_hacker.jpeg" alt="" className="bg-decor bg-decor--right" />
      <img src="/police-straps.png" alt="" className="bg-decor bg-decor--bottom-left" />

      <div className="bg-scene__lamp" />
      <canvas ref={canvasRef} className="dust-canvas" />
      {drips.map((style, i) => (
        <div key={i} className="blood-drip" style={style} />
      ))}
    </div>
  );
}
