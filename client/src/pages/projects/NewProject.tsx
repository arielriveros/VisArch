import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from '@/api/config';
import ProjectForm from '@/components/forms/ProjectForm';
import useSession from '@/hooks/useSession';

export default function NewProject() {
  const navigate = useNavigate();
  const { user } = useSession();
  const [usersList, setUsersList] = useState<{displayName: string, email: string, id: string}[]>();
  const [project, setProject] = useState<{name: string; description: string, collaborators: {displayName: string, email: string, id: string}[]}>({
    name: '',
    description: '',
    collaborators: []
  });
  const { t } = useTranslation();

  const createProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    try {
      const response = await fetch(API_BASE_URL + '/api/projects/', { 
        credentials: 'include',
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: project.name,
          owner: user.id,
          description: project.description,
          collaborators: project.collaborators.map((collaborator) => collaborator.id)
        })
      });

      if (response.ok) {
        const project = await response.json();
        navigate(`/projects/${project._id}/tasks`, { replace: true });
      }
      else
        throw new Error('Failed to create project');
    } catch (error) {
      console.error('Error: ', error);
    }
  };

  const populateUsersList = async () => {
    const res = await fetch(API_BASE_URL+'/api/users/', { credentials: 'include' });
    const data = await res.json();
    const usersList = data.map((user: {displayName: string, email: string, _id: string}) => {
      return {
        id: user._id,
        displayName: user.displayName,
        email: user.email
      };
    });
    setUsersList(usersList);
  };

  useEffect(() => {
    populateUsersList();
  }, []);

  return (
    <div className='flex justify-center align-middle w-full'>
      <div className='flex flex-col w-full'>
        { usersList && user &&
          <ProjectForm
            title={t('projects.form.new-project')}
            project={project}
            usersList={usersList.filter(u => u.id !== user.id)}
            setProject={setProject}
            handleSubmit={createProject}
          />
        }
      </div>
    </div>
  );
}
