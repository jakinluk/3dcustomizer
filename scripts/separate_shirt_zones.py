import bpy
import os

# Clear scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Import the GLB model
input_path = os.path.join(os.getcwd(), 'public/models/shirt.glb')
bpy.ops.import_scene.gltf(filepath=input_path)

# Get the imported mesh
shirt_obj = None
for obj in bpy.context.scene.objects:
    if obj.type == 'MESH':
        shirt_obj = obj
        break

if not shirt_obj:
    print("ERROR: No mesh found in imported model")
    exit(1)

# Select the shirt object
bpy.context.view_layer.objects.active = shirt_obj
shirt_obj.select_set(True)

# Enter edit mode
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='DESELECT')

# Get the mesh data
mesh = shirt_obj.data
bpy.ops.object.mode_set(mode='OBJECT')

# Analyze vertex positions to determine zones
vertices = mesh.vertices
min_x = min(v.co.x for v in vertices)
max_x = max(v.co.x for v in vertices)
min_y = min(v.co.y for v in vertices)
max_y = max(v.co.y for v in vertices)

print(f"Mesh bounds - X: [{min_x:.2f}, {max_x:.2f}], Y: [{min_y:.2f}, {max_y:.2f}]")

# Create 3 copies for each zone
bpy.ops.object.mode_set(mode='OBJECT')

# Duplicate for sleeves
bpy.ops.object.duplicate()
sleeve_obj = bpy.context.active_object
sleeve_obj.name = "sleeves"

# Duplicate for front
shirt_obj.select_set(True)
bpy.context.view_layer.objects.active = shirt_obj
bpy.ops.object.duplicate()
front_obj = bpy.context.active_object
front_obj.name = "front_torso"

# Keep original as back
shirt_obj.select_set(True)
bpy.context.view_layer.objects.active = shirt_obj
shirt_obj.name = "back_torso"
back_obj = shirt_obj

# Now separate each object to only contain its zone
# Define zones based on vertex positions
# Sleeves: extreme left and right (|x| > threshold)
# Front: z > 0
# Back: z <= 0

def separate_by_zone(obj, zone_type):
    """Keep only vertices in the specified zone"""
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='DESELECT')
    bpy.ops.object.mode_set(mode='OBJECT')

    mesh = obj.data

    # Calculate center and thresholds
    center_x = (max_x + min_x) / 2
    center_y = (max_y + min_y) / 2
    x_range = max_x - min_x
    threshold = x_range * 0.3  # 30% from center defines sleeves

    for poly in mesh.polygons:
        # Get polygon center
        poly_center_x = sum(mesh.vertices[v].co.x for v in poly.vertices) / len(poly.vertices)
        poly_center_y = sum(mesh.vertices[v].co.y for v in poly.vertices) / len(poly.vertices)

        # Distance from center on X axis
        x_dist_from_center = abs(poly_center_x - center_x)

        keep = False
        if zone_type == 'sleeves':
            # Keep if far from center on X axis
            keep = x_dist_from_center > threshold
        elif zone_type == 'front':
            # Keep if front (positive Y) and not sleeves
            keep = poly_center_y > center_y and x_dist_from_center <= threshold
        elif zone_type == 'back':
            # Keep if back (negative Y) and not sleeves
            keep = poly_center_y <= center_y and x_dist_from_center <= threshold

        poly.select = not keep  # Select what to DELETE

    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.delete(type='FACE')
    bpy.ops.object.mode_set(mode='OBJECT')

# Separate each object
print("Separating sleeves...")
separate_by_zone(sleeve_obj, 'sleeves')

print("Separating front...")
separate_by_zone(front_obj, 'front')

print("Separating back...")
separate_by_zone(back_obj, 'back')

# Clean up any loose vertices
for obj in [sleeve_obj, front_obj, back_obj]:
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.delete_loose()
    bpy.ops.object.mode_set(mode='OBJECT')

# Select all three objects for export
bpy.ops.object.select_all(action='DESELECT')
sleeve_obj.select_set(True)
front_obj.select_set(True)
back_obj.select_set(True)

# Export as GLB
output_path = os.path.join(os.getcwd(), 'public/models/shirt-zones.glb')
bpy.ops.export_scene.gltf(
    filepath=output_path,
    export_format='GLB',
    use_selection=True,
    export_materials='EXPORT'
)

print(f"Successfully exported to {output_path}")
print(f"Meshes created: sleeves, front_torso, back_torso")
