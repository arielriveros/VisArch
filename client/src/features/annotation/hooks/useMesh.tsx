import { useCallback, useContext, useState } from 'react';
import { Material } from 'three';
import { MeshContext } from '../contexts/MeshContext';
import { loadMeshFromUrl } from '../utils/glbLoader';
import Emitter from '../utils/emitter';

export function useMesh() {
  const context = useContext(MeshContext);
  const [loading, setLoading] = useState(false);
  const { dispatch } = context;

  if (!context)
    throw new Error('useMeshContext must be used within a MeshContextProvider');
  
  const loadMesh = useCallback(async (url: string) => {
    setLoading(true);
  
    try {
      const onProgress = (current: number, total: number, text: string) => {
        Emitter.emit('PROGRESS', current, total, text);
      };
      const onLoaded = () => Emitter.emit('READY');
      const mesh = await loadMeshFromUrl(url, onLoaded, onProgress);
      dispatch({ type: 'SET_GEOMETRY', payload: mesh.geometry });
      dispatch({ type: 'SET_MATERIAL', payload: mesh.material as Material });
    }
    catch (error) {
      console.error('Error loading mesh:', error);
    }
    finally {
      setLoading(false);
    }
  }, [dispatch]);

  return { ...context, loadMesh, loading };
}