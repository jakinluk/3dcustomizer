import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useCustomizerStore } from '../../store/customizerStore';
import { CAMERA_PRESETS } from '../../constants/presets';

// Easing function for smooth camera transitions
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

interface UseThreeSceneReturn {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
}

export function useThreeScene(containerRef: React.RefObject<HTMLDivElement>): UseThreeSceneReturn | null {
  const [sceneData, setSceneData] = useState<UseThreeSceneReturn | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // OrbitControls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Set scene data ONCE
    setSceneData({ scene, camera, renderer, controls });

    // Animation loop
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Window resize handler
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      controls.dispose();
      renderer.dispose();

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) {
            object.geometry.dispose();
          }
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [containerRef]);

  // Camera transition effect (subscribe to store changes)
  useEffect(() => {
    if (!sceneData) return;

    const { camera, controls } = sceneData;

    const unsubscribe = useCustomizerStore.subscribe((state) => {
      const { cameraPreset, zoomLevel } = state;

      if (cameraPreset !== 'free') {
        const preset = CAMERA_PRESETS[cameraPreset];
        if (!preset) return;

        const targetPosition = new THREE.Vector3(...preset.position).multiplyScalar(zoomLevel);
        const startPosition = camera.position.clone();
        const startTime = performance.now();
        const duration = 500;

        controls.enabled = false;

        const animate = () => {
          const elapsed = performance.now() - startTime;
          const t = Math.min(elapsed / duration, 1);
          const eased = easeOutCubic(t);

          camera.position.lerpVectors(startPosition, targetPosition, eased);
          camera.lookAt(0, 0, 0);

          if (t < 1) {
            requestAnimationFrame(animate);
          } else {
            controls.enabled = true;
            useCustomizerStore.setState({ cameraPreset: 'free' });
          }
        };

        animate();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [sceneData]);

  return sceneData;
}
