import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from '@/contexts/AuthContext';
import AppRoutes from './Routes';

import { ColorManagement, BufferGeometry, Mesh } from 'three';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';
ColorManagement.enabled = true;
BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
Mesh.prototype.raycast = acceleratedRaycast;

const App = () => {  
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <AppRoutes />
      </AuthContextProvider>
    </BrowserRouter>
  );
};

export default App;