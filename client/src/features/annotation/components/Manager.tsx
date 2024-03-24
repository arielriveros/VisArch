import { useCallback, useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '@/api/config';
import { Archetype, Entity, TaskApiResponse } from '@/api/types';
import { useModel } from '../hooks/useModel';
import { useSocket } from '../hooks/useSocket';
import Center from './Center';
import Sidebar from './Sidebar';
import Viewport from './Viewport';
import Annotations from './Annotations';
import Inspector from './Inspector';
import useAnnotation from '../hooks/useAnnotation';
import Emitter from '../utils/emitter';
import Progress from './Progress';

interface ManagerProps {
  taskId?: string;
}
export default function  Manager(props: ManagerProps) {
  const { taskId } = props;
  const [task, setTask] = useState<TaskApiResponse | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const { annotations, setAnnotations, dispatch } = useAnnotation();
  const { connect, disconnect, registerEvent, unregisterEvent, join, leave } = useSocket();
  const { loadModel, dispose } = useModel();
  const loadmodelRef = useRef(loadModel);
  const disposeRef = useRef(dispose);

  useEffect(() => { loadmodelRef.current = loadModel; }, [loadModel]);
  useEffect(() => { disposeRef.current = dispose; }, [dispose]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/tasks/${taskId}`, { credentials: 'include' })
      .then(response => response.json())
      .then(data => setTask(data))
      .finally(() => {
        if (taskId) setRoomId(taskId);
      });
  }, [taskId]);

  useEffect(() => {
    if (roomId)
      join(roomId);
    return () => {
      if (roomId)
        leave(roomId);
    };
  }, [roomId, join, leave]);
  

  useEffect(() => {
    if (task) {
      loadmodelRef.current(`${API_BASE_URL}/api/files/models/${task.model}`);
      const annotations = task.annotations || [];
      setAnnotations(annotations);
    }
  }, [task, setAnnotations]);

  const onSave = useCallback(() => {
    const updatedTask = { ...task, annotations };
    fetch(`${API_BASE_URL}/api/tasks/${taskId}`, { 
      credentials: 'include',
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(updatedTask)
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
  }, [annotations, taskId, task]);

  useEffect(() => {
    Emitter.on('SAVE', onSave);
    /* TODO: Reconcile with users on websocket */
    return () => Emitter.off('SAVE', onSave);
  }, [onSave]);

  useEffect(() => {
    connect();
    return () => {
      disposeRef.current();
      disconnect();
    };
  }, [taskId, connect, disconnect]);

  // Websocket events
  useEffect(() => {
    const onUserJoined = (user: string) => console.log(`${user} joined`);
    registerEvent('userJoined', onUserJoined);
    const onAddArchetype = (archetype: Archetype) => dispatch({ type: 'ADD_ARCHETYPE', payload: archetype });
    registerEvent('addArchetype', onAddArchetype);
    const onRemoveArchetype = (id: string) => dispatch({ type: 'REMOVE_ARCHETYPE', payload: id });
    registerEvent('removeArchetype', onRemoveArchetype);
    const onUpdateArchetype = (archetype: Archetype) => dispatch({ type: 'UPDATE_ARCHETYPE', payload: archetype });
    registerEvent('updateArchetype', onUpdateArchetype);
    const onAddEntity = (payload: { archetypeId: string, entity: Entity }) => dispatch({ type: 'ADD_ENTITY', payload });
    registerEvent('addEntity', onAddEntity);
    const onRemoveEntity = (payload: { archetypeId: string, entityId: string }) => dispatch({ type: 'REMOVE_ENTITY', payload });
    registerEvent('removeEntity', onRemoveEntity);
    const onUpdateEntity = (payload: { archetypeId: string, entityId: string, entity: Entity }) => dispatch({ type: 'UPDATE_ENTITY', payload });
    registerEvent('updateEntity', onUpdateEntity);
    return () => {
      unregisterEvent('userJoined', onUserJoined);
      unregisterEvent('addArchetype', onAddArchetype);
      unregisterEvent('removeArchetype', onRemoveArchetype);
      unregisterEvent('updateArchetype', onUpdateArchetype);
      unregisterEvent('addEntity', onAddEntity);
      unregisterEvent('removeEntity', onRemoveEntity);
      unregisterEvent('updateEntity', onUpdateEntity);
    };
  }, [registerEvent, unregisterEvent, dispatch]);

  return (
    <section className='flex h-svh w-full pt-8'>
      <Sidebar width='20%'>
        <Annotations />
      </Sidebar>
      <Center>
        <Progress />
        <Viewport />
      </Center>
      <Sidebar width='30%'>
        <Inspector />
      </Sidebar>
    </section>
  );
}
