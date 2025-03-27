import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from '@/api/config';
import ProjectForm from '@/components/forms/ProjectForm';
import useSession from '@/hooks/useSession';

export default function ProjectFormPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useSession();
  const { t } = useTranslation();

  const [usersList, setUsersList] = useState<{ displayName: string; email: string; id: string }[]>([]);
  const [project, setProject] = useState<{ name: string; description: string; collaborators: { displayName: string; email: string; id: string }[] }>({
    name: '',
    description: '',
    collaborators: []
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/`, { credentials: 'include' });
        const data = await res.json();
        setUsersList(data.map((user: { displayName: string; email: string; _id: string }) => ({
          id: user._id,
          displayName: user.displayName,
          email: user.email
        })));
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    const fetchProject = async () => {
      if (!projectId) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, { credentials: 'include' });
        if (res.ok) {
          const projectData = await res.json();
          setProject({
            name: projectData.name,
            description: projectData.description,
            collaborators: projectData.collaborators.map((collaborator: { displayName: string; email: string; _id: string }) => ({
              id: collaborator._id,
              displayName: collaborator.displayName,
              email: collaborator.email
            }))
          });
        } else {
          throw new Error('Failed to fetch project');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchUsers();
    if (projectId) fetchProject();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const method = projectId ? 'PUT' : 'POST';
    const url = projectId ? `${API_BASE_URL}/api/projects/${projectId}` : `${API_BASE_URL}/api/projects/`;

    try {
      const res = await fetch(url, {
        credentials: 'include',
        method,
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: project.name,
          owner: user.id,
          description: project.description,
          collaborators: project.collaborators.map(collaborator => collaborator.id)
        })
      });

      if (res.ok) {
        const projectData = await res.json();
        navigate(`/projects/${projectData._id}/${projectId ? 'details' : 'tasks'}`, { replace: true });
      } else {
        throw new Error('Failed to save project');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='flex justify-center align-middle w-full'>
      <div className='flex flex-col w-full'>
        {usersList && user && (
          <ProjectForm
            title={t(projectId ? 'projects.form.edit-project' : 'projects.form.new-project')}
            project={project}
            usersList={usersList.filter(u => u.id !== user.id)}
            setProject={setProject}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
