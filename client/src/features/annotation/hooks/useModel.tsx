import { useCallback, useContext, useState } from 'react';
import { Material } from 'three';
import { ModelContext } from '../contexts/ModelContext';
import { loadModelFromUrl } from '../utils/glbLoader';
import Emitter from '../utils/emitter';

export function useModel() {
  const context = useContext(ModelContext);
  const [loading, setLoading] = useState(false);
  const { dispatch } = context;

  if (!context)
    throw new Error('useModelContext must be used within a ModelContextProvider');
  
  const loadModel = useCallback(async (url: string) => {
    setLoading(true);
  
    try {
      const onProgress = (current: number, total: number, text: string) => {
        Emitter.emit('PROGRESS', current, total, text);
      };
      const onLoaded = () => Emitter.emit('READY');
      const model = await loadModelFromUrl(url, onLoaded, onProgress);
      dispatch({ type: 'SET_GEOMETRY', payload: model.geometry });
      dispatch({ type: 'SET_MATERIAL', payload: model.material as Material });
    }
    catch (error) {
      console.error('Error loading model:', error);
    }
    finally {
      setLoading(false);
    }
  }, [dispatch]);

  return { ...context, loadModel, loading };
}