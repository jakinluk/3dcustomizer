import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useCustomizerStore } from '../../store/customizerStore';
import { applyColorToMesh } from '../../utils/colorUtils';
import { createTextTexture } from '../../utils/textureUtils';

export function useShirtModel(model: THREE.Group | null) {
  const { sleeveColor, frontColor, backColor, textLabels } = useCustomizerStore();
  const textPlanesRef = useRef<Map<string, THREE.Mesh>>(new Map());

  useEffect(() => {
    if (!model) return;

    console.log('Applying colors to model zones...');

    // Find zone objects by name
    const sleevesObj = model.getObjectByName('sleeves');
    const frontTorsoObj = model.getObjectByName('front_torso');
    const backTorsoObj = model.getObjectByName('back_torso');

    console.log('Found zones:', {
      sleeves: !!sleevesObj,
      front_torso: !!frontTorsoObj,
      back_torso: !!backTorsoObj
    });

    // Apply color to sleeves zone
    if (sleevesObj) {
      sleevesObj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          console.log(`Applying sleeve color (${sleeveColor}) to mesh:`, child.name);
          applyColorToMesh(child, sleeveColor);
        }
      });
    }

    // Apply color to front zone
    if (frontTorsoObj) {
      frontTorsoObj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          console.log(`Applying front color (${frontColor}) to mesh:`, child.name);
          applyColorToMesh(child, frontColor);
        }
      });
    }

    // Apply color to back zone
    if (backTorsoObj) {
      backTorsoObj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          console.log(`Applying back color (${backColor}) to mesh:`, child.name);
          applyColorToMesh(child, backColor);
        }
      });
    }

    // Fallback: if named zones not found, try generic detection
    if (!sleevesObj && !frontTorsoObj && !backTorsoObj) {
      console.warn('Named zones not found, falling back to generic detection');
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          console.log('Found mesh (fallback):', child.name);
          applyColorToMesh(child, frontColor);
        }
      });
    }
  }, [model, sleeveColor, frontColor, backColor]);

  // Text labels effect
  useEffect(() => {
    if (!model) return;

    const currentPlanes = textPlanesRef.current;

    // Remove labels that no longer exist
    currentPlanes.forEach((plane, id) => {
      if (!textLabels.find((label) => label.id === id)) {
        model.remove(plane);
        plane.geometry.dispose();
        if (plane.material instanceof THREE.Material) {
          plane.material.dispose();
        }
        currentPlanes.delete(id);
      }
    });

    // Add or update labels
    textLabels.forEach((label) => {
      let plane = currentPlanes.get(label.id);

      if (!plane) {
        // Create new plane
        const geometry = new THREE.PlaneGeometry(1, 0.25);
        const texture = createTextTexture(label.text, {
          fontSize: label.fontSize,
          color: label.color,
        });
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          alphaTest: 0.5,
          side: THREE.DoubleSide,
        });
        plane = new THREE.Mesh(geometry, material);

        // Position based on front/back
        if (label.position === 'front') {
          plane.position.set(0, 0, 0.3);
          plane.rotation.y = 0;
        } else {
          plane.position.set(0, 0, -0.3);
          plane.rotation.y = Math.PI;
        }

        // Add as child of model (CRITICAL)
        model.add(plane);
        currentPlanes.set(label.id, plane);
      } else {
        // Update existing plane if text changed
        const texture = createTextTexture(label.text, {
          fontSize: label.fontSize,
          color: label.color,
        });
        if (plane.material instanceof THREE.MeshBasicMaterial) {
          plane.material.map?.dispose();
          plane.material.map = texture;
          plane.material.needsUpdate = true;
        }
      }
    });

    // Cleanup on unmount
    return () => {
      currentPlanes.forEach((plane) => {
        model.remove(plane);
        plane.geometry.dispose();
        if (plane.material instanceof THREE.Material) {
          plane.material.dispose();
        }
      });
      currentPlanes.clear();
    };
  }, [model, textLabels]);
}
