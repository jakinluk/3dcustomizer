import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useThreeScene } from './useThreeScene';
import { useShirtModel } from './useShirtModel';
import { useTextRenderer } from './TextRenderer';
import { WebGLError, LoadingSpinner } from '../common';
import styles from './ThreeCanvas.module.css';

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

export function ThreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported] = useState(isWebGLAvailable());
  const sceneData = useThreeScene(containerRef);
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Apply colors to model (must be called before conditional return)
  useShirtModel(model);

  // Apply text labels to model (must be called before conditional return)
  useTextRenderer({ scene: sceneData?.scene || new THREE.Scene(), model });

  // Return early if WebGL is not supported
  if (!webglSupported) {
    return <WebGLError />;
  }

  useEffect(() => {
    if (!sceneData) return;

    const { scene } = sceneData;
    setIsLoading(true);
    setError(null);

    let loadedModel: THREE.Group | null = null;

    const loader = new GLTFLoader();
    loader.load(
      '/models/shirt-zones.glb',
      (gltf) => {
        loadedModel = gltf.scene;

        // Center and scale the model
        const box = new THREE.Box3().setFromObject(loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 4 / maxDim;

        loadedModel.position.sub(center.multiplyScalar(scale));
        loadedModel.scale.multiplyScalar(scale);

        scene.add(loadedModel);
        setModel(loadedModel);
        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setError(`Failed to load model: ${errorMessage}`);
        setIsLoading(false);
      }
    );

    return () => {
      if (loadedModel) {
        scene.remove(loadedModel);
        loadedModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      }
    };
  }, [sceneData]);

  return (
    <div className={styles.container}>
      <div ref={containerRef} className={styles.canvas} />
      {isLoading && <LoadingSpinner text="Loading 3D model..." />}
      {error && <WebGLError message={error} />}
    </div>
  );
}
