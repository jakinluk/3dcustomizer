import { create } from 'zustand';
import { CustomizerState, TextLabel, CameraPreset } from '../types/customizer';
import { DEFAULT_COLORS } from '../constants/presets';

export const useCustomizerStore = create<CustomizerState>((set) => ({
  // State
  sleeveColor: DEFAULT_COLORS.sleeve,
  frontColor: DEFAULT_COLORS.front,
  backColor: DEFAULT_COLORS.back,
  textLabels: [],
  cameraPreset: 'free',
  zoomLevel: 1.0,

  // Actions
  setSleeveColor: (color: string) => set({ sleeveColor: color }),
  setFrontColor: (color: string) => set({ frontColor: color }),
  setBackColor: (color: string) => set({ backColor: color }),

  addTextLabel: (label: Omit<TextLabel, 'id'>) =>
    set((state) => ({
      textLabels: [
        ...state.textLabels,
        { ...label, id: `label-${Date.now()}-${Math.random()}` },
      ],
    })),

  updateTextLabel: (id: string, updates: Partial<TextLabel>) =>
    set((state) => ({
      textLabels: state.textLabels.map((label) =>
        label.id === id ? { ...label, ...updates } : label
      ),
    })),

  removeTextLabel: (id: string) =>
    set((state) => ({
      textLabels: state.textLabels.filter((label) => label.id !== id),
    })),

  setCameraPreset: (preset: CameraPreset) => set({ cameraPreset: preset }),
  setZoomLevel: (level: number) => set({ zoomLevel: level }),

  reset: () =>
    set({
      sleeveColor: DEFAULT_COLORS.sleeve,
      frontColor: DEFAULT_COLORS.front,
      backColor: DEFAULT_COLORS.back,
      textLabels: [],
      cameraPreset: 'free',
      zoomLevel: 1.0,
    }),
}));
