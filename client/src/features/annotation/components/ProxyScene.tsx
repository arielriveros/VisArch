import { useState, useEffect, useRef } from 'react';
import { BufferGeometry, Group, Mesh, NormalBufferAttributes }  from 'three';
import { useModel } from '../hooks/useModel';
import { AVERAGE, MeshBVHHelper } from 'three-mesh-bvh';
import { unwrap } from '../utils/math';
import HighlightGroup from './HighlightGroup';
import HoverIndex from './HoverIndex';
import useConfig from '../hooks/useConfig';

const DEBUG_BVH = false;

export default function ProxyScene() {
  const { geometry, material, loading } = useModel();
  const { unwrapping } = useConfig();
  const [proxyGeometry, setProxyGeometry] = useState<BufferGeometry<NormalBufferAttributes> | null>(null);
  const debugGroupRef = useRef<Group>(new Group());

  useEffect(() => {
    if (!geometry || loading) return;

    const _geometry = unwrap(geometry, unwrapping);
    
    // Set the index of the proxy geometry to the index of the original geometry
    if (geometry?.getIndex())
      _geometry.setIndex(geometry.getIndex());

    // Generate a bvh for the proxy geometry
    _geometry.computeBoundsTree({
      strategy: AVERAGE,
      verbose: true
    });
    _geometry.computeVertexNormals();

    setProxyGeometry(_geometry);

  }, [loading, geometry, unwrapping]);

  useEffect(() => {
    // Add a BVH helper to the debug group
    if (proxyGeometry && DEBUG_BVH) {
      const debugGeometry = proxyGeometry.clone();
      debugGeometry.computeBoundsTree();
      const mesh = new Mesh(debugGeometry);
      // Add a BVH helper to the debug group
      const debugBVH = debugGroupRef.current.getObjectByName('bvh');
      if (debugBVH) debugGroupRef.current.remove(debugBVH);
      const helper = new MeshBVHHelper(mesh, 12);
      helper.name = 'bvh';
      debugGroupRef.current.add(helper);
    }

    // Dispose of the proxy geometry when the component is unmounted
    return () => proxyGeometry?.dispose();
  }, [proxyGeometry]);

  return (
    <group>
      { proxyGeometry && material && <mesh name='proxy' geometry={proxyGeometry} material={material.clone()}/>}
      { proxyGeometry && <HighlightGroup geometry={proxyGeometry.clone()} /> }
      <HoverIndex rate={0.1}/>
      <group ref={debugGroupRef} name='debug_group' />
    </group>
  );
}