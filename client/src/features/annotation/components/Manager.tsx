import { useCallback, useEffect, useState } from 'react';
import { API_BASE_URL } from '@/api/config';
import { Archetype, Entity, TaskApiResponse, UserApiResponse } from '@/api/types';
import { useModel } from '../hooks/useModel';
import { useSocket } from '@/features/socket/hooks/useSocket';
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
  const { annotations, setAnnotations, setUsers, dispatch } = useAnnotation();
  const [lockedAnnotations, setLockedAnnotations] = useState(false);
  const { registerEvent, unregisterEvent, join, leave, emit } = useSocket();
  const { loadModel } = useModel();

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
      loadModel(`${API_BASE_URL}/api/files/models/${task.model}`);
      const annotations = task.annotations || [];
      if (!lockedAnnotations)
        setAnnotations(annotations);
      setUsers(task.owner, task.collaborators);
    }
  }, [task, lockedAnnotations, setAnnotations, loadModel, setUsers]);

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


  // Websocket events
  useEffect(() => {
    const onUserJoined = () => {
      emit('setAnnotations', annotations);
    };
    const onUserLeft = (user: UserApiResponse) => console.log(`${user?.name} left`, user);
    const onSetAnnotations = (annotations: Archetype[]) => {
      setLockedAnnotations(true);
      setAnnotations(annotations);
    };

    const onAddArchetype = (archetype: Archetype) => {
      dispatch({ type: 'ADD_ARCHETYPE', payload: archetype });
    };
    const onRemoveArchetype = (id: string) => {
      dispatch({ type: 'REMOVE_ARCHETYPE', payload: id });
    };
    const onUpdateArchetype = (archetype: Archetype) => {
      dispatch({ type: 'UPDATE_ARCHETYPE', payload: archetype });
    };
    
    const onAddEntity = (payload: { archetypeId: string, entity: Entity }) => {
      dispatch({ type: 'ADD_ENTITY', payload });
    };
    const onRemoveEntity = (payload: { archetypeId: string, entityId: string }) => {
      dispatch({ type: 'REMOVE_ENTITY', payload });
    };
    const onUpdateEntity = (payload: { archetypeId: string, entityId: string, entity: Entity }) => {
      dispatch({ type: 'UPDATE_ENTITY', payload });
    };
    const onSetEntityAsArchetype = (payload: { archetypeId: string, entityId: string | null }) => {
      dispatch({ type: 'SET_ENTITY_AS_ARCHETYPE', payload });
    };

    registerEvent('userJoined', onUserJoined);
    registerEvent('userLeft', onUserLeft);
    registerEvent('setAnnotations', onSetAnnotations);
    registerEvent('addArchetype', onAddArchetype);
    registerEvent('removeArchetype', onRemoveArchetype);
    registerEvent('updateArchetype', onUpdateArchetype);
    registerEvent('addEntity', onAddEntity);
    registerEvent('removeEntity', onRemoveEntity);
    registerEvent('updateEntity', onUpdateEntity);
    registerEvent('setEntityAsArchetype', onSetEntityAsArchetype);
    return () => {
      unregisterEvent('userJoined', onUserJoined);
      unregisterEvent('userLeft', onUserLeft);
      unregisterEvent('setAnnotations', onSetAnnotations);
      unregisterEvent('addArchetype', onAddArchetype);
      unregisterEvent('removeArchetype', onRemoveArchetype);
      unregisterEvent('updateArchetype', onUpdateArchetype);
      unregisterEvent('addEntity', onAddEntity);
      unregisterEvent('removeEntity', onRemoveEntity);
      unregisterEvent('updateEntity', onUpdateEntity);
      unregisterEvent('setEntityAsArchetype', onSetEntityAsArchetype);
    };
  }, [registerEvent, unregisterEvent, dispatch, emit, annotations, setLockedAnnotations, setAnnotations]);

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
