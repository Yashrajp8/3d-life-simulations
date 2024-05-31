import React, { useRef, useEffect } from 'react';

const AlgorithmicLife = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const drawCircle = (x, y, radius, color) => {
      context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI, false);
      context.fillStyle = color;
      context.fill();
      context.closePath();
    };

    const atoms = [];
    const atom = (x, y, color) => {
      return { x: x, y: y, vx: 0, vy: 0, color: color };
    };

    const random = () => {
      return Math.random() * (canvas.width - 100) + 50;
    };

    const create = (number, color) => {
      const group = [];
      for (let i = 0; i < number; i++) {
        group.push(atom(random(), random(), color));
        atoms.push(group[i]);
      }
      return group;
    };

    const rule = (atoms1, atoms2, g) => {
      for (let i = 0; i < atoms1.length; i++) {
        let fx = 0;
        let fy = 0;
        for (let j = 0; j < atoms2.length; j++) {
          const a = atoms1[i];
          const b = atoms2[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > 0 && d < 80) {
            const F = (g * 1) / d;
            fx += F * dx;
            fy += F * dy;
          }
        }
        const a = atoms1[i];
        a.vx = (a.vx + fx) * 0.5;
        a.vy = (a.vy + fy) * 0.5;
        a.x += a.vx;
        a.y += a.vy;
        if (a.x <= 0 || a.x >= canvas.width) { a.vx *= -1; }
        if (a.y <= 0 || a.y >= canvas.height) { a.vy *= -1; }
      }
    };

    const yellow = create(200, "rgba(255, 255, 0, 0.8)");
    const red = create(200, "rgba(255, 0, 0, 0.8)");
    const green = create(200, "rgba(0, 255, 0, 0.8)");

    const update = () => {
      rule(green, green, -0.32);
      rule(green, red, -0.17);
      rule(green, yellow, 0.34);
      rule(red, red, -0.1);
      rule(red, green, -0.34);
      rule(yellow, yellow, 0.15);
      rule(yellow, green, -0.2);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'black';
      context.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < atoms.length; i++) {
        drawCircle(atoms[i].x, atoms[i].y, 2, atoms[i].color);
      }
      requestAnimationFrame(update);
    };
    update();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      context.fillRect(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} />
  );
};

export default AlgorithmicLife;
