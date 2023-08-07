import { Mesh, ColorRepresentation, MeshBasicMaterial } from "three";

export function createHighlightMesh(originalMesh: Mesh, color: ColorRepresentation = 0xff9800) {
    const highlightMesh = new Mesh();
    highlightMesh.geometry = originalMesh.geometry.clone();
    highlightMesh.geometry.drawRange.count = 0;
    highlightMesh.material = new MeshBasicMaterial({
        opacity: 0.5,
        color: color,
        depthWrite: false,
        transparent: true,
        
    });
    highlightMesh.renderOrder = 1;
    
    return highlightMesh;
}