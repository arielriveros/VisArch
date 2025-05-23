import { useParams } from 'react-router-dom';
import { ColorManagement, BufferGeometry, Mesh } from 'three';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
import Manager from './components/Manager';
import MeshContextProvider from './contexts/MeshContext';
import ConfigContextProvider from './contexts/ConfigContext';
import AnnotationContextProvider from './contexts/AnnotationContext';
ColorManagement.enabled = true;
BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
Mesh.prototype.raycast = acceleratedRaycast;

export default function AnnotationApp() {
  const { taskId } = useParams<{ taskId: string }>();

  return (
    <main>
      <ConfigContextProvider>
        <MeshContextProvider>
          <AnnotationContextProvider>
            <Manager taskId={taskId} key={taskId}/>
          </AnnotationContextProvider>
        </MeshContextProvider>
      </ConfigContextProvider>
    </main>
  );
}
