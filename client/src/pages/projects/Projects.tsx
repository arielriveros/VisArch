import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ProjectsApiResponse } from '@/api/types';
import useSession from '@/hooks/useSession';
import ProjectList from '@/components/ProjectList';
import Restricted from '@/components/Restricted';
import useFetch from '@/hooks/useFetch';

function ProjectsContainer({userId} : {userId: string}) {
  const { data, loading, status } = useFetch<ProjectsApiResponse>('api/users/' + userId + '/projects', { credentials: 'include'});
  const [projects, setProjects] = useState<ProjectsApiResponse>([]);

  useEffect(() => {
    if (!data || loading) return; 
    if (status !== 200) {
      console.error('Failed to fetch projects');
      return;
    }
    setProjects(data);
  }, [data, loading, status, userId]);

  return (
    userId && projects && <ProjectList userId={userId} projects={projects} />
  );
}

export default function Projects() {
  const { user, signedIn } = useSession();
  const { t } = useTranslation();

  if (!signedIn)
    return <Restricted />;

  return (
    <div className='flex flex-col w-full h-full p-4 justify-center items-center'>
      <p className='text-2xl font-bold mb-4'>
        {t('projects.title')}
      </p>
      {user?.id && <ProjectsContainer userId={user.id} />}
    </div>
  );
}