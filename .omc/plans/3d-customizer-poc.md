# 3D Shirt Customizer POC - Implementation Plan

**Created:** 2026-02-01
**Source Spec:** `.omc/autopilot/spec.md`
**Status:** Ready for execution

---

## Executive Summary

Build a proof-of-concept 3D shirt customizer with:
- Three.js 3D rendering with orbit controls
- Color customization (sleeves, front, back)
- Text labels on front/back
- Preset camera views with smooth transitions

**Estimated Tasks:** 24 tasks across 4 phases
**Parallelization:** Up to 4 concurrent executors possible in Phases 2-4

---

## Phase 1: Project Setup + Basic 3D Scene

**Goal:** Render a 3D model in the browser with orbit controls
**Parallelization:** Sequential (foundation tasks)

### Task 1.1: Initialize Vite Project
**Files to create:**
- `/Users/jakinluk/workspace/priv/3dcustomizer/package.json`
- `/Users/jakinluk/workspace/priv/3dcustomizer/tsconfig.json`
- `/Users/jakinluk/workspace/priv/3dcustomizer/tsconfig.node.json`
- `/Users/jakinluk/workspace/priv/3dcustomizer/vite.config.ts`
- `/Users/jakinluk/workspace/priv/3dcustomizer/index.html`
- `/Users/jakinluk/workspace/priv/3dcustomizer/.gitignore`

**Command:** `npm create vite@latest . -- --template react-ts` (in empty dir) or manual creation

**Dependencies to install:**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "three": "^0.160.0",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "@types/three": "^0.160.0",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.10",
    "vitest": "^1.1.0"
  }
}
```

**Acceptance Criteria:**
- `npm install` succeeds
- `npm run dev` starts dev server
- TypeScript compiles without errors

**Complexity:** Simple
**Blocks:** All other tasks

---

### Task 1.2: Create Base App Structure
**Depends on:** 1.1

**Files to create:**
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/main.tsx`
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/App.tsx`
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/App.module.css`
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/index.css`
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/vite-env.d.ts`

**Implementation:**
- Basic App component with layout (sidebar + main canvas area)
- CSS reset and base styles
- Fixed canvas container (~960px width as per spec)

**Acceptance Criteria:**
- App renders without errors
- Layout has sidebar (300px) + main area

**Complexity:** Simple
**Blocks:** 1.3, 1.4

---

### Task 1.3: Create TypeScript Interfaces
**Depends on:** 1.1

**Files to create:**
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/types/customizer.ts`

**Implementation:**
```typescript
export interface TextLabel {
  id: string;
  text: string;
  position: 'front' | 'back';
  fontSize: number;
  color: string;
  x: number;
  y: number;
}

export interface CustomizerState {
  sleeveColor: string;
  frontColor: string;
  backColor: string;
  textLabels: TextLabel[];
  cameraPreset: 'front' | 'back' | 'left' | 'right' | 'free';
  zoomLevel: number;
  // Actions defined separately
}

export type CameraPreset = 'front' | 'back' | 'left' | 'right' | 'free';
```

**Acceptance Criteria:**
- No TypeScript errors
- All interfaces match spec data model

**Complexity:** Simple
**Can parallelize with:** 1.2

---

### Task 1.4: Create Constants/Presets
**Depends on:** 1.3

**Files to create:**
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/constants/presets.ts`

**Implementation:**
```typescript
export const COLOR_PRESETS = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#1A1A1A' },
  { name: 'Navy', hex: '#001F3F' },
  { name: 'Red', hex: '#DC3545' },
  { name: 'Royal Blue', hex: '#0066CC' },
  { name: 'Green', hex: '#28A745' },
  { name: 'Yellow', hex: '#FFC107' },
  { name: 'Orange', hex: '#FD7E14' },
];

export const CAMERA_PRESETS = {
  front: { position: [0, 0, 3] as const, target: [0, 0, 0] as const },
  back: { position: [0, 0, -3] as const, target: [0, 0, 0] as const },
  left: { position: [-3, 0, 0] as const, target: [0, 0, 0] as const },
  right: { position: [3, 0, 0] as const, target: [0, 0, 0] as const },
};

export const DEFAULT_COLORS = {
  sleeve: '#FFFFFF',
  front: '#0066CC',
  back: '#0066CC',
};
```

**Acceptance Criteria:**
- 8 color presets defined
- 4 camera presets with positions
- Default colors defined

**Complexity:** Simple
**Can parallelize with:** 1.2

---

### Task 1.5: Acquire 3D Shirt Model
**Depends on:** None (can start immediately)

**Files to create:**
- `/Users/jakinluk/workspace/priv/3dcustomizer/public/models/shirt.glb`

**Strategy:**
1. Search Sketchfab for "t-shirt" or "sports jersey" with CC license
2. Download GLB format
3. Verify mesh structure in Blender or three.js editor
4. If meshes not named correctly, rename in Blender:
   - `sleeves` (or `sleeve_left` + `sleeve_right`)
   - `front_torso` (or `front`)
   - `back_torso` (or `back`)

**Fallback:** Create placeholder geometry in Blender (cylinder + sleeves)

**Recommended Sources:**
- https://sketchfab.com/search?q=t-shirt&type=models&licenses=cc0
- https://sketchfab.com/search?q=jersey&type=models&licenses=cc0
- https://www.turbosquid.com/Search/3D-Models/free/tshirt

**Acceptance Criteria:**
- GLB file loads in three.js
- Model has identifiable meshes for sleeves, front, back
- File size < 5MB

**Complexity:** Medium (external dependency)
**CRITICAL PATH:** Blocks 1.7

**RISK:** Model may need mesh renaming. Document actual mesh names found.

---

### Task 1.6: Create Three.js Scene Hook
**Depends on:** 1.1, 1.2

**Files to create:**
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/components/ThreeCanvas/useThreeScene.ts`

**Implementation:**
```typescript
// Hook that initializes:
// - WebGLRenderer with antialias
// - PerspectiveCamera (FOV 45, aspect from container)
// - Scene with background color
// - OrbitControls with damping
// - AmbientLight + DirectionalLight
// - Animation loop with requestAnimationFrame
// - Resize handler
// - Cleanup on unmount
```

**Key Settings:**
- Renderer: antialias true, alpha false, pixelRatio capped at 2
- Camera: FOV 45, near 0.1, far 1000
- OrbitControls: enableDamping true, dampingFactor 0.05
- Lights: AmbientLight 0.6 intensity, DirectionalLight 0.8 from top-right

**Acceptance Criteria:**
- Hook returns { scene, camera, renderer, controls }
- Cleanup function disposes all resources
- Handles window resize

**Complexity:** Medium
**Blocks:** 1.7

---

### Task 1.7: Create ThreeCanvas Component
**Depends on:** 1.5, 1.6

**Files to create:**
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/components/ThreeCanvas/ThreeCanvas.tsx`
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/components/ThreeCanvas/ThreeCanvas.module.css`
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/components/ThreeCanvas/index.ts`

**Implementation:**
- Container div with ref for Three.js canvas
- Use `useThreeScene` hook
- Load GLB model using GLTFLoader
- Add model to scene
- CSS: fixed aspect ratio container, centered

**Acceptance Criteria:**
- Model visible in canvas
- Orbit controls work (rotate, zoom, pan)
- 60 FPS performance
- No console errors

**Complexity:** Medium
**Blocks:** Phase 2

---

### Task 1.8: Integrate ThreeCanvas into App
**Depends on:** 1.2, 1.7

**Files to modify:**
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/App.tsx`

**Implementation:**
- Import and render ThreeCanvas
- Layout: sidebar placeholder + ThreeCanvas main area
- Add loading state placeholder

**Acceptance Criteria:**
- Model renders in app
- Layout correct (sidebar + canvas)

**Complexity:** Simple

---

## Phase 2: Color Customization

**Goal:** Change colors of sleeves, front, and back independently
**Parallelization:** Tasks 2.1-2.3 can run in parallel after Phase 1

### Task 2.1: Create Zustand Store
**Depends on:** 1.3, 1.4

**Files to create:**
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/store/customizerStore.ts`

**Implementation:**
```typescript
import { create } from 'zustand';
import { DEFAULT_COLORS } from '../constants/presets';

interface CustomizerStore {
  sleeveColor: string;
  frontColor: string;
  backColor: string;
  textLabels: TextLabel[];
  cameraPreset: CameraPreset;
  zoomLevel: number;

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
```

**Acceptance Criteria:**
- Store exports useCustomizerStore hook
- All actions update state correctly
- Reset restores defaults

**Complexity:** Simple
**Can parallelize with:** 2.2, 2.3

---

### Task 2.2: Create Color Utility
**Depends on:** 1.1

**Files to create:**
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/utils/colorUtils.ts`

**Implementation:**
```typescript
import * as THREE from 'three';

export function hexToThreeColor(hex: string): THREE.Color {
  return new THREE.Color(hex);
}

export function applyColorToMesh(mesh: THREE.Mesh, hex: string): void {
  if (mesh.material instanceof THREE.MeshStandardMaterial) {
    mesh.material.color.set(hex);
    mesh.material.needsUpdate = true;
  }
}
```

**Acceptance Criteria:**
- Converts hex to THREE.Color
- Updates mesh material color

**Complexity:** Simple
**Can parallelize with:** 2.1, 2.3

---

### Task 2.3: Create ColorPicker Component
**Depends on:** 1.4, 2.1

**Files to create:**
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/components/CustomizerPanel/ColorPicker.tsx`
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/components/CustomizerPanel/ColorPicker.module.css`

**Implementation:**
- Props: zone ('sleeve' | 'front' | 'back'), label
- Renders 8 color swatches from COLOR_PRESETS
- Click swatch updates store via appropriate action
- Shows current selection with border/checkmark

**Acceptance Criteria:**
- 8 swatches displayed
- Click updates store
- Current selection highlighted

**Complexity:** Simple

---

### Task 2.4: Create CustomizerPanel Component
**Depends on:** 2.3

**Files to create:**
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/components/CustomizerPanel/CustomizerPanel.tsx`
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/components/CustomizerPanel/CustomizerPanel.module.css`
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/components/CustomizerPanel/index.ts`

**Implementation:**
- Sidebar container (300px width, full height)
- Section headers: "Sleeve Color", "Front Color", "Back Color"
- Three ColorPicker instances
- Placeholder for text editor (Phase 3)
- Placeholder for view controls (Phase 4)

**Acceptance Criteria:**
- Three labeled color picker sections
- Clean sidebar layout
- Scrollable if content overflows

**Complexity:** Simple

---

### Task 2.5: Create useShirtModel Hook
**Depends on:** 1.7, 2.1, 2.2

**Files to create:**
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/components/ThreeCanvas/useShirtModel.ts`

**Implementation:**
- Load GLB model
- Extract mesh references by name (sleeves, front_torso, back_torso)
- Subscribe to store color changes
- Apply colors to meshes on change
- Handle mesh name variations (document actual names found)

**Key Logic:**
```typescript
// Find meshes by name patterns
model.traverse((child) => {
  if (child instanceof THREE.Mesh) {
    const name = child.name.toLowerCase();
    if (name.includes('sleeve')) meshRefs.sleeves.push(child);
    if (name.includes('front')) meshRefs.front = child;
    if (name.includes('back')) meshRefs.back = child;
  }
});
```

**Acceptance Criteria:**
- Meshes identified and stored
- Color changes apply instantly (<100ms)
- Works with actual model mesh names

**Complexity:** Medium
**RISK:** Depends on actual mesh names in model from Task 1.5

---

### Task 2.6: Integrate Color Customization
**Depends on:** 2.4, 2.5

**Files to modify:**
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/App.tsx`
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/components/ThreeCanvas/ThreeCanvas.tsx`

**Implementation:**
- Add CustomizerPanel to App
- ThreeCanvas uses useShirtModel for color updates

**Acceptance Criteria:**
- Click color swatch → shirt color changes
- All three zones work independently
- Changes instant and smooth

**Complexity:** Simple

---

## Phase 3: Text Customization

**Goal:** Add text labels to front/back of shirt
**Parallelization:** Tasks 3.1-3.2 can run in parallel

### Task 3.1: Create Texture Utility
**Depends on:** 1.1

**Files to create:**
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/utils/textureUtils.ts`

**Implementation:**
```typescript
export function createTextTexture(
  text: string,
  options: {
    fontSize?: number;
    color?: string;
    backgroundColor?: string;
    width?: number;
    height?: number;
  }
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = options.width || 512;
  canvas.height = options.height || 128;

  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = options.backgroundColor || 'transparent';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = `${options.fontSize || 48}px Arial, sans-serif`;
  ctx.fillStyle = options.color || '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
```

**Acceptance Criteria:**
- Creates readable text texture
- Supports custom font size and color
- Returns valid THREE.CanvasTexture

**Complexity:** Medium
**Can parallelize with:** 3.2

---

### Task 3.2: Create TextLabelEditor Component
**Depends on:** 2.1

**Files to create:**
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/components/CustomizerPanel/TextLabelEditor.tsx`
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/components/CustomizerPanel/TextLabelEditor.module.css`

**Implementation:**
- Text input field
- Front/Back position toggle (radio or buttons)
- "Add Label" button
- List of existing labels with delete buttons
- Max 5 labels (POC limitation)

**State from store:**
- textLabels array
- addTextLabel, removeTextLabel actions

**Acceptance Criteria:**
- Can type text and add label
- Can toggle front/back
- Can delete existing labels
- Shows list of current labels

**Complexity:** Medium
**Can parallelize with:** 3.1

---

### Task 3.3: Create Text Label 3D Rendering
**Depends on:** 3.1, 2.5

**Files to modify:**
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/components/ThreeCanvas/useShirtModel.ts`

**Implementation:**
- Create PlaneGeometry for each text label
- Position planes slightly offset from shirt surface:
  - Front: z = 0.3, facing +Z
  - Back: z = -0.3, facing -Z
- Apply text texture to plane material
- Subscribe to textLabels store changes
- Add/remove planes dynamically

**Position Calculations:**
```typescript
const TEXT_POSITIONS = {
  front: { z: 0.3, rotation: 0 },
  back: { z: -0.3, rotation: Math.PI },
};
```

**Acceptance Criteria:**
- Text appears on shirt
- Front/back placement works
- Multiple labels render correctly
- Labels update when text changes

**Complexity:** Medium

---

### Task 3.4: Integrate Text Editor
**Depends on:** 3.2, 3.3

**Files to modify:**
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/components/CustomizerPanel/CustomizerPanel.tsx`

**Implementation:**
- Add TextLabelEditor section after color pickers
- Section header: "Text Labels"

**Acceptance Criteria:**
- Text editor visible in sidebar
- Full workflow: type → add → see on model
- Delete removes from model

**Complexity:** Simple

---

## Phase 4: Controls and Polish

**Goal:** Professional feel with preset views and UI polish
**Parallelization:** Tasks 4.1-4.4 can run in parallel

### Task 4.1: Create ViewControls Component
**Depends on:** 2.1

**Files to create:**
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/components/CustomizerPanel/ViewControls.tsx`
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/components/CustomizerPanel/ViewControls.module.css`

**Implementation:**
- 4 preset buttons: Front, Back, Left, Right
- Zoom slider (range input)
- Click preset → updates store cameraPreset
- Slider → updates store zoomLevel

**Acceptance Criteria:**
- 4 view buttons displayed
- Zoom slider works (0.5x to 2x range)
- Current view highlighted

**Complexity:** Simple
**Can parallelize with:** 4.2, 4.3, 4.4

---

### Task 4.2: Implement Smooth Camera Transitions
**Depends on:** 1.6, 2.1

**Files to modify:**
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/components/ThreeCanvas/useThreeScene.ts`

**Implementation:**
- Subscribe to cameraPreset and zoomLevel changes
- Animate camera position using lerp over ~500ms
- Use requestAnimationFrame for smooth animation
- Disable OrbitControls during transition

**Animation Logic:**
```typescript
function animateCamera(targetPosition: THREE.Vector3, duration: number) {
  const start = camera.position.clone();
  const startTime = performance.now();

  function animate() {
    const elapsed = performance.now() - startTime;
    const t = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(t);

    camera.position.lerpVectors(start, targetPosition, eased);
    camera.lookAt(0, 0, 0);

    if (t < 1) requestAnimationFrame(animate);
    else controls.enabled = true;
  }

  controls.enabled = false;
  animate();
}
```

**Acceptance Criteria:**
- Camera smoothly animates to preset positions
- Zoom smoothly updates camera distance
- No jarring jumps

**Complexity:** Medium
**Can parallelize with:** 4.1, 4.3, 4.4

---

### Task 4.3: Create Common Button Component
**Depends on:** 1.1

**Files to create:**
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/components/common/Button.tsx`
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/components/common/Button.module.css`
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/components/common/index.ts`

**Implementation:**
- Styled button with variants: primary, secondary, icon
- Props: onClick, children, variant, disabled, active
- Consistent styling across app

**Acceptance Criteria:**
- Reusable button component
- Multiple visual variants
- Hover and active states

**Complexity:** Simple
**Can parallelize with:** 4.1, 4.2, 4.4

---

### Task 4.4: Create Loading Indicator
**Depends on:** 1.1

**Files to create:**
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/components/common/LoadingSpinner.tsx`
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/components/common/LoadingSpinner.module.css`

**Implementation:**
- CSS spinner animation
- Centered overlay
- "Loading 3D model..." text

**Acceptance Criteria:**
- Visible during model load
- Disappears when model ready
- Clean animation

**Complexity:** Simple
**Can parallelize with:** 4.1, 4.2, 4.3

---

### Task 4.5: Add Reset Functionality
**Depends on:** 2.1

**Files to modify:**
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/components/CustomizerPanel/CustomizerPanel.tsx`

**Implementation:**
- Add "Reset All" button at bottom of panel
- Calls store.reset()
- Confirmation optional for POC

**Acceptance Criteria:**
- Reset button visible
- Click restores all defaults
- Model updates to default colors

**Complexity:** Simple

---

### Task 4.6: Add WebGL Error Handling
**Depends on:** 1.6

**Files to create:**
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/components/common/WebGLError.tsx`
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/components/common/WebGLError.module.css`

**Files to modify:**
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/components/ThreeCanvas/ThreeCanvas.tsx`

**Implementation:**
- Check WebGL support on mount
- Display friendly error if not supported
- Suggest trying different browser

**WebGL Detection:**
```typescript
function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}
```

**Acceptance Criteria:**
- Graceful error message if no WebGL
- No crash on unsupported browsers

**Complexity:** Simple

---

### Task 4.7: Integrate View Controls
**Depends on:** 4.1, 4.2

**Files to modify:**
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/components/CustomizerPanel/CustomizerPanel.tsx`

**Implementation:**
- Add ViewControls section to panel
- Section header: "Camera Controls"

**Acceptance Criteria:**
- View buttons work
- Zoom slider works
- Smooth transitions

**Complexity:** Simple

---

### Task 4.8: Final Styling and Polish
**Depends on:** All previous tasks

**Files to modify:**
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/index.css`
- `/Users/jakinluk/workspace/priv/3dcustomizer/src/App.module.css`
- All component CSS files

**Implementation:**
- Consistent color scheme
- Proper spacing and typography
- Hover states and transitions
- Responsive layout for 1000px+ screens
- Professional appearance

**Acceptance Criteria:**
- Looks professional
- Consistent visual language
- No visual bugs

**Complexity:** Medium

---

## Dependency Graph

```
Phase 1 (Sequential Foundation):
1.1 ─┬→ 1.2 ─┬→ 1.6 ─→ 1.7 ─→ 1.8
     │       │
     ├→ 1.3 ─┼→ 1.4
     │       │
1.5 ─────────┴→ 1.7

Phase 2 (Parallel Color Work):
Phase 1 complete
     ├→ 2.1 ─┬→ 2.3 ─→ 2.4 ─┐
     ├→ 2.2 ─┴→ 2.5 ────────┴→ 2.6

Phase 3 (Parallel Text Work):
Phase 2 complete
     ├→ 3.1 ─┬→ 3.3 ─→ 3.4
     ├→ 3.2 ─┘

Phase 4 (Parallel Polish):
Phase 3 complete
     ├→ 4.1 ─┐
     ├→ 4.2 ─┼→ 4.7 ─→ 4.8
     ├→ 4.3 ─┤
     ├→ 4.4 ─┤
     ├→ 4.5 ─┤
     └→ 4.6 ─┘
```

---

## Critical Path

The longest sequential path determines minimum completion time:

```
1.1 → 1.2 → 1.6 → 1.7 → 1.8 → 2.5 → 2.6 → 3.3 → 3.4 → 4.2 → 4.7 → 4.8
```

**Critical Blockers:**
1. **Task 1.5 (3D Model Acquisition)** - External dependency, blocks all rendering
2. **Task 1.6 (Scene Hook)** - Core 3D foundation
3. **Task 2.5 (useShirtModel)** - Color application depends on mesh names

---

## Parallelization Opportunities

### Phase 1 Parallelism:
| Parallel Group | Tasks |
|----------------|-------|
| Group A | 1.2, 1.3, 1.4, 1.5 (after 1.1) |

### Phase 2 Parallelism:
| Parallel Group | Tasks |
|----------------|-------|
| Group A | 2.1, 2.2, 2.3 (independent) |

### Phase 3 Parallelism:
| Parallel Group | Tasks |
|----------------|-------|
| Group A | 3.1, 3.2 (independent) |

### Phase 4 Parallelism:
| Parallel Group | Tasks |
|----------------|-------|
| Group A | 4.1, 4.2, 4.3, 4.4, 4.5, 4.6 (all independent) |

---

## 3D Model Acquisition - Detailed Steps

### Step 1: Search Sketchfab
1. Go to https://sketchfab.com/search?q=t-shirt&type=models
2. Filter by License: "CC0" or "CC BY"
3. Filter by File Format: "glTF"
4. Look for models with clear body/sleeve separation

### Step 2: Evaluate Candidates
Check each model for:
- Separate meshes (not single combined mesh)
- Clean topology
- Reasonable poly count (<50k triangles)
- Proper scale

### Step 3: Download and Verify
1. Download GLB format
2. Open in https://gltf-viewer.donmccurdy.com/ or Blender
3. Check mesh names in hierarchy
4. Document actual mesh names

### Step 4: Mesh Renaming (if needed)
If meshes aren't named correctly:
1. Open in Blender
2. Rename meshes to: `sleeves`, `front_torso`, `back_torso`
3. Export as GLB

### Fallback: Create Placeholder
If no suitable model found:
1. Create in Blender:
   - Cylinder for torso
   - Smaller cylinders for sleeves
   - Separate meshes with correct names
2. Export as GLB
3. Note: This is a temporary placeholder

---

## Testing Strategy

### Phase 1 Verification:
- [ ] `npm run dev` starts without errors
- [ ] Model visible in browser
- [ ] Can rotate with mouse drag
- [ ] Can zoom with scroll wheel
- [ ] 60 FPS in Chrome DevTools Performance tab
- [ ] No console errors

### Phase 2 Verification:
- [ ] Click white swatch → sleeves turn white
- [ ] Click red swatch → front turns red
- [ ] Click navy swatch → back turns navy
- [ ] Color change is instant (<100ms)
- [ ] Can customize all three zones independently

### Phase 3 Verification:
- [ ] Type "TEAM" → add label → appears on shirt
- [ ] Toggle to "Back" → add label → appears on back
- [ ] Can add multiple labels
- [ ] Can delete labels
- [ ] Text is readable at default zoom

### Phase 4 Verification:
- [ ] Click "Front" button → camera animates to front view
- [ ] Click "Back" button → camera animates to back view
- [ ] Zoom slider changes camera distance
- [ ] Reset button restores defaults
- [ ] Loading spinner shows during model load
- [ ] Works in Chrome, Firefox, Safari

### Final Acceptance:
- [ ] All 8 success criteria from spec met
- [ ] 30+ FPS sustained
- [ ] <100ms color change response
- [ ] Professional appearance
- [ ] No TypeScript errors
- [ ] No console warnings

---

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| No suitable free 3D model | HIGH | Create placeholder geometry in Blender |
| Model has combined mesh (no separate zones) | HIGH | Use vertex colors or create placeholder |
| Mesh names don't match expected | MEDIUM | Document actual names, update code to match |
| Text texture quality issues | LOW | Increase canvas resolution, adjust font size |
| Performance issues on older hardware | MEDIUM | Reduce model poly count, optimize render loop |
| OrbitControls conflict with camera transitions | LOW | Disable controls during animation |

---

## Commit Strategy

### Phase 1 Commits:
1. `feat: initialize vite react typescript project`
2. `feat: add base app structure and layout`
3. `feat: add three.js scene with orbit controls`
4. `feat: load and display shirt model`

### Phase 2 Commits:
1. `feat: add zustand store for customization state`
2. `feat: add color picker component`
3. `feat: implement real-time color customization`

### Phase 3 Commits:
1. `feat: add text label editor component`
2. `feat: implement text-to-texture rendering`
3. `feat: display text labels on shirt model`

### Phase 4 Commits:
1. `feat: add camera preset controls`
2. `feat: implement smooth camera transitions`
3. `feat: add loading state and error handling`
4. `chore: final styling and polish`

---

## Success Criteria Checklist

From spec, POC is complete when:

- [ ] User can load the app and see a 3D shirt model
- [ ] User can rotate and zoom the shirt smoothly
- [ ] User can change sleeve, front, and back colors independently
- [ ] User can add text labels to front and back
- [ ] User can use preset view buttons to snap to front/back/sides
- [ ] All interactions are smooth and responsive (30+ FPS)
- [ ] App works on desktop Chrome, Firefox, and Safari
- [ ] Code is clean, typed, and documented

---

## Execution Notes

1. **Start Task 1.5 immediately** - Model acquisition is the biggest unknown
2. **Phase 1 is mostly sequential** - Foundation must be solid
3. **Phases 2-4 have good parallelism** - Can run 3-4 executors
4. **Document mesh names** - Critical for Task 2.5
5. **Test frequently** - Verify each phase before proceeding
