# 3D T-Shirt Model Research Report

## Executive Summary

After extensive research across multiple 3D model repositories, I've identified several viable options for acquiring a GLB t-shirt model for the customizer POC. However, **no perfect out-of-the-box solution exists** that meets all requirements (GLB format, separate meshes for customizable zones, free license, <5MB, <50k triangles).

## Recommended Approach: DUAL STRATEGY

### Option A: Quick Start with Single-Mesh Model (RECOMMENDED FOR POC)
Use a simple, single-mesh t-shirt model and apply textures to the entire garment as a starting point.

### Option B: Create Custom Model with Separate Meshes (IDEAL FOR PRODUCTION)
Build a simple t-shirt model in Blender with properly separated mesh zones.

---

## Detailed Options Analysis

### 🥇 OPTION 1: Poly Pizza T-Shirt (Low Poly)
**Status**: FREE, CC-BY 3.0 License
**URL**: https://poly.pizza/m/bdOMzzh-fSl

**Specifications:**
- **Format**: OBJ/GLTF available
- **Poly Count**: 2,261 triangles ✅ (well under 50k limit)
- **License**: Creative Commons Attribution (CC BY 3.0) ✅
- **File Size**: Not specified (likely <1MB given poly count)
- **Downloads**: 297 downloads, 2,120 views
- **Creator**: Poly by Google
- **Published**: October 22, 2017

**Pros:**
- Very low poly count (excellent performance)
- Free and properly licensed
- From trusted source (Google Poly archive)
- GLTF format available

**Cons:**
- Mesh structure unknown (likely single mesh)
- May require UV unwrapping verification
- Basic geometry (may lack detail)

**Download Instructions:**
1. Visit https://poly.pizza/m/bdOMzzh-fSl
2. Download in GLTF format
3. Convert to GLB if needed (or use GLTF directly)
4. Place in `public/models/shirt.glb`

---

### 🥈 OPTION 2: Sketchfab Low-Poly T-Shirt by JC4862
**Status**: FREE, CC-BY 4.0 License
**URL**: https://sketchfab.com/3d-models/t-shirt-low-poly-3e4b13a502884acfbd79cee0f9cd8876

**Specifications:**
- **Format**: FBX (GLB export available on Sketchfab)
- **Poly Count**: 61.1k triangles ⚠️ (slightly over 50k limit, but acceptable)
- **Vertices**: 30.4k
- **License**: Creative Commons Attribution (CC BY 4.0) ✅
- **File Size**: Not specified
- **UV Mapping**: ✅ "Meticulously UV unwrapped"
- **Textures**: High-quality texture files included
- **Downloads**: 1,300+
- **Creator**: JC4862 (@jaadui_chirag)
- **Published**: August 1, 2023

**Pros:**
- Professional UV unwrapping
- Includes texture files
- Free download with proper license
- GLB export available directly from Sketchfab
- Good community validation (1.3k downloads)

**Cons:**
- Slightly over 50k triangle target (61.1k)
- Mesh structure unknown (likely single mesh)
- Requires attribution

**Download Instructions:**
1. Visit https://sketchfab.com/3d-models/t-shirt-low-poly-3e4b13a502884acfbd79cee0f9cd8876
2. Click "Download 3D Model" button (requires free account)
3. Select "Autoconverted format (glTF)" from format options
4. Extract and place GLB file in `public/models/shirt.glb`
5. Attribution: "Model by JC4862 (CC BY 4.0)"

---

### 🥉 OPTION 3: Sketchfab Basic T-Shirt by funlab117
**Status**: FREE, CC-BY 4.0 License
**URL**: https://sketchfab.com/3d-models/t-shirt-c1a3e5eb9b5445f4b7d4be82f1127eba

**Specifications:**
- **Format**: GLTF available
- **Poly Count**: 237.9k triangles ❌ (exceeds 50k limit significantly)
- **Vertices**: 121k
- **License**: Creative Commons Attribution (CC BY 4.0) ✅
- **Downloads**: 17,982 (most popular option)
- **Creator**: funlab117

**Pros:**
- Extremely popular (17k+ downloads)
- Free and properly licensed
- GLTF format native

**Cons:**
- Very high poly count (237.9k triangles - not suitable for web)
- File size likely too large
- May cause performance issues

**Recommendation**: Only use if willing to decimate/optimize the mesh

---

### 🔧 OPTION 4: Create Custom Model in Blender
**Status**: FULL CONTROL, CC0 License (your own work)
**Time Investment**: 2-4 hours for basic model

**Tutorial Reference:**
- https://www.creativebloq.com/3d/how-to-make-a-t-shirt-in-blender

**Steps:**
1. **Model Creation** (1-2 hours):
   - Start with cube, scale to torso shape
   - Extrude for shoulders
   - Delete faces for arms and neck openings
   - Create separate objects for:
     - `Torso_Front`
     - `Torso_Back`
     - `Sleeve_Left`
     - `Sleeve_Right`
   - Keep poly count low (<10k triangles)

2. **UV Unwrapping** (30 mins):
   - Unwrap each mesh piece
   - Arrange UVs for efficient texture space

3. **Material Setup** (30 mins):
   - Use Principled BSDF shader (required for GLTF export)
   - Create base color texture
   - Set up material slots for each mesh

4. **Export to GLB** (15 mins):
   - File > Export > glTF 2.0 (.glb/.gltf)
   - Format: glTF Binary (.glb)
   - Enable "Apply Modifiers"
   - Export Selection (all 4 mesh pieces)

**Pros:**
- **Separate meshes for each customizable zone** ✅
- Full control over poly count and optimization
- No licensing concerns (your own work)
- Optimized specifically for this use case
- Can name meshes exactly as needed

**Cons:**
- Requires Blender knowledge
- Time investment
- May need iteration to get right

**Mesh Names (for useShirtModel hook):**
```typescript
// Expected mesh names after export:
- "Torso_Front"
- "Torso_Back"
- "Sleeve_Left"
- "Sleeve_Right"
```

---

### 🤖 OPTION 5: GitHub Three.js Projects
**Status**: VARIES, License varies by project

**Investigated Projects:**
1. **Starklord17/threejs-t-shirt**
   - URL: https://github.com/Starklord17/threejs-t-shirt
   - License: MIT
   - Model included but path/format not clearly documented
   - Would need to clone repo to inspect

2. **Siddu7077/3D-model**
   - URL: https://github.com/Siddu7077/3D-model
   - Mentions `men_suit_short_pant.glb`
   - Focus on suit, not t-shirt
   - Worth inspecting source code

**Recommendation**: Clone these repos to inspect their models, but not primary recommendation

---

## Final Recommendation: THREE-PHASE APPROACH

### Phase 1: POC/MVP (Week 1)
**Use Poly Pizza Model** - Option 1
- Download: https://poly.pizza/m/bdOMzzh-fSl
- Quickest path to working prototype
- Low poly count ensures good performance
- Free CC-BY 3.0 license
- **Limitation**: Single mesh, texture applies to whole shirt

**Implementation Approach:**
```typescript
// For single-mesh model:
const shirtMesh = gltf.scene.children.find(child => child.isMesh);
shirtMesh.material.color.set(selectedColor);
shirtMesh.material.map = textTexture; // Apply texture to entire shirt
```

### Phase 2: Enhanced POC (Week 2-3)
**Use Sketchfab Low-Poly T-Shirt** - Option 2
- Download: https://sketchfab.com/3d-models/t-shirt-low-poly-3e4b13a502884acfbd79cee0f9cd8876
- Better UV mapping
- Includes textures
- Still single mesh but professional quality
- Good balance of quality/performance

### Phase 3: Production-Ready (Week 4+)
**Create Custom Blender Model** - Option 4
- Separate meshes for true zone-based customization
- Optimized specifically for the application
- Full control over mesh names and structure
- Can iterate based on user feedback from POC

---

## Critical Information for Implementation

### Expected Mesh Structure Scenarios

#### Scenario A: Single Mesh (Options 1, 2, 3)
```typescript
// Mesh inspection in useShirtModel:
scene.traverse((child) => {
  if (child.isMesh) {
    console.log('Mesh name:', child.name);
    // Likely names: "mesh_0", "T-Shirt", "Object_0", etc.
  }
});

// Apply color to single mesh:
const shirtMesh = scene.children.find(child => child.isMesh);
shirtMesh.material.color.set(color);
```

#### Scenario B: Separate Meshes (Option 4 - Custom)
```typescript
// Multiple mesh support in useShirtModel:
const meshes = {
  front: scene.getObjectByName('Torso_Front'),
  back: scene.getObjectByName('Torso_Back'),
  sleeveLeft: scene.getObjectByName('Sleeve_Left'),
  sleeveRight: scene.getObjectByName('Sleeve_Right'),
};

// Apply color to specific zone:
meshes.front.material.color.set(frontColor);
meshes.sleeveLeft.material.color.set(sleeveColor);
```

### Model Loading Template
```typescript
// public/models/shirt.glb
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const loader = new GLTFLoader();
loader.load('/models/shirt.glb', (gltf) => {
  console.log('Model loaded');
  console.log('Children:', gltf.scene.children);

  // Inspect mesh structure:
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      console.log('Mesh:', child.name, 'Triangles:', child.geometry.index.count / 3);
    }
  });
});
```

---

## Download and Setup Instructions

### For Option 1 (Poly Pizza) - RECOMMENDED FIRST STEP:

1. **Download Model:**
   ```bash
   # Visit https://poly.pizza/m/bdOMzzh-fSl
   # Click download button
   # Select GLTF format
   ```

2. **Place Model:**
   ```bash
   cd /Users/jakinluk/workspace/priv/3dcustomizer
   mkdir -p public/models
   # Move downloaded file to public/models/shirt.glb
   ```

3. **Verify Model:**
   ```bash
   # Check file size
   ls -lh public/models/shirt.glb

   # Optionally use online viewer to inspect:
   # https://gltf-viewer.donmccurdy.com/
   ```

4. **Document Mesh Names:**
   - Load in Three.js and log all mesh names
   - Update this document with actual mesh structure
   - Adjust `useShirtModel` hook accordingly

---

## Alternative Resources (If Primary Options Fail)

### Fallback Sources:
1. **RigModels**: https://rigmodels.com/index.php?searchkeyword=t-shirt
   - Free models in GLB format
   - Multiple options available

2. **TurboSquid Free**: https://www.turbosquid.com/Search/3D-Models/free/t-shirt
   - 100+ free t-shirt models
   - Check license on each model

3. **CGTrader Free**: https://www.cgtrader.com/3d-models/tshirt
   - Large selection of free models
   - Filter by "Free" and "GLB" format

### Last Resort: Placeholder Geometry
If no suitable model found, create simple programmatic geometry:
```typescript
import * as THREE from 'three';

// Create basic t-shirt shape from boxes:
const torso = new THREE.BoxGeometry(1, 1.2, 0.3);
const sleeves = new THREE.CylinderGeometry(0.15, 0.15, 0.6);
// Position and combine meshes
```

---

## Attribution Requirements

### If Using CC-BY Licensed Models:
**Poly Pizza (Option 1):**
```html
<!-- In app footer or about section -->
<p>3D T-Shirt Model by Poly by Google (CC BY 3.0)</p>
```

**Sketchfab Models (Options 2, 3):**
```html
<p>3D T-Shirt Model by [Creator Name] via Sketchfab (CC BY 4.0)</p>
<p>https://sketchfab.com/3d-models/[model-id]</p>
```

---

## Next Steps

1. ✅ **IMMEDIATE**: Download Poly Pizza model (Option 1) to unblock POC development
2. ✅ **TODAY**: Inspect downloaded model's mesh structure and document findings
3. ⏳ **WEEK 1**: Implement color customization with single-mesh approach
4. ⏳ **WEEK 2**: Evaluate if Sketchfab model (Option 2) offers advantages
5. ⏳ **WEEK 3-4**: Begin custom Blender model for zone-based customization

---

## Research Sources

- [T-Shirt by funlab117 - Sketchfab](https://sketchfab.com/3d-models/t-shirt-c1a3e5eb9b5445f4b7d4be82f1127eba)
- [Oversized t-shirt - Sketchfab](https://sketchfab.com/3d-models/oversized-t-shirt-3b6e78d6a1a74370a6e5af6f312d38f7)
- [Sport Jersey - Sketchfab](https://sketchfab.com/3d-models/sport-jersey-7d392a529b474b3eb515aa3072d78127)
- [Long Sleeve T-Shirt - Sketchfab](https://sketchfab.com/3d-models/long-sleeve-t-shirt-ef22cf345c174b569fdfa6a653a6bf6f)
- [T-Shirt Low Poly by JC4862 - Sketchfab](https://sketchfab.com/3d-models/t-shirt-low-poly-3e4b13a502884acfbd79cee0f9cd8876)
- [Poly Pizza Free 3D Models](https://poly.pizza/)
- [T-shirt Model - Poly Pizza](https://poly.pizza/m/bdOMzzh-fSl)
- [Starklord17/threejs-t-shirt - GitHub](https://github.com/Starklord17/threejs-t-shirt)
- [3D Tshirt Configurator With Three.js and Fabric.js - DEV Community](https://dev.to/apcliff/3d-tshirt-configurator-with-threejs-and-fabricjs-31j9)
- [How to make a T-shirt in Blender - Creative Bloq](https://www.creativebloq.com/3d/how-to-make-a-t-shirt-in-blender)
- [Exporting GLB files from Blender - MyARStudio](https://www.myarstudio.cloud/learn/documentation/blender/exporting-glb-files-from-blender/)
- [Blender GLB format guide - Alpha3D](https://www.alpha3d.io/kb/3d-modelling/blender-glb/)
- [glTF Sample Models - Khronos Group](https://github.com/KhronosGroup/glTF-Sample-Models)
- [Siddu7077/3D-model - GitHub](https://github.com/Siddu7077/3D-model)
- [TurboSquid Free T-Shirt Models](https://www.turbosquid.com/Search/3D-Models/free/t-shirt)
- [CGTrader T-Shirt Models](https://www.cgtrader.com/3d-models/tshirt)
- [RigModels T-Shirt Collection](https://rigmodels.com/index.php?searchkeyword=t-shirt)

---

## Document History
- **Created**: 2026-02-01
- **Author**: Research Agent
- **Purpose**: 3D Customizer POC - Model Acquisition Research
- **Status**: Complete - Ready for Model Download
