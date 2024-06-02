import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const AlgorithmicLife3D = ({ numAtoms, numAtomTypes, colors, rules, speed, ruleType, running }) => {
  const canvasRef = useRef(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;

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
      particle.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1
      );
      particles.push(particle);
      scene.add(particle);
    }

    const rule = (particles1, particles2, g) => {
      for (let i = 0; i < particles1.length; i++) {
        let fx = 0;
        let fy = 0;
        let fz = 0;
        for (let j = 0; j < particles2.length; j++) {
          const a = particles1[i];
          const b = particles2[j];
          const dx = a.position.x - b.position.x;
          const dy = a.position.y - b.position.y;
          const dz = a.position.z - b.position.z;
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (d > 0 && d < 80) {
            const F = (g * 1) / d;
            fx += F * dx;
            fy += F * dy;
            fz += F * dz;
          }
        }
        particles1[i].velocity.x = (particles1[i].velocity.x + fx) * 0.5;
        particles1[i].velocity.y = (particles1[i].velocity.y + fy) * 0.5;
        particles1[i].velocity.z = (particles1[i].velocity.z + fz) * 0.5;
      }
    };

    const animate = () => {
      if (!running) return;

      if (ruleType === 'basic') {
        rule(particles, particles, rules.yellowYellow);
        rule(particles, particles, rules.yellowRed);
        rule(particles, particles, rules.yellowGreen);
        rule(particles, particles, rules.redRed);
        rule(particles, particles, rules.redGreen);
        rule(particles, particles, rules.greenGreen);
      } else {
        // Complex rules can include different interaction mechanisms and additional agents
        rule(particles, particles, rules.yellowYellow);
        rule(particles, particles, rules.yellowRed);
        rule(particles, particles, rules.yellowGreen);
        rule(particles, particles, rules.redRed);
        rule(particles, particles, rules.redGreen);
        rule(particles, particles, rules.greenGreen);
      }

      particles.forEach(p => {
        // Basic movement logic for particles
        p.position.x += p.velocity.x * speed;
        p.position.y += p.velocity.y * speed;
        p.position.z += p.velocity.z * speed;

        // Boundary conditions
        if (p.position.x < -5 || p.position.x > 5) p.velocity.x *= -1;
        if (p.position.y < -5 || p.position.y > 5) p.velocity.y *= -1;
        if (p.position.z < -5 || p.position.z > 5) p.velocity.z *= -1;
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
  }, [numAtoms, numAtomTypes, colors, rules, speed, ruleType, running]);

  return <canvas ref={canvasRef} className="simulation-canvas" />;
};

export default AlgorithmicLife3D;
