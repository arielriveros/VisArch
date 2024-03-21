import { useCallback, useContext } from 'react';
import { Archetype } from '@/api/types';
import { AnnotationContext } from '../contexts/AnnotationContext';
import { rgbToHex, uuid } from '../utils/math';
import { useSocket } from './useSocket';

export default function useAnnotation() {
  const context = useContext(AnnotationContext);
  const { emit } = useSocket();

  if (!context)
    throw new Error('useAnnotation must be used within a AnnotationContextProvider');

  const { dispatch, ...state } = context;

  const setAnnotations = useCallback((annotations: Archetype[]) => {
    dispatch({ type: 'SET_ANNOTATIONS', payload: annotations });
  }, [dispatch]);

  const addArchetype = () => {
    const newArchetype = {
      id: uuid(),
      label: 'Archetype',
      archetype: null,
      entities: [],
      color: rgbToHex([Math.random() * 255, Math.random() * 255, Math.random() * 255])
    };
    dispatch({ type: 'ADD_ARCHETYPE', payload: newArchetype});
    emit('addArchetype', newArchetype);
  };

  const removeArchetype = (id: string) => {
    dispatch({ type: 'REMOVE_ARCHETYPE', payload: id });
    emit('removeArchetype', id);
  };

  const selectArchetype = (id: string) => {
    dispatch({ type: 'SELECT_ARCHETYPE', payload: id });
  };

  const updateArchetype = (id: string, label: string, color: string) => {
    const archetype = state.annotations.find(archetype => archetype.id === id);
    if (!archetype) return;
    const updatedArchetype = { ...archetype, label, color };
    dispatch({ type: 'UPDATE_ARCHETYPE', payload: updatedArchetype });
    emit('updateArchetype', updatedArchetype);
  };

  const addEntity = (archetypeId: string, faces: number[]) => {
    const newEntity = { id: uuid(), faces, scale: 1, orientation: 0, reflection: false };
    dispatch({ type: 'ADD_ENTITY', payload: { archetypeId, entity: newEntity } });
    emit('addEntity', { archetypeId, entity: newEntity });
  };

  const removeEntity = (archetypeId: string, entityId: string) => {
    dispatch({ type: 'REMOVE_ENTITY', payload: { archetypeId, entityId } });
    emit('removeEntity', { archetypeId, entityId });
  };

  const selectEntity = (archetypeId: string, entityId: string) => {
    dispatch({ type: 'SELECT_ENTITY', payload: { archetypeId, entityId } });
  };

  const updateEntity = (archetypeId: string, entityId: string, scale: number, orientation: number, reflection: boolean) => {
    const archetype = state.annotations.find(archetype => archetype.id === archetypeId);
    if (!archetype) return;
    const entity = archetype.entities.find(entity => entity.id === entityId);
    if (!entity) return;
    const updatedEntity = { ...entity, scale, orientation, reflection };
    console.log(updatedEntity);
    dispatch({ type: 'UPDATE_ENTITY', payload: { archetypeId, entityId, entity: updatedEntity } });
    emit('updateEntity', { archetypeId, entityId, entity: updatedEntity });
  };

  return {
    ...context, setAnnotations,
    addArchetype, removeArchetype, selectArchetype, updateArchetype,
    addEntity, removeEntity, selectEntity, updateEntity
  };
}
