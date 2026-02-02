import * as THREE from 'three';

export interface TextTextureOptions {
  fontSize?: number;
  color?: string;
  backgroundColor?: string;
  width?: number;
  height?: number;
}

export function createTextTexture(
  text: string,
  options: TextTextureOptions = {}
): THREE.CanvasTexture {
  const {
    fontSize = 48,
    color = '#000000',
    backgroundColor = 'transparent',
    width = 512,
    height = 128,
  } = options;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context');
  }

  // Fill background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // Draw text
  ctx.font = `${fontSize}px Arial, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  // Create texture
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  return texture;
}
