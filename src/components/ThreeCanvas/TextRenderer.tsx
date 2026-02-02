import { useEffect } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { useCustomizerStore } from '../../store/customizerStore';

interface TextRendererProps {
  scene: THREE.Scene;
  model: THREE.Group | null;
}

export function useTextRenderer({ scene, model }: TextRendererProps) {
  const textLabels = useCustomizerStore((state) => state.textLabels);

  useEffect(() => {
    if (!model) return;

    const textMeshes: THREE.Mesh[] = [];
    const loader = new FontLoader();

    // Load font and create text meshes
    loader.load(
      'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
      (font) => {
        textLabels.forEach((label) => {
          // Find the zone mesh
          const zoneName = label.position === 'front' ? 'Front' : 'Back';
          let zoneMesh: THREE.Mesh | null = null;

          model.traverse((child) => {
            if (child instanceof THREE.Mesh && child.name === zoneName) {
              zoneMesh = child;
            }
          });

          if (!zoneMesh) return;

          // Create text geometry
          const geometry = new TextGeometry(label.text, {
            font: font,
            size: 0.3,
            depth: 0.02,
            curveSegments: 12,
            bevelEnabled: false,
          });

          geometry.computeBoundingBox();
          const textWidth = geometry.boundingBox
            ? geometry.boundingBox.max.x - geometry.boundingBox.min.x
            : 0;

          // Create material
          const material = new THREE.MeshStandardMaterial({
            color: label.color,
            metalness: 0.1,
            roughness: 0.8,
          });

          const textMesh = new THREE.Mesh(geometry, material);

          // Position the text on the zone surface
          // Get zone center and normal
          zoneMesh.geometry.computeBoundingBox();
          const box = zoneMesh.geometry.boundingBox!;
          const center = new THREE.Vector3();
          box.getCenter(center);

          // Apply zone's world transform
          const worldMatrix = new THREE.Matrix4();
          zoneMesh.updateMatrixWorld(true);
          worldMatrix.copy(zoneMesh.matrixWorld);
          center.applyMatrix4(worldMatrix);

          // Calculate position based on x, y coordinates (0-1 normalized)
          const xOffset = (label.x - 0.5) * 2;
          const yOffset = (label.y - 0.5) * 2;

          // Position text
          textMesh.position.copy(center);
          textMesh.position.x += xOffset - textWidth / 2;
          textMesh.position.y += yOffset;

          // Determine orientation based on zone
          if (label.position === 'front') {
            // Front zone faces +Z
            textMesh.position.z += 0.1;
            textMesh.rotation.y = 0;
          } else {
            // Back zone faces -Z
            textMesh.position.z -= 0.1;
            textMesh.rotation.y = Math.PI;
          }

          scene.add(textMesh);
          textMeshes.push(textMesh);
        });
      }
    );

    // Cleanup
    return () => {
      textMeshes.forEach((mesh) => {
        scene.remove(mesh);
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat) => mat.dispose());
        } else {
          mesh.material.dispose();
        }
      });
    };
  }, [scene, model, textLabels]);
}
