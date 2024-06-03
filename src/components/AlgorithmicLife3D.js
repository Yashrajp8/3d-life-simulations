import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const AlgorithmicLife3D = ({ numAtoms, numAtomTypes, colors, rules, speed, ruleType, running, viscosity }) => {
  const canvasRef = useRef(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;

    // 3D View initialization
    let renderer, scene, camera, controls;
    const particles = [];

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
    camera.position.set(10, 10, 10); // Zoomed out isometric view
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    const geometry = new THREE.SphereGeometry(0.05, 32, 32); // Smaller atom size
    const materials = colors.map(color => new THREE.MeshBasicMaterial({ color }));
    const atomsPerType = Math.floor(numAtoms / numAtomTypes);

    for (let i = 0; i < numAtomTypes; i++) {
      for (let j = 0; j < atomsPerType; j++) {
        const material = materials[i];
        const particle = new THREE.Mesh(geometry, material);
        particle.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
        particle.velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.1
        );
        particle.acceleration = new THREE.Vector3(0, 0, 0);
        particles.push(particle);
        scene.add(particle);
      }
    }

    const applyRules = (particles1, particles2, ruleKey, sameType) => {
      const rule = rules[ruleKey];
      for (let i = 0; i < particles1.length; i++) {
        let fx = 0;
        let fy = 0;
        let fz = 0;
        for (let j = 0; j < particles2.length; j++) {
          const a = particles1[i];
          const b = particles2[j];
          const dx = a.position.x - b.position.x; // Directional component in x-axis
          const dy = a.position.y - b.position.y; // Directional component in y-axis
          const dz = a.position.z - b.position.z; // Directional component in z-axis
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz); // Distance between atoms
          if (d > 0 && d < 80) { // Apply forces only if atoms are within a certain distance
            const attraction = rule.attraction / d;
            const repulsion = sameType ? 0 : rule.repulsion / (d * d);
            const F = attraction - repulsion; // Net force
            fx += F * dx; // Force component in x-axis
            fy += F * dy; // Force component in y-axis
            fz += F * dz; // Force component in z-axis
          }
        }
        particles1[i].acceleration.set(fx * (1 - viscosity), fy * (1 - viscosity), fz * (1 - viscosity)); // Apply acceleration in 3D
        particles1[i].velocity.add(particles1[i].acceleration).multiplyScalar(0.5); // Update velocity in 3D
      }
    };

    const update = () => {
      if (!running) return;

      for (let i = 0; i < numAtomTypes; i++) {
        for (let j = 0; j < numAtomTypes; j++) {
          const ruleKey = `${colors[i]}-${colors[j]}`;
          const sameType = i === j;
          applyRules(particles.filter(p => p.material.color.getStyle() === colors[i]), particles.filter(p => p.material.color.getStyle() === colors[j]), ruleKey, sameType);
        }
      }

      particles.forEach(p => {
        // Basic movement logic for particles
        p.position.add(p.velocity.clone().multiplyScalar(speed));

        // Boundary conditions
        if (p.position.x < -5 || p.position.x > 5) p.velocity.x *= -1;
        if (p.position.y < -5 || p.position.y > 5) p.velocity.y *= -1;
        if (p.position.z < -5 || p.position.z > 5) p.velocity.z *= -1;
      });

      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(update);
    };

    update();

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
  }, [numAtoms, numAtomTypes, colors, rules, speed, ruleType, running, viscosity]);

  return <canvas ref={canvasRef} className="simulation-canvas" />;
};

export default AlgorithmicLife3D;
