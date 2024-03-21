import { useEffect, useRef } from 'react';

import { Mesh } from 'three';
import { Canvas } from '@react-three/fiber';
import { API_BASE_URL } from '@/api/config';
import { TaskApiResponse } from '@/api/types';
import PreviewModel from '@/features/model-input/components/PreviewModel';
import { loadModelFromUrl } from '@/features/annotation/utils/glbLoader';
import { useNavigate } from 'react-router-dom';
import ConfirmButton from '../ConfirmButton';

interface TaskTableRowProps {
  task: TaskApiResponse;
 }
 
export default function TaskTableRow(props: TaskTableRowProps) {
  const { task } = props;
  const meshRef = useRef<Mesh>(null);
  const navigate = useNavigate();
 
  useEffect(() => {
    loadModelFromUrl(`${API_BASE_URL}/api/files/${task.model}`)
      .then((mesh) => {
        if (meshRef.current) {
          meshRef.current.geometry = mesh.geometry;
          meshRef.current.material = mesh.material;
        }
      });
  }, [task.model]);

  const handleGoToTask = () => {
    navigate(`/task/${task._id}`);
  };

  const handleDeleteTask = () => {
    fetch(`${API_BASE_URL}/api/tasks/${task._id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          navigate(-1);
        } else {
          throw new Error('Failed to delete task');
        }
      })
      .catch((error) => {
        console.error('Error: ', error);
      });
  };
 
  return (
    <tr className='border border-white'>
      <td className='px-4 text-white bg-dark-blue text-center border-r border-white'>
        {task.name}
      </td>
      <td className='px-4 text-white bg-dark-blue text-center border-r border-white'>
        {task.description && task.description !=='' ? task.description : <i>No description</i> }
      </td>
      <td className='px-4 text-white bg-dark-blue text-center border-r border-white'>
        {task.annotations.length}
      </td>
      <td className='px-4 text-white bg-dark-blue text-center border-r border-white'>
        {task.annotations.reduce((acc, curr) => acc + curr.entities.length, 0)}
      </td>
      <td className='text-white border-r border-white items-center justify-center'>
        <Canvas style={{ width: '100px', height: '100px'}} camera={{ position: [0, 0, 2] }}>
          <ambientLight />
          <directionalLight position={[0, 0, 5]} intensity={1} />
          <PreviewModel meshRef={meshRef} />
        </Canvas>
      </td>
      <td className='px-4 text-white bg-dark-blue text-center border-r border-white'>
        <button className='bg-blue rounded-md p-1 mt-3 m-2' onClick={handleGoToTask}>Annotate</button>
        <ConfirmButton label='Delete' onConfirm={() => handleDeleteTask()} />
      </td>
    </tr>
  );
}