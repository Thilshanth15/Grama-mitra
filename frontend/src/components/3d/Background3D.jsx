import React, { useEffect, useRef } from 'react';

export default function Background3D() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracking for subtle 3D parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX - width / 2) * 0.05;
      targetMouseY = (e.clientY - height / 2) * 0.05;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // 3D Particles initialization
    const count = Math.min(Math.floor((width * height) / 18000), 75);
    const focalLength = 400;

    const colors = [
      'rgba(16, 185, 129, ',  // Emerald Green
      'rgba(56, 189, 248, ',  // Sapphire Cyan
      'rgba(168, 85, 247, ', // Royal Violet
      'rgba(245, 158, 11, ',  // Gold Amber
      'rgba(236, 72, 153, ',  // Magenta
    ];

    const particles = Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * width * 1.5,
      y: (Math.random() - 0.5) * height * 1.5,
      z: Math.random() * 600 - 300,
      baseX: 0,
      baseY: 0,
      baseZ: 0,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      vz: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2.5 + 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      phase: Math.random() * Math.PI * 2,
    }));

    let time = 0;

    const render = () => {
      time += 0.015;

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Render projected 3D points
      const projected = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move 3D particle positions with wave math
        p.x += p.vx + Math.sin(time + p.phase) * 0.3;
        p.y += p.vy + Math.cos(time + p.phase) * 0.3;
        p.z += p.vz;

        // Boundaries wrap
        const boundX = width * 0.9;
        const boundY = height * 0.9;
        if (p.x < -boundX) p.x = boundX;
        if (p.x > boundX) p.x = -boundX;
        if (p.y < -boundY) p.y = boundY;
        if (p.y > boundY) p.y = -boundY;
        if (p.z < -300) p.z = 300;
        if (p.z > 300) p.z = -300;

        // Apply mouse tilt 3D transformation
        const rotatedX = p.x + mouseX * (p.z / 300 + 1);
        const rotatedY = p.y + mouseY * (p.z / 300 + 1);

        // Perspective projection formula
        const scale = focalLength / (focalLength + p.z + 400);
        const projX = width / 2 + rotatedX * scale;
        const projY = height / 2 + rotatedY * scale;

        if (scale > 0) {
          projected.push({
            x: projX,
            y: projY,
            z: p.z,
            scale,
            radius: p.radius * scale,
            color: p.color,
          });
        }
      }

      // Draw 3D mesh connecting lines between close particles
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.22 * Math.min(p1.scale, p2.scale);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p1.color + alpha + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw 3D glowing particle nodes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const alpha = Math.min(1, Math.max(0.2, (p.z + 300) / 600)) * 0.7;

        // Radial glow gradient for 3D orb effect
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3.5);
        grad.addColorStop(0, p.color + alpha + ')');
        grad.addColorStop(0.5, p.color + (alpha * 0.4) + ')');
        grad.addColorStop(1, p.color + '0)');

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.65,
      }}
    />
  );
}
