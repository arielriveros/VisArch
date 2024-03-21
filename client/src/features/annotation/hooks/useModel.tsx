import { useContext, useState } from 'react';
import { Material } from 'three';
import { ModelContext } from '../contexts/ModelContext';
import { loadModelFromUrl } from '../utils/glbLoader';

export function useModel() {
  const context = useContext(ModelContext);
  const [loading, setLoading] = useState(false);

  if (!context)
    throw new Error('useModelContext must be used within a ModelContextProvider');

  const loadModel = async (url: string) => {
    const { dispatch } = context;
    setLoading(true);
  
    try {
      dispose();
      const model = await loadModelFromUrl(url);
      // TODO: Remove this after fixing the uploaded models
      if (!model.geometry.index)
        model.geometry.computeBoundsTree();
      dispatch({ type: 'SET_GEOMETRY', payload: model.geometry });
      dispatch({ type: 'SET_MATERIAL', payload: model.material as Material });
    }
    catch (error) {
      console.error('Error loading model:', error);
    }
    finally {
      setLoading(false);
    }
  };

  const dispose = () => {
    const { geometry, material, dispatch } = context;
    if (geometry)
      geometry.dispose();
    if (material)
      material.dispose();
    dispatch({ type: 'SET_GEOMETRY', payload: null });
    dispatch({ type: 'SET_MATERIAL', payload: null });
  };

  return { ...context, loadModel, loading, dispose };
}