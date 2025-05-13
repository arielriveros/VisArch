import { useState } from 'react';
import { ProjectApiResponse } from '@/api/types';
import useSession from '@/hooks/useSession';
import useFetch from '@/hooks/useFetch';
import {
  Typography
} from '@mui/material';
import ProjectDetails from '@/components/ProjectDetails';

interface ProjectDetailsContainerProps {
  projectId: string;
  onEditClick: (projectId: string) => void;
  onClose: () => void;
  onDeleteSuccess: () => void;
}
export default function ProjectDetailsContainer(props: ProjectDetailsContainerProps) {
  const { user } = useSession();
  const [project, setProject] = useState<ProjectApiResponse>();
  

  const { loading } = useFetch<ProjectApiResponse>({
    url: '/api/projects/' + props.projectId,
    options: {
      method: 'GET',
      credentials: 'include',
    },
    immediate: true,
    onSuccess: (data) => {
      console.log('Project details: ', data);
      setProject(data);
    },
  });

  if (loading) {
    return <Typography variant='h6' align='center'>Loading...</Typography>;
  }

  const { execute } = useFetch({
    url: `/api/projects/${props.projectId}`,
    options: {
      method: 'DELETE',
      credentials: 'include',
    },
    immediate: false,
    onSuccess: () => {
      props.onDeleteSuccess();
      props.onClose();
    },
    onError: () => {
      console.error('Error: ', 'Failed to delete project');
    },
  });

  return (
    project && (
      <ProjectDetails
        project={project}
        user={user}
        onEdit={(id) => props.onEditClick(id)}
        onDelete={execute}
      />
    )
  );
}
