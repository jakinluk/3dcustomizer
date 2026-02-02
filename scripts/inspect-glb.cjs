const fs = require('fs');
const path = require('path');

// Read GLB file
const glbPath = path.join(__dirname, '../public/models/shirt-zones.glb');
const buffer = fs.readFileSync(glbPath);

// GLB is binary glTF - parse the JSON chunk
const magic = buffer.readUInt32LE(0);
const version = buffer.readUInt32LE(4);
const length = buffer.readUInt32LE(8);

console.log('GLB Header:');
console.log('  Magic:', magic.toString(16), '(should be 46546C67)');
console.log('  Version:', version);
console.log('  Length:', length);

// Read first chunk (JSON)
const chunkLength = buffer.readUInt32LE(12);
const chunkType = buffer.readUInt32LE(16);

if (chunkType === 0x4E4F534A) { // JSON
  const jsonString = buffer.toString('utf8', 20, 20 + chunkLength);
  const gltf = JSON.parse(jsonString);

  console.log('\nGLTF Structure:');
  console.log('  Scenes:', gltf.scenes?.length || 0);
  console.log('  Nodes:', gltf.nodes?.length || 0);
  console.log('  Meshes:', gltf.meshes?.length || 0);

  if (gltf.meshes) {
    console.log('\nMesh Details:');
    gltf.meshes.forEach((mesh, i) => {
      console.log(`  Mesh ${i}:`);
      console.log(`    Name: ${mesh.name || '(unnamed)'}`);
      console.log(`    Primitives: ${mesh.primitives?.length || 0}`);
    });
  }

  if (gltf.nodes) {
    console.log('\nNode Details:');
    gltf.nodes.forEach((node, i) => {
      if (node.mesh !== undefined) {
        console.log(`  Node ${i}: ${node.name || '(unnamed)'} -> Mesh ${node.mesh}`);
      }
    });
  }

  // Full dump for detailed analysis
  console.log('\n=== FULL GLTF JSON ===');
  console.log(JSON.stringify(gltf, null, 2));
}
