export interface TextLabel {
  id: string;
  text: string;
  position: 'front' | 'back';
  fontSize: number;
  color: string;
  x: number;  // UV coordinate 0-1
  y: number;  // UV coordinate 0-1
}

export interface CustomizerState {
  // Colors (hex strings)
  sleeveColor: string;
  frontColor: string;
  backColor: string;

  // Text labels
  textLabels: TextLabel[];

  // Camera
  cameraPreset: CameraPreset;
  zoomLevel: number;

  // Actions
  setSleeveColor: (color: string) => void;
  setFrontColor: (color: string) => void;
  setBackColor: (color: string) => void;
  addTextLabel: (label: Omit<TextLabel, 'id'>) => void;
  updateTextLabel: (id: string, updates: Partial<TextLabel>) => void;
  removeTextLabel: (id: string) => void;
  setCameraPreset: (preset: CameraPreset) => void;
  setZoomLevel: (level: number) => void;
  reset: () => void;
}

export type CameraPreset = 'front' | 'back' | 'left' | 'right' | 'free';

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface CameraPosition {
  position: readonly [number, number, number];
  target: readonly [number, number, number];
}
