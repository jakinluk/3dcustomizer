import { ColorSwatch, CameraPosition } from '../types/customizer';

export const COLOR_PRESETS: ColorSwatch[] = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#1A1A1A' },
  { name: 'Navy', hex: '#001F3F' },
  { name: 'Red', hex: '#DC3545' },
  { name: 'Royal Blue', hex: '#0066CC' },
  { name: 'Green', hex: '#28A745' },
  { name: 'Yellow', hex: '#FFC107' },
  { name: 'Orange', hex: '#FD7E14' },
];

export const CAMERA_PRESETS: Record<string, CameraPosition> = {
  front: { position: [0, 0, 3] as const, target: [0, 0, 0] as const },
  back: { position: [0, 0, -3] as const, target: [0, 0, 0] as const },
  left: { position: [-3, 0, 0] as const, target: [0, 0, 0] as const },
  right: { position: [3, 0, 0] as const, target: [0, 0, 0] as const },
};

export const DEFAULT_COLORS = {
  sleeve: '#FF0000',  // BRIGHT RED - proof sleeves work
  front: '#00FF00',   // BRIGHT GREEN - proof front works
  back: '#FFFF00',    // BRIGHT YELLOW - proof back works
};
