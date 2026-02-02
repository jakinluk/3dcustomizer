# 3D Shirt Customizer - Project Guide

## Project Overview

A web-based 3D product customizer POC built with React + Three.js, allowing users to customize t-shirt colors by zone (sleeves, front, back) with real-time 3D visualization.

**Goal:** Replicate KitBuilder's 3D customization functionality with zone-based color customization.

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **3D Rendering:** Three.js with React Three Fiber
- **State Management:** Zustand
- **3D Model:** GLB/GLTF format (exported from Poly Pizza, modified in Blender)
- **Testing:** Puppeteer for automated visual testing

## Project Structure

```
├── docs/
│   ├── poc1/
│   │   ├── starting_point.md          # Original requirements
│   │   ├── 3D_MODEL_RESEARCH.md       # Model research and selection
│   │   └── ...
│   └── in-progress/
│       └── color-zones-fix.md         # Current work: zone separation issues
├── public/
│   └── models/
│       ├── shirt.glb                   # Original single-mesh model
|       |....
│       └── shirt-zones.glb            # Separated zones (⚠️ needs fix)
├── scripts/
│   ├── separate_shirt_zones.py        # Blender script for mesh separation
│   ├── quick-screenshot.mjs           # Puppeteer screenshot tool
│   ├── rotate-and-capture.mjs         # Multi-angle screenshots
│   └── test-all-angles.mjs            # View controls testing
├── src/
│   ├── components/
│   │   ├── ThreeCanvas/
│   │   │   ├── ThreeCanvas.tsx        # Main 3D canvas component
│   │   │   ├── useThreeScene.ts       # Scene/camera/renderer setup
│   │   │   └── useShirtModel.ts       # Model loading & color application
│   │   └── CustomizerPanel/
│   │       ├── ColorPicker.tsx        # Zone color selection UI
│   │       └── ViewControls.tsx       # Camera preset buttons
│   ├── store/
│   │   └── customizerStore.ts         # Zustand state management
│   ├── utils/
│   │   └── colorUtils.ts              # 🔑 Material cloning & color application
│   ├── constants/
│   │   └── presets.ts                 # Color swatches, camera positions
│   └── types/
│       └── customizer.ts              # TypeScript type definitions
```

## Critical Architecture Decisions

### 1. Material Cloning (CRITICAL FIX)

**Problem:** Three.js GLB models share material instances across meshes. Modifying `material.color` on one mesh affects ALL meshes using that material.

**Solution:** Clone materials before applying colors (see `src/utils/colorUtils.ts:10-27`)

```typescript
const clonedMat = mat.clone();  // Each zone gets its own material instance
```

**Reference:** `docs/in-progress/color-zones-fix.md` - Complete problem analysis

### 2. Stable Hook Returns

**Problem:** Returning new object references on every render causes infinite re-render loops.

**Solution:** Use `useState` to maintain stable object references (see `src/components/ThreeCanvas/useThreeScene.ts`)

```typescript
const [sceneData, setSceneData] = useState<UseThreeSceneReturn | null>(null);
// Return same object reference until scene actually changes
```

### 3. Zone-Based Mesh Structure

The 3D model must have separate mesh nodes for independent coloring:
- `sleeves` - Left and right sleeves
- `front_torso` - Front of shirt
- `back_torso` - Back of shirt

**Current Status:** ⚠️ Zones exist but boundaries are incorrect (see Known Issues)

## Development Workflow

### Running the Development Server

```bash
npm install
npm run dev
# Opens at http://localhost:5173
```

### Testing with Screenshots

```bash
# Quick current state screenshot
node scripts/quick-screenshot.mjs

# Multi-angle rotation screenshots
node scripts/rotate-and-capture.mjs

# Test view control buttons
node scripts/test-all-angles.mjs
```

**Output:** Screenshots saved to `screenshots/` directory

### Modifying 3D Model Zones

```bash
# Re-separate mesh zones in Blender (macOS)
/Applications/Blender.app/Contents/MacOS/Blender --background --python scripts/separate_shirt_zones.py

# Output: public/models/shirt-zones.glb
```

**Blender Installation:**
- macOS: `/Applications/Blender.app/Contents/MacOS/Blender`
- The script uses Y-axis for front/back separation (positive Y = front, negative Y = back)
- Sleeves use X-axis separation (distance from center)

## Known Issues & Gotchas

### ⚠️ Zone Boundaries - Fix In Progress

**Status:** FIX ATTEMPTED - NEEDS VERIFICATION (as of 2026-02-01)

**Problem:**
- Original: Sleeves ✅, Top ❌, Bottom ❌ (zones separated by vertical axis)
- Required: Sleeves ✅, Front ✅, Back ✅ (zones separated by depth axis)

**Fix Applied:**
Changed Blender separation script from Z-axis to Y-axis for front/back separation:
- Lines 39-40: Now analyzes `min_y/max_y` instead of `min_z/max_z`
- Lines 99-104: Now uses `poly_center_y` for front/back determination
- Regenerated `shirt-zones.glb` on 2026-02-01

**Current Status:**
- Screenshot shows GREEN front dominant ✅
- RED sleeves visible on both sides ✅
- YELLOW back/edges visible ⚠️ (appears correct but needs multi-angle verification)

**Next Steps:**
1. Capture multi-angle screenshots (front, back, left, right views)
2. Verify yellow zone appears on BACK view, not bottom
3. Confirm green zone covers entire FRONT surface
4. If verified, update docs to mark as RESOLVED

**Full Details:** `docs/in-progress/color-zones-fix.md`

### Three.js Material Sharing

Always clone materials when applying colors to prevent cross-contamination between zones. See `src/utils/colorUtils.ts` for correct implementation.

### Model Loading Race Conditions

Ensure model is fully loaded before applying colors. The `useShirtModel` hook handles this with proper dependency management.

## Color Customization Flow

1. **User selects color** → Updates Zustand store (`src/store/customizerStore.ts`)
2. **Store change triggers effect** → `useShirtModel.ts` detects color change
3. **Find zone meshes** → `model.getObjectByName('zone_name')`
4. **Apply color** → `applyColorToMesh()` clones material and sets color
5. **Three.js renders** → Each zone displays independent color

## Test Colors (Current Default)

For visual verification of zone independence:

```typescript
// src/constants/presets.ts
sleeve: '#FF0000',  // BRIGHT RED
front: '#00FF00',   // BRIGHT GREEN
back: '#FFFF00',    // BRIGHT YELLOW
```

These dramatic colors make zone boundaries immediately visible in screenshots.

## Key Files Reference

| File | Purpose | Critical? |
|------|---------|-----------|
| `src/utils/colorUtils.ts` | Material cloning & color application | 🔴 YES |
| `src/components/ThreeCanvas/useShirtModel.ts` | Zone detection & color orchestration | 🔴 YES |
| `src/components/ThreeCanvas/useThreeScene.ts` | Scene setup (must return stable refs) | 🔴 YES |
| `scripts/separate_shirt_zones.py` | Mesh separation (needs fix) | 🟡 BROKEN |
| `public/models/shirt-zones.glb` | 3D model with zones (incorrect zones) | 🟡 BROKEN |
| `docs/in-progress/color-zones-fix.md` | Current problem analysis | 📖 READ THIS |

## AI Assistant Guidelines

### When Working on This Project:

1. **Always read** `docs/in-progress/color-zones-fix.md` for current status
2. **Never modify materials** without cloning first (see `colorUtils.ts`)
3. **Test visually** - use screenshot scripts, don't trust console logs alone
4. **Zone boundaries are wrong** - don't assume front/back work correctly yet
5. **Model orientation matters** - verify axis orientation before modifying separation logic

### Before Making Changes:

- Check if changes affect material handling → Review material cloning pattern
- Check if changes affect hooks → Verify stable object references
- Check if changes affect 3D model → Update and run Blender script
- Check if changes affect zones → Test with dramatic colors and screenshots

### After Making Changes:

```bash
npm run dev                          # Verify build works
node scripts/quick-screenshot.mjs    # Visual verification
```

## Resources

- **Three.js Docs:** https://threejs.org/docs/
- **React Three Fiber:** https://docs.pmnd.rs/react-three-fiber/
- **Poly Pizza (model source):** https://poly.pizza/
- **Blender Python API:** https://docs.blender.org/api/current/

## Version History

- **2026-02-01:** Initial implementation via autopilot, material cloning fix applied
- **Status:** Partial - zones work independently but boundaries are top/bottom instead of front/back

---

**Next Steps:** Fix zone boundaries in Blender separation script (see `docs/in-progress/color-zones-fix.md`)
