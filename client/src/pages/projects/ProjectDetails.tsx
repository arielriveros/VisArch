import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProjectApiResponse } from '@/api/types';
import { API_BASE_URL } from '@/api/config';
import useSession from '@/hooks/useSession';
import ConfirmButton from '@/components/buttons/ConfirmButton';
import useFetch from '@/hooks/useFetch';
import Button from '@/components/buttons/Button';

export default function ProjectDetails() {
  const { projectId } = useParams();
  const { user } = useSession();
  const { loading, data } = useFetch<ProjectApiResponse>('api/projects/'+projectId, { credentials: 'include' });
  const [project, setProject] = useState<ProjectApiResponse>();
  const navigate = useNavigate();

  useEffect(() => {
    if (data && !loading)
      setProject(data);
  }, [loading, data]);

  if (loading) { return <div>Loading...</div>; }

  const handleDeleteProject = async () => {
    try {
      const response = await fetch(API_BASE_URL+'/api/projects/' + projectId, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        navigate(-1);
      } else {
        console.error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  return (
    project && 
    <section className='flex flex-col w-full justify-center items-center'>
      <div className='flex flex-col w-1/3 m-2 p-4 justify-center items-center bg-dark-blue rounded-sm'>
        <span className='flex flex-col w-full mb-4 justify-evenly'>
          <span className='text-2xl font-bold mb-4'>{project.name}</span>
          <span><b>Owner:</b> {project.owner.displayName} ({user?.id === project.owner._id ? 'You' : project.owner.email})</span>
          <span>
            <span><b>Collaborators:</b></span>
            <ul className='list-disc list-inside'>
              {project.collaborators.map((collaborator) => (
                <li key={collaborator._id}>{collaborator.displayName} ({collaborator._id === project.owner._id ? 'Owner' : collaborator.email})</li>
              ))}
            </ul>
          </span>
          <span><b>Description:</b> {project.description !== '' ? project.description : <i> No Description </i>}</span>
          { user?.id === project.owner._id && <>
            <section className='flex flex-row justify-evenly mt-4'>
              <Button onClick={() => navigate(`/projects/${projectId}/edit`)}>Edit project</Button>
              <ConfirmButton label='Delete project' onConfirm={handleDeleteProject} />
            </section>
          </>
          }
        </span>
      </div>
    </section>
  );
}
