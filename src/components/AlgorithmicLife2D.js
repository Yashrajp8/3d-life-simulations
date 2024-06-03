import React, { useEffect, useRef, useState } from 'react';

const AlgorithmicLife2D = ({ numAtoms, numAtomTypes, colors, rules, speed, ruleType, connectLines, trailEffect, running, viscosity }) => {
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
      const atom = (x, y, vx, vy, c) => ({
        x,
        y,
        vx,
        vy,
        ax: 0,
        ay: 0,
        color: c,
      });
      const random = (max) => Math.random() * max;
      const atomsPerType = Math.floor(numAtoms / numAtomTypes);

      for (let i = 0; i < numAtomTypes; i++) {
        for (let j = 0; j < atomsPerType; j++) {
          newAtoms.push(atom(random(canvas.width), random(canvas.height), (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, colors[i]));
        }
      }
      setAtoms(newAtoms);
    };

    const applyRules = (atoms1, atoms2, ruleKey, sameType) => {
      const rule = rules[ruleKey];
      const accelerationFactor = sameType ? 2 : 1;
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
            const attraction = (rule.attraction * accelerationFactor) / d;
            const repulsion = (rule.repulsion * accelerationFactor) / (d * d);
            const F = attraction - repulsion;
            fx += F * dx;
            fy += F * dy;
          }
        }
        const a = atoms1[i];
        a.ax = fx * (1 - viscosity);
        a.ay = fy * (1 - viscosity);
        a.vx = (a.vx + a.ax) * 0.5;
        a.vy = (a.vy + a.ay) * 0.5;
        a.x += a.vx * speed;
        a.y += a.vy * speed;
        if (a.x <= 0 || a.x >= canvas.width) a.vx *= -1;
        if (a.y <= 0 || a.y >= canvas.height) a.vy *= -1;
      }
    };

    const draw = (x, y, c, s, alpha = 1) => {
      context.fillStyle = `rgba(${parseInt(c.slice(1, 3), 16)}, ${parseInt(c.slice(3, 5), 16)}, ${parseInt(c.slice(5, 7), 16)}, ${alpha})`;
      context.beginPath();
      context.arc(x, y, s / 4, 0, 2 * Math.PI); // Smaller atom size
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
          if (distance < 2.5) { // collision detected, adjusted for smaller atoms
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

    const update = () => {
      if (!running) return;

      if (!trailEffect) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'black';
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      for (let i = 0; i < numAtomTypes; i++) {
        for (let j = 0; j < numAtomTypes; j++) {
          const ruleKey = `${colors[i]}-${colors[j]}`;
          const sameType = i === j;
          applyRules(atoms.filter(a => a.color === colors[i]), atoms.filter(a => a.color === colors[j]), ruleKey, sameType);
        }
      }

      if (connectLines) {
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
        draw(atoms[i].x, atoms[i].y, atoms[i].color, 5, trailEffect ? 0.6 : 1);
      }

      requestAnimationFrame(update);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    initializeAtoms();
    update();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [numAtoms, numAtomTypes, colors, rules, speed, ruleType, connectLines, trailEffect, running, viscosity]);

  return <canvas ref={canvasRef} className="simulation-canvas" />;
};

export default AlgorithmicLife2D;
