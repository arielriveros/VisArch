import { Mesh } from "three";

export function highlightIndices(originalMesh: Mesh, meshToHighlight: Mesh, indices: number[]) {
    let newIndices: number[] = [];
    for (let i = 0; i < indices.length; i++) {
        const index = indices[i] * 3;
        const a = index + 0;
        const b = index + 1;
        const c = index + 2;
        newIndices.push(a, b, c);
    }

    const indexAttr = originalMesh.geometry.clone().index;
    const newIndexAttr = meshToHighlight.geometry.index;
    // update the highlight mesh
    for ( let i = 0, l = newIndices.length; i < l; i ++ ) {
        const ix = indexAttr?.getX( newIndices[i] );
        newIndexAttr?.setX( i, ix as number );
    }

    meshToHighlight.geometry.drawRange.count = newIndices.length;
    if (newIndexAttr)
        newIndexAttr.needsUpdate = true;
}