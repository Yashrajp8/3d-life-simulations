import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';

const AlgorithmicLife3D = ({ numAtoms, numAtomTypes, colors, running, rules, ruleType, trailEffect, connectLines, useAR }) => {
  const canvasRef = useRef(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    let renderer, scene, camera, controls, lineGroup;

    const init = () => {
      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.xr.enabled = useAR; // Enable XR for AR mode
      } catch (e) {
        console.error("Error creating WebGL context: ", e);
        return;
      }

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
      camera.position.z = 5;

      if (!useAR) {
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;
      }

      lineGroup = new THREE.Group();
      scene.add(lineGroup);

      const geometry = new THREE.SphereGeometry(0.1, 32, 32);
      const materials = colors.map(color => new THREE.MeshBasicMaterial({ color }));

      const newParticles = [];
      for (let i = 0; i < numAtoms; i++) {
        const material = materials[i % numAtomTypes];
        const particle = new THREE.Mesh(geometry, material);
        particle.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
        particle.velocity = new THREE.Vector3((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02);
        newParticles.push(particle);
        scene.add(particle);
      }
      setParticles(newParticles);

      if (useAR) {
        document.body.appendChild(ARButton.createButton(renderer));
      }

      const animate = () => {
        if (!running) return;

        if (ruleType === 'basic' || ruleType === 'complex') {
          applyRules();
        }

        particles.forEach(p => {
          p.position.add(p.velocity);
          if (p.position.x <= -5 || p.position.x >= 5) p.velocity.x *= -1;
          if (p.position.y <= -5 || p.position.y >= 5) p.velocity.y *= -1;
          if (p.position.z <= -5 || p.position.z >= 5) p.velocity.z *= -1;
        });

        if (trailEffect) {
          renderer.autoClearColor = false;
          renderer.setClearColor(0x000000, 0.1);
        } else {
          renderer.autoClearColor = true;
          renderer.setClearColor(0x000000, 1);
        }

        if (connectLines) {
          lineGroup.clear();
          particles.forEach(a => {
            particles.forEach(b => {
              if (a !== b && a.material.color.getHex() === b.material.color.getHex()) {
                const lineMaterial = new THREE.LineBasicMaterial({ color: a.material.color });
                const points = [a.position.clone(), b.position.clone()];
                const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(lineGeometry, lineMaterial);
                lineGroup.add(line);
              }
            });
          });
        }

        if (controls) controls.update();
        renderer.render(scene, camera);
        renderer.setAnimationLoop(animate); // Use setAnimationLoop for XR compatibility
      };

      const applyRules = () => {
        particles.forEach(a => {
          let fx = 0;
          let fy = 0;
          let fz = 0;
          particles.forEach(b => {
            if (a !== b) {
              const dx = a.position.x - b.position.x;
              const dy = a.position.y - b.position.y;
              const dz = a.position.z - b.position.z;
              const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
              if (d > 0 && d < 5) {
                const keyA = colors.indexOf('#' + a.material.color.getHexString());
                const keyB = colors.indexOf('#' + b.material.color.getHexString());
                const ruleKey = `rule${keyA}${keyB}`;
                const F = (rules[ruleKey] * 1) / d;
                fx += F * dx;
                fy += F * dy;
                fz += F * dz;
              }
            }
          });
          a.velocity.x += fx;
          a.velocity.y += fy;
          a.velocity.z += fz;
        });
      };

      const handleResize = () => {
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      };

      window.addEventListener('resize', handleResize);

      animate();

      return () => {
        renderer.dispose();
        scene.clear();
        window.removeEventListener('resize', handleResize);
        if (useAR) document.body.removeChild(ARButton.createButton(renderer));
      };
    };

    init();

  }, [numAtoms, numAtomTypes, colors, running, rules, ruleType, trailEffect, connectLines, useAR]);

  return <canvas ref={canvasRef} className={`simulation-canvas ${useAR ? 'ar-canvas' : ''}`} />;
};

export default AlgorithmicLife3D;
