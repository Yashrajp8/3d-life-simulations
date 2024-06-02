import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './AlgorithmicLife.css';

const AlgorithmicLife = () => {
  const canvasRef = useRef(null);
  const [atoms, setAtoms] = useState([]);
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [numAtoms, setNumAtoms] = useState(200);
  const [restart, setRestart] = useState(false);
  const [numAtomTypes, setNumAtomTypes] = useState(3);
  const [trailEffect, setTrailEffect] = useState(false);
  const [connectLines, setConnectLines] = useState(false);
  const [view3D, setView3D] = useState(false);
  const [colors, setColors] = useState([
    "#FFFF00", // yellow
    "#FF0000", // red
    "#00FF00", // green
    "#0000FF", // blue
    "#FF00FF", // magenta
    "#00FFFF", // cyan
  ]);
  const [rules, setRules] = useState({
    yellowYellow: 0.15,
    yellowRed: -0.2,
    yellowGreen: 0.34,
    redRed: -0.1,
    redGreen: -0.34,
    greenGreen: -0.32,
  });
  const [ruleType, setRuleType] = useState('basic');

  useEffect(() => {
    const canvas = canvasRef.current;

    if (view3D) {
      // 3D View initialization
      let renderer, scene, camera, controls, particles = [];

      try {
        renderer = new THREE.WebGLRenderer({ canvas });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
      } catch (e) {
        console.error("Error creating WebGL context: ", e);
        return;
      }

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
      camera.position.z = 5;

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      controls.enableZoom = true;

      const geometry = new THREE.SphereGeometry(0.1, 32, 32);
      const materials = colors.map(color => new THREE.MeshBasicMaterial({ color }));

      for (let i = 0; i < numAtoms; i++) {
        const material = materials[i % numAtomTypes];
        const particle = new THREE.Mesh(geometry, material);
        particle.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
        particles.push(particle);
        scene.add(particle);
      }

      const animate = () => {
        if (!running) return;

        particles.forEach(p => {
          // Basic movement logic for particles
          p.position.x += (Math.random() - 0.5) * 0.1;
          p.position.y += (Math.random() - 0.5) * 0.1;
          p.position.z += (Math.random() - 0.5) * 0.1;
        });

        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };

      animate();

      const handleResize = () => {
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        // Cleanup for 3D view
        renderer.dispose();
        scene.clear();
        window.removeEventListener('resize', handleResize);
      };
    } else {
      // 2D View initialization
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
        }

        if (ruleType === 'basic') {
          rule(atoms, atoms, rules.yellowYellow);
          rule(atoms, atoms, rules.yellowRed);
          rule(atoms, atoms, rules.yellowGreen);
          rule(atoms, atoms, rules.redRed);
          rule(atoms, atoms, rules.redGreen);
          rule(atoms, atoms, rules.greenGreen);
        } else {
          // Complex rules can include different interaction mechanisms and additional agents
          rule(atoms, atoms, rules.yellowYellow);
          rule(atoms, atoms, rules.yellowRed);
          rule(atoms, atoms, rules.yellowGreen);
          rule(atoms, atoms, rules.redRed);
          rule(atoms, atoms, rules.redGreen);
          rule(atoms, atoms, rules.greenGreen);

          // Add complex interaction logic here for multiple agent systems
          // e.g., introducing another type of atom and additional behaviors
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
    }
  }, [restart, speed, numAtoms, colors, rules, ruleType, numAtomTypes, trailEffect, connectLines, view3D, running]);

  const handleRestart = () => {
    setRestart(prev => !prev);
  };

  const handlePlayPause = () => {
    setRunning(prev => !prev);
  };

  const handleSpeedChange = (event) => {
    setSpeed(event.target.value);
  };

  const handleNumAtomsChange = (event) => {
    setNumAtoms(event.target.value);
  };

  const handleNumAtomTypesChange = (event) => {
    setNumAtomTypes(event.target.value);
  };

  const handleColorChange = (index, event) => {
    const newColors = [...colors];
    newColors[index] = event.target.value;
    setColors(newColors);
  };

  const handleRuleChange = (event) => {
    const { name, value } = event.target;
    setRules(prevRules => ({ ...prevRules, [name]: parseFloat(value) }));
  };

  const handleRuleTypeChange = (event) => {
    setRuleType(event.target.value);
  };

  const handleRandomizeRules = () => {
    const randomRules = {};
    Object.keys(rules).forEach(rule => {
      randomRules[rule] = Math.random() * 2 - 1; // Random value between -1 and 1
    });
    setRules(randomRules);
  };

  const handleTrailEffectToggle = () => {
    setTrailEffect(prev => !prev);
  };

  const handleConnectLinesToggle = () => {
    setConnectLines(prev => !prev);
  };

  const handleView3DToggle = () => {
    setView3D(prev => !prev);
    setRestart(prev => !prev); // Restart the simulation to reinitialize atoms
  };

  return (
    <div className="container">
      <div className="left-panel">
        <div className="control-section">
          <button onClick={handlePlayPause} className="control-button">
            {running ? 'Pause' : 'Play'}
          </button>
          <button onClick={handleRestart} className="control-button">
            Restart
          </button>
          <button onClick={handleRandomizeRules} className="control-button">
            Randomize Rules
          </button>
          <label>
            Speed:
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={speed}
              onChange={handleSpeedChange}
            />
          </label>
          <label>
            Number of Atoms:
            <input
              type="number"
              min="50"
              max="500"
              value={numAtoms}
              onChange={handleNumAtomsChange}
            />
          </label>
          <label>
            Number of Atom Types:
            <input
              type="number"
              min="3"
              max="6"
              value={numAtomTypes}
              onChange={handleNumAtomTypesChange}
            />
          </label>
          {colors.slice(0, numAtomTypes).map((color, index) => (
            <label key={index}>
              Atom Type {index + 1} Color:
              <input
                type="color"
                value={color}
                onChange={(e) => handleColorChange(index, e)}
              />
            </label>
          ))}
          <label>
            Rule Type:
            <select value={ruleType} onChange={handleRuleTypeChange}>
              <option value="basic">Basic</option>
              <option value="complex">Complex</option>
            </select>
          </label>
          <label>
            Trail Effect:
            <input
              type="checkbox"
              checked={trailEffect}
              onChange={handleTrailEffectToggle}
            />
          </label>
          <label>
            Connect Lines:
            <input
              type="checkbox"
              checked={connectLines}
              onChange={handleConnectLinesToggle}
            />
          </label>
          <label>
            3D View:
            <input
              type="checkbox"
              checked={view3D}
              onChange={handleView3DToggle}
            />
          </label>
        </div>
        <div className="rule-section">
          <label>
            Yellow-Yellow Interaction:
            <input
              type="range"
              name="yellowYellow"
              min="-1"
              max="1"
              step="0.01"
              value={rules.yellowYellow}
              onChange={handleRuleChange}
            />
          </label>
          <label>
            Yellow-Red Interaction:
            <input
              type="range"
              name="yellowRed"
              min="-1"
              max="1"
              step="0.01"
              value={rules.yellowRed}
              onChange={handleRuleChange}
            />
          </label>
          <label>
            Yellow-Green Interaction:
            <input
              type="range"
              name="yellowGreen"
              min="-1"
              max="1"
              step="0.01"
              value={rules.yellowGreen}
              onChange={handleRuleChange}
            />
          </label>
          <label>
            Red-Red Interaction:
            <input
              type="range"
              name="redRed"
              min="-1"
              max="1"
              step="0.01"
              value={rules.redRed}
              onChange={handleRuleChange}
            />
          </label>
          <label>
            Red-Green Interaction:
            <input
              type="range"
              name="redGreen"
              min="-1"
              max="1"
              step="0.01"
              value={rules.redGreen}
              onChange={handleRuleChange}
            />
          </label>
          <label>
            Green-Green Interaction:
            <input
              type="range"
              name="greenGreen"
              min="-1"
              max="1"
              step="0.01"
              value={rules.greenGreen}
              onChange={handleRuleChange}
            />
          </label>
        </div>
      </div>
      <canvas ref={canvasRef} className="simulation-canvas" />
    </div>
  );
};

export default AlgorithmicLife;
