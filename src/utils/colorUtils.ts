import * as THREE from 'three';

export function hexToThreeColor(hex: string): THREE.Color {
  return new THREE.Color(hex);
}

export function applyColorToMesh(mesh: THREE.Mesh, hex: string): void {
  const color = new THREE.Color(hex);

  const applyToMaterial = (mat: THREE.Material): THREE.Material => {
    // CRITICAL: Clone the material so each zone has its own instance!
    // Without this, all zones share the same material and show the same color
    const clonedMat = mat.clone();

    // Handle any material type that has a color property
    if ('color' in clonedMat) {
      (clonedMat as any).color.set(color);
      clonedMat.needsUpdate = true;
    }

    // Remove textures to show pure colors
    if ('map' in clonedMat && (clonedMat as any).map) {
      (clonedMat as any).map = null;
      clonedMat.needsUpdate = true;
    }

    return clonedMat;
  };

  if (Array.isArray(mesh.material)) {
    // Handle multi-material meshes
    const oldMaterials = mesh.material;
    mesh.material = mesh.material.map((mat) => applyToMaterial(mat));
    // CRITICAL: Dispose old materials to prevent memory leak
    oldMaterials.forEach((mat) => mat.dispose());
  } else {
    // Single material
    const oldMaterial = mesh.material;
    mesh.material = applyToMaterial(mesh.material);
    // CRITICAL: Dispose old material to prevent memory leak
    oldMaterial.dispose();
  }
}
