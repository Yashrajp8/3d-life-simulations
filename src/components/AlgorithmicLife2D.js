import React, { useEffect, useRef, useState } from 'react';

const AlgorithmicLife2D = ({ numAtoms, numAtomTypes, colors, rules, speed, ruleType, connectLines, trailEffect, running }) => {
  const canvasRef = useRef(null);
  const [atoms, setAtoms] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      context.fillStyle = 'black';
      context.fillRect(0, 0, canvas.width, canvas.height);
    };

    const initializeAtoms = () => {
      const newAtoms = [];
      const atom = (x, y, c) => ({ x, y, vx: 0, vy: 0, color: c });
      const random = () => Math.random() * canvas.width;
      for (let i = 0; i < numAtomTypes; i++) {
        for (let j = 0; j < numAtoms / numAtomTypes; j++) {
          newAtoms.push(atom(random(), random(), colors[i]));
        }
      }
      setAtoms(newAtoms);
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
        a.x += a.vx * speed;
        a.y += a.vy * speed;
        if (a.x <= 0 || a.x >= canvas.width) a.vx *= -1;
        if (a.y <= 0 || a.y >= canvas.height) a.vy *= -1;
      }
    };

    const draw = (x, y, c, s) => {
      context.fillStyle = c;
      context.beginPath();
      context.arc(x, y, s / 2, 0, 2 * Math.PI);
      context.fill();
    };

    const detectCollisions = () => {
      for (let i = 0; i < atoms.length; i++) {
        for (let j = i + 1; j < atoms.length; j++) {
          const a = atoms[i];
          const b = atoms[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 5) { // collision detected
            const totalMass = 1; // assuming equal mass
            const v1 = { x: a.vx, y: a.vy };
            const v2 = { x: b.vx, y: b.vy };

            a.vx = ((v1.x * (totalMass - 1)) + (2 * 1 * v2.x)) / totalMass;
            a.vy = ((v1.y * (totalMass - 1)) + (2 * 1 * v2.y)) / totalMass;
            b.vx = ((v2.x * (totalMass - 1)) + (2 * 1 * v1.x)) / totalMass;
            b.vy = ((v2.y * (totalMass - 1)) + (2 * 1 * v1.y)) / totalMass;
          }
        }
      }
    };

    initializeAtoms();

    const update = () => {
      if (!running) return;

      if (!trailEffect) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        context.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Adjust the alpha value for a smoother trail effect
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      rule(atoms, atoms, rules.yellowYellow);
      rule(atoms, atoms, rules.yellowRed);
      rule(atoms, atoms, rules.yellowGreen);
      rule(atoms, atoms, rules.redRed);
      rule(atoms, atoms, rules.redGreen);
      rule(atoms, atoms, rules.greenGreen);

      if (connectLines) {
        context.strokeStyle = 'white';
        context.lineWidth = 0.5;
        for (let i = 0; i < atoms.length; i++) {
          for (let j = i + 1; j < atoms.length; j++) {
            if (atoms[i].color === atoms[j].color) {
              context.beginPath();
              context.moveTo(atoms[i].x, atoms[i].y);
              context.lineTo(atoms[j].x, atoms[j].y);
              context.strokeStyle = atoms[i].color;
              context.stroke();
            }
          }
        }
      }

      detectCollisions();

      for (let i = 0; i < atoms.length; i++) {
        draw(atoms[i].x, atoms[i].y, atoms[i].color, 5);
      }

      requestAnimationFrame(update);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    update();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [numAtoms, numAtomTypes, colors, rules, speed, ruleType, connectLines, trailEffect, running]);

  return <canvas ref={canvasRef} className="simulation-canvas" />;
};

export default AlgorithmicLife2D;
