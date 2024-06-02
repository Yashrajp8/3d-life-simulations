import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const AlgorithmicLife3D = ({ numAtoms, numAtomTypes, colors, running }) => {
  const canvasRef = useRef(null);

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
  }, [numAtoms, numAtomTypes, colors, running]);

  return <canvas ref={canvasRef} className="simulation-canvas" />;
};

export default AlgorithmicLife3D;
