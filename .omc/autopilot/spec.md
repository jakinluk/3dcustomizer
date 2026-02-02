# 3D Shirt Customizer POC - Specification

## Project Overview

Build a proof of concept 3D product customizer mimicking KitBuilder's functionality, focused on the 3D rendering and customization component only.

**Target Product:** Thermoactive shirt for demo
**Core Technology:** Three.js for 3D rendering
**Project Status:** Greenfield (starting from scratch)

---

## Requirements Summary

### Functional Requirements

1. **3D Rendering & Visualization**
   - Display a 3D thermoactive shirt model in browser
   - Real-time 3D rendering using Three.js and WebGL
   - View product from different angles (front, back, sides)
   - Smooth rotation via mouse/touch interaction
   - Fixed canvas container (~960-980px width, per KitBuilder pattern)

2. **Color Customization**
   - Change sleeve colors independently
   - Change front/stomach material color
   - Change back material color
   - Real-time color updates with no page reload
   - Preset color swatches (8+ options)

3. **Text Customization**
   - Add text labels/captions to shirt
   - Position text on front or back
   - Support multiple text labels
   - Readable at default zoom level

4. **Camera Controls**
   - Zoom in/out via scroll wheel or UI controls
   - Orbit controls for 360° rotation (horizontal + vertical)
   - Optional preset view buttons (Front, Back, Left, Right)
   - Smooth camera transitions between views

### Non-Functional Requirements

1. **Performance**
   - Minimum 30 FPS on mid-range hardware
   - Instant color changes (<100ms response)
   - Smooth camera animations
   - Model loads within 3 seconds

2. **Browser Support**
   - Desktop-first approach
   - Chrome, Firefox, Safari (latest versions)
   - WebGL support required
   - Graceful error message if WebGL unavailable

3. **User Experience**
   - Intuitive controls without instructions
   - Responsive UI for ~1000px+ screens
   - Loading indicator during model load
   - Clean, minimal interface

### Implicit Requirements

1. **Model Requirements**
   - 3D model with separate meshes for customizable zones
   - Mesh naming: sleeves, front_torso, back_torso
   - Appropriate UV mapping for material zones
   - GLB/GLTF format for Three.js compatibility

2. **State Management**
   - Track customization state (colors, text, camera position)
   - Optional localStorage persistence (POC scope)
   - Reset capability to restore defaults

3. **Text Rendering**
   - Canvas-to-texture pipeline for text labels
   - Fixed font for POC (Arial or similar)
   - ASCII alphanumeric only (no emoji/special chars)
   - Fixed positions (predefined zones)

### Out of Scope (POC)

- ❌ E-commerce integration (no cart, no checkout)
- ❌ Backend API or server infrastructure
- ❌ Production file generation (SVG, PDF, PNG export)
- ❌ User authentication or accounts
- ❌ Multi-product support (only shirt demo)
- ❌ Advanced text features (fonts, curved text, rotation)
- ❌ Pattern/texture library (solid colors only)
- ❌ Mobile optimization (desktop-first)
- ❌ Cross-session persistence (localStorage only if time permits)

---

## Technical Specification

### Tech Stack

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **Frontend Framework** | React 18 + TypeScript | Type safety, component isolation, familiar ecosystem |
| **Build Tool** | Vite 5 | Fast HMR, excellent Three.js support, native ESM |
| **3D Rendering** | Three.js r160+ | Industry standard, massive ecosystem, direct control |
| **3D Loader** | GLTFLoader | GLB/GLTF is the "JPEG of 3D" - widely supported |
| **Controls** | OrbitControls | Built-in Three.js addon, intuitive rotate/zoom/pan |
| **State Management** | Zustand | Lightweight, minimal boilerplate, React-friendly |
| **Styling** | CSS Modules | Scoped styles, no extra dependencies |
| **Testing** | Vitest | Vite-native, fast (unit tests only for POC) |

### Architecture Overview

```
App Component
├── CustomizerPanel (sidebar)
│   ├── ColorPicker (preset swatches)
│   ├── TextLabelEditor (add/edit text)
│   ├── ViewControls (preset views + zoom)
│   └── Reset button
├── ThreeCanvas (3D viewport)
│   ├── Scene
│   ├── ShirtModel (GLB with separate meshes)
│   ├── Lights (ambient + directional)
│   └── OrbitControls
└── Zustand Store (global state)
    ├── Colors (sleeve, front, back)
    ├── Text labels
    └── Camera preset
```

### File Structure

```
3dcustomizer/
├── docs/                               # Existing documentation
├── public/
│   └── models/
│       └── shirt.glb                   # 3D model (to be acquired)
├── src/
│   ├── components/
│   │   ├── ThreeCanvas/
│   │   │   ├── ThreeCanvas.tsx         # Main 3D viewport
│   │   │   ├── ThreeCanvas.module.css
│   │   │   ├── useThreeScene.ts        # Scene setup hook
│   │   │   └── useShirtModel.ts        # Model loading + materials
│   │   ├── CustomizerPanel/
│   │   │   ├── CustomizerPanel.tsx     # Sidebar controls
│   │   │   ├── CustomizerPanel.module.css
│   │   │   ├── ColorPicker.tsx         # Swatch selector
│   │   │   ├── TextLabelEditor.tsx     # Text input
│   │   │   └── ViewControls.tsx        # Camera presets + zoom
│   │   └── common/
│   │       └── Button.tsx
│   ├── store/
│   │   └── customizerStore.ts          # Zustand store
│   ├── utils/
│   │   ├── textureUtils.ts             # Canvas-to-texture for text
│   │   └── colorUtils.ts               # Hex to Three.js Color
│   ├── types/
│   │   └── customizer.ts               # TypeScript interfaces
│   ├── constants/
│   │   └── presets.ts                  # Color swatches, camera positions
│   ├── App.tsx
│   ├── App.module.css
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Dependencies

**Core Dependencies:**
- `react` ^18.2.0
- `react-dom` ^18.2.0
- `three` ^0.160.0
- `zustand` ^4.4.7

**Dev Dependencies:**
- `@types/react` ^18.2.45
- `@types/react-dom` ^18.2.18
- `@types/three` ^0.160.0
- `@vitejs/plugin-react` ^4.2.1
- `typescript` ^5.3.3
- `vite` ^5.0.10
- `vitest` ^1.1.0

### 3D Model Acquisition Strategy

**Primary Approach:** Search Sketchfab for "t-shirt" or "sports jersey" with Creative Commons license
- Download GLB format
- Verify mesh naming (sleeves, front, back)
- Rename meshes in Blender if needed

**Fallback:** Create simple geometric placeholder in Blender with properly named meshes

**Required Mesh Names:**
- `sleeves` (or `sleeve_left` + `sleeve_right`)
- `front_torso` (or `front`)
- `back_torso` (or `back`)

### Data Model

**Customization State Interface:**

```typescript
interface TextLabel {
  id: string;
  text: string;
  position: 'front' | 'back';
  fontSize: number;
  color: string;
  x: number;  // UV coordinate 0-1
  y: number;  // UV coordinate 0-1
}

interface CustomizerState {
  // Colors (hex strings)
  sleeveColor: string;
  frontColor: string;
  backColor: string;

  // Text labels
  textLabels: TextLabel[];

  // Camera
  cameraPreset: 'front' | 'back' | 'left' | 'right' | 'free';
  zoomLevel: number; // 1.0 = default

  // Actions
  setSleeveColor: (color: string) => void;
  setFrontColor: (color: string) => void;
  setBackColor: (color: string) => void;
  addTextLabel: (label: Omit<TextLabel, 'id'>) => void;
  updateTextLabel: (id: string, updates: Partial<TextLabel>) => void;
  removeTextLabel: (id: string) => void;
  setCameraPreset: (preset: string) => void;
  setZoomLevel: (level: number) => void;
  reset: () => void;
}
```

**Color Presets:**

```typescript
const COLOR_PRESETS = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#1A1A1A' },
  { name: 'Navy', hex: '#001F3F' },
  { name: 'Red', hex: '#DC3545' },
  { name: 'Royal Blue', hex: '#0066CC' },
  { name: 'Green', hex: '#28A745' },
  { name: 'Yellow', hex: '#FFC107' },
  { name: 'Orange', hex: '#FD7E14' },
];
```

**Camera Preset Positions:**

```typescript
const CAMERA_PRESETS = {
  front: { position: [0, 0, 3], target: [0, 0, 0] },
  back: { position: [0, 0, -3], target: [0, 0, 0] },
  left: { position: [-3, 0, 0], target: [0, 0, 0] },
  right: { position: [3, 0, 0], target: [0, 0, 0] },
};
```

---

## Implementation Phases

### Phase 1: Basic Three.js Scene with Shirt Model

**Goal:** Render a 3D model in the browser with orbit controls

**Tasks:**
1. Initialize Vite + React + TypeScript project
2. Install dependencies (three, react, zustand)
3. Create `ThreeCanvas` component with basic scene setup
4. Load GLB model using `GLTFLoader`
5. Add ambient + directional lights
6. Implement `OrbitControls` for rotate/zoom/pan
7. Style canvas to fill viewport with fixed aspect ratio

**Acceptance Criteria:**
- ✓ Model visible and rotatable
- ✓ Zoom works via scroll
- ✓ No console errors
- ✓ Smooth 60 FPS performance

**Files Created:**
- `package.json`, `vite.config.ts`, `tsconfig.json`
- `src/components/ThreeCanvas/ThreeCanvas.tsx`
- `src/components/ThreeCanvas/useThreeScene.ts`
- `src/App.tsx`, `src/main.tsx`

---

### Phase 2: Color Customization

**Goal:** Change colors of sleeves, front, and back independently

**Tasks:**
1. Create Zustand store with color state
2. Build `ColorPicker` component with preset swatches
3. Implement mesh material targeting by name
4. React to state changes and update `MeshStandardMaterial.color`
5. Add 8+ color presets
6. Create `CustomizerPanel` sidebar layout

**Acceptance Criteria:**
- ✓ Click swatch changes corresponding zone instantly
- ✓ Changes visible in real-time (<100ms)
- ✓ At least 8 color options available
- ✓ UI clearly labeled (sleeves, front, back)

**Files Created:**
- `src/store/customizerStore.ts`
- `src/components/CustomizerPanel/ColorPicker.tsx`
- `src/components/CustomizerPanel/CustomizerPanel.tsx`
- `src/constants/presets.ts`
- `src/utils/colorUtils.ts`

---

### Phase 3: Text Customization

**Goal:** Add text labels to front/back of shirt

**Tasks:**
1. Create `TextLabelEditor` component with text input
2. Implement canvas-to-texture utility
3. Create text decal plane positioned on shirt surface
4. Support front/back placement toggle
5. Allow multiple labels with list management
6. Add/remove label functionality

**Acceptance Criteria:**
- ✓ Enter text, see it on shirt immediately
- ✓ Toggle between front/back placement
- ✓ Add/remove multiple labels
- ✓ Text readable at default zoom

**Implementation Note:** Use floating plane slightly offset from shirt surface (simpler than true decal projection for POC)

**Files Created:**
- `src/components/CustomizerPanel/TextLabelEditor.tsx`
- `src/utils/textureUtils.ts`
- `src/components/ThreeCanvas/useShirtModel.ts` (text rendering logic)

---

### Phase 4: Controls and Polish

**Goal:** Professional feel with preset views and UI polish

**Tasks:**
1. Add preset camera position buttons (Front, Back, Left, Right)
2. Implement smooth camera transitions using `THREE.Vector3.lerp`
3. Add zoom slider in addition to scroll
4. Responsive layout for ~1000px+ screens
5. Add reset button to restore defaults
6. Loading indicator while model loads
7. Error handling for WebGL not supported
8. Final styling and visual polish

**Acceptance Criteria:**
- ✓ Preset buttons snap to clean views with smooth animation
- ✓ Zoom slider works alongside scroll
- ✓ Works on desktop Chrome/Firefox/Safari
- ✓ Loading state visible during model load
- ✓ Professional appearance

**Files Created:**
- `src/components/CustomizerPanel/ViewControls.tsx`
- `src/components/common/Button.tsx`
- Loading spinner component
- Final CSS polish

---

## Critical Decisions Made

| Question | Decision | Rationale |
|----------|----------|-----------|
| 3D model source | Sketchfab free model (CC license) | Fast acquisition, realistic appearance |
| Text rendering | Canvas texture on offset plane | Simpler than decal projection, sufficient for POC |
| Color UI | Preset swatches (8 colors) | No color picker library needed, faster UX |
| Material zones | Require separate meshes in model | Clean separation, easy material targeting |
| Persistence | localStorage (optional Phase 4) | Simple, no backend needed |
| Browser support | Desktop-first, modern browsers | Faster POC, WebGL required anyway |
| Orbit controls | OrbitControls + preset views | Best of both (free exploration + quick presets) |
| State management | Zustand | Minimal boilerplate, perfect for small apps |

---

## Success Criteria

**POC is complete when:**

1. ✓ User can load the app and see a 3D shirt model
2. ✓ User can rotate and zoom the shirt smoothly
3. ✓ User can change sleeve, front, and back colors independently
4. ✓ User can add text labels to front and back
5. ✓ User can use preset view buttons to snap to front/back/sides
6. ✓ All interactions are smooth and responsive (30+ FPS)
7. ✓ App works on desktop Chrome, Firefox, and Safari
8. ✓ Code is clean, typed, and documented

**Quality Benchmarks:**
- Performance: 30+ FPS, <100ms color change response
- UX: Usable without instructions by non-technical stakeholder
- Code: TypeScript with no `any`, clear component structure
- Visual: Professional appearance matching KitBuilder quality level

---

## References

- Original Requirements: `/Users/jakinluk/workspace/priv/3dcustomizer/docs/poc1/starting_point.md`
- Competitor Analysis: `/Users/jakinluk/workspace/priv/3dcustomizer/docs/competitors/KitBuilder-technology-research.md`
- Three.js Documentation: https://threejs.org/docs/
- React Three Fiber (reference only, not using): https://docs.pmnd.rs/react-three-fiber/
