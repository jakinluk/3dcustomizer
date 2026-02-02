# Text Labels Not Appearing on 3D Model

**Date:** 2026-02-01
**Status:** 🔴 NOT WORKING

## Problem Statement

Text labels are not appearing on the 3D shirt model. The UI has a "TEXT LABELS" section with input field, Front/Back position buttons, and "Add Label" button, but no text appears on the 3D model when labels are added.

**User expectation:**
Users should be able to type text, select a position (Front or Back), click "Add Label", and see the text rendered on the corresponding zone of the 3D shirt model.

## Current Behavior

### UI Components Present

From the screenshot and code structure:
- Text input field with placeholder "Enter text..."
- Two position buttons: "Front" (blue/active), "Back" (gray/inactive)
- "Add Label" button (gray, appears disabled)

### What Happens

**Untested behaviors:**
1. User types text into input field → ?
2. User selects Front or Back position → ?
3. User clicks "Add Label" → ?
4. Expected: Text should appear on 3D model → ❌ NOT HAPPENING

## Investigation Required

### 1. Feature Implementation Status

**Check if text label rendering is implemented at all:**
- [ ] Does `src/components/CustomizerPanel/TextLabelEditor.tsx` handle Add Label clicks?
- [ ] Does `src/store/customizerStore.ts` store text labels in state?
- [ ] Is there any 3D text rendering component in `src/components/ThreeCanvas/`?
- [ ] Are there Three.js text rendering dependencies installed? (three/examples/jsm/geometries/TextGeometry)

### 2. State Management

**Zustand store investigation:**
- [ ] Does the store have a `labels` array or similar?
- [ ] Are labels being added to the store when "Add Label" is clicked?
- [ ] Is there a `addLabel(text, position)` action?

**Check in:** `src/store/customizerStore.ts`

### 3. 3D Text Rendering

**Three.js text rendering options:**

**Option A: TextGeometry (3D text mesh)**
```typescript
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
```
- Pros: True 3D text, can follow mesh surface
- Cons: Requires font file, more complex setup

**Option B: CSS3DRenderer (HTML overlay)**
```typescript
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';
```
- Pros: Easy styling with CSS, simpler implementation
- Cons: Doesn't integrate with WebGL scene, separate renderer

**Option C: Canvas Texture (texture with text)**
```typescript
// Draw text to canvas, use as texture on plane
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
ctx.fillText('Text here', x, y);
const texture = new THREE.CanvasTexture(canvas);
```
- Pros: No extra dependencies, good performance
- Cons: Text is flat texture, not true 3D

**Current implementation:** UNKNOWN - needs investigation

### 4. Label Positioning

**How should labels be positioned?**
- On the surface of the mesh (requires raycasting or predefined positions)
- Floating above the mesh at predefined coordinates
- Projected onto the mesh surface

**Zone mapping:**
- Front label → Should appear on `front_torso` mesh (GREEN zone)
- Back label → Should appear on `back_torso` mesh (YELLOW zone)

## Root Cause Hypotheses

### Hypothesis 1: Feature Not Implemented
The UI exists but the 3D text rendering functionality was never implemented.

**Evidence needed:**
- Check if `TextLabelEditor.tsx` has click handlers
- Check if store has label management
- Check if any Three.js text rendering code exists

### Hypothesis 2: Implementation Incomplete
Text rendering code exists but has bugs or is incomplete.

**Evidence needed:**
- Console errors when clicking "Add Label"
- Text added to store but not rendered
- Missing font files or dependencies

### Hypothesis 3: Rendering Issues
Text is being created but not visible (positioning, material, camera issues).

**Evidence needed:**
- Check Three.js scene inspector for text objects
- Check console for Three.js warnings
- Verify text isn't behind camera or outside view frustum

## Technical Requirements

### Dependencies Needed

**For TextGeometry approach:**
```json
{
  "dependencies": {
    "@types/three": "^0.160.0" // Already installed
  }
}
```

**Font file needed:**
- Download from Three.js examples: `helvetiker_regular.typeface.json`
- Place in: `public/fonts/`

### Store Schema

```typescript
interface TextLabel {
  id: string;
  text: string;
  position: 'front' | 'back';
  fontSize?: number;
  color?: string;
  x?: number; // Position on surface
  y?: number;
}

interface CustomizerStore {
  // ... existing state
  labels: TextLabel[];
  addLabel: (text: string, position: 'front' | 'back') => void;
  removeLabel: (id: string) => void;
  updateLabel: (id: string, updates: Partial<TextLabel>) => void;
}
```

### Component Architecture

```
TextLabelEditor.tsx (UI)
  ↓ calls
customizerStore.addLabel()
  ↓ updates
store.labels array
  ↓ triggers
useTextLabels.ts hook (new)
  ↓ creates
Three.js text meshes
  ↓ adds to
scene
```

## Files Involved

| File | Purpose | Status |
|------|---------|--------|
| `src/components/CustomizerPanel/TextLabelEditor.tsx` | UI for text input and label creation | ⚠️ CHECK |
| `src/store/customizerStore.ts` | State management for labels | ⚠️ CHECK |
| `src/components/ThreeCanvas/useTextLabels.ts` | Text rendering hook | ❓ MAY NOT EXIST |
| `src/utils/textUtils.ts` | Text creation utilities | ❓ MAY NOT EXIST |
| `public/fonts/helvetiker_regular.typeface.json` | Font file for TextGeometry | ❓ MAY NOT EXIST |

## Proposed Solution

### Approach: Canvas Texture (Simplest)

**Why:** No extra dependencies, no font files needed, good performance

**Implementation steps:**

1. **Create text rendering utility** (`src/utils/textUtils.ts`):
   ```typescript
   export function createTextTexture(text: string, color: string): THREE.Texture {
     const canvas = document.createElement('canvas');
     const context = canvas.getContext('2d')!;

     canvas.width = 512;
     canvas.height = 256;

     context.fillStyle = color;
     context.font = 'bold 48px Arial';
     context.textAlign = 'center';
     context.textBaseline = 'middle';
     context.fillText(text, 256, 128);

     return new THREE.CanvasTexture(canvas);
   }
   ```

2. **Create label hook** (`src/components/ThreeCanvas/useTextLabels.ts`):
   - Listen to store.labels changes
   - Create sprite or plane mesh for each label
   - Position on front_torso or back_torso based on label.position
   - Add to scene

3. **Update store** (`src/store/customizerStore.ts`):
   - Add `labels: []` to state
   - Add `addLabel`, `removeLabel` actions

4. **Connect UI** (`src/components/CustomizerPanel/TextLabelEditor.tsx`):
   - Handle form submission
   - Call `customizerStore.addLabel(text, selectedPosition)`
   - Clear input after adding

## Expected Result

After implementation:
1. User types "HELLO" in text input
2. User selects "Front" position
3. User clicks "Add Label"
4. White text "HELLO" appears on the green front zone of the shirt
5. User can add multiple labels
6. Labels persist when changing shirt colors

## Testing Plan

1. **Basic functionality:**
   - Add label "TEST" to Front → Should appear on green zone
   - Add label "BACK" to Back → Should appear on yellow zone

2. **Multiple labels:**
   - Add 3 labels to Front → All should be visible
   - Add 2 labels to Back → All should be visible

3. **Color changes:**
   - Add labels, then change shirt colors → Labels should remain visible

4. **Screenshots:**
   - Capture with labels: `node scripts/quick-screenshot.mjs`

## Current Status

**Agent aecf1bf** is investigating this issue.

**Next steps:**
1. Investigate current implementation status
2. Determine which approach to use (Canvas Texture recommended)
3. Implement text rendering
4. Test and verify

## Related Issues

- Material cloning (RESOLVED) - Ensures labels won't disappear with color changes
- Zone boundaries (FIX ATTEMPTED) - Affects where Front/Back labels appear

---

**Last Updated:** 2026-02-01
**Assigned To:** Agent aecf1bf (executor)
