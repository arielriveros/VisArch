import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProjectsApiResponse } from '@/api/types';
import { Button, Dialog } from '@mui/material';
import useSession from '@/hooks/useSession';
import Restricted from '@/components/Restricted';
import useFetch from '@/hooks/useFetch';
import ProjectTable from '@/components/ProjectTable';
import ProjectDetails from '@/components/ProjectDetails';
import ProjectFormContainer from './ProjectForm';

export default function Projects() {
  const { user, signedIn } = useSession();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const { data, loading, status } = useFetch<ProjectsApiResponse>(
    user ? `api/users/${user.id}/projects` : '',
    { credentials: 'include' }
  );
  const [projects, setProjects] = useState<ProjectsApiResponse>([]);

  useEffect(() => {
    if (!data || loading) return;
    if (status !== 200) {
      console.error('Failed to fetch projects');
      return;
    }
    setProjects(data);
  }, [data, loading, status]);

  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleOnRowClick = (projectId: string) => navigate(`/projects/${projectId}/tasks`);
  const handleOnDetailsClick = (projectId: string) => {
    setSelectedProject(projectId);
    setShowDetails(true);
  };
  const handleOnEditClick = (projectId: string) => {
    setSelectedProject(projectId);
    setShowForm(true);
  };

  const handleNewProject = () => {
    setSelectedProject(null);
    setShowForm(true);
  };

  if (!signedIn) return <Restricted />;

  return (
    <div className='flex flex-col w-full h-full p-4 justify-center items-center'>
      <p className='text-2xl font-bold mb-4'>{t('projects.title')}</p>
      <div className='mb-4'>
        <Button onClick={()=>handleNewProject()}>{t('projects.form.new-project')}</Button>
      </div>
      {user?.id && projects && (
        projects.length < 1 ? 
          <p className='text-lg'>{t('projects.no-projects-found')}</p> 
          :
          <ProjectTable
            userId={user.id}
            projects={projects}
            onRowClick={handleOnRowClick}
            onDetailsClick={handleOnDetailsClick}
            onEditClick={handleOnEditClick}
          />
      )}
      {showDetails && selectedProject && (
        <Dialog open={showDetails} onClose={() => setShowDetails(false)}>
          <ProjectDetails projectId={selectedProject} />
        </Dialog>
      )}
      {showForm && (
        <Dialog open={showForm} onClose={() => setShowForm(false)}>
          <ProjectFormContainer projectId={selectedProject} onClose={() => setShowForm(false)} />
        </Dialog>
      )}
    </div>
  );
}
