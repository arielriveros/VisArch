import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProjectForm from '@/components/forms/ProjectForm';
import useSession from '@/hooks/useSession';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface ProjectFormContainerProps {
  projectId: string | null;
  onClose: () => void;
  onSaveSuccess: () => void;
}
export default function ProjectFormContainer(props: ProjectFormContainerProps) {
  const { user } = useSession();
  const { t } = useTranslation();
  const [usersList, setUsersList] = useState<{ displayName: string; email: string; id: string }[]>([]);
  const [project, setProject] = useState<{ name: string; description: string; collaborators: { displayName: string; email: string; id: string }[] }>({
    name: '',
    description: '',
    collaborators: []
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const handleCloseSnackbar = () => setSnackbar({ open: false, message: '' });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users/', { credentials: 'include' });
        const data = await res.json();
        setUsersList(data.map((user: { displayName: string; email: string; _id: string }) => ({
          id: user._id,
          displayName: user.displayName,
          email: user.email
        })));
      } catch (error) {
        console.error('Failed to fetch users:', error);
        if (error instanceof Error) {
          console.log(error.message);
          setSnackbar({ open: true, message: error.message });
        }
      }
    };

    const fetchProject = async () => {
      if (!props.projectId) return;
      try {
        const res = await fetch(`/api/projects/${props.projectId}`, { credentials: 'include' });
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
        setSnackbar({ open: true, message: 'Failed to fetch project' });
      }
    };

    fetchUsers();
    if (props.projectId) fetchProject();
  }, [props.projectId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const method = props.projectId ? 'PUT' : 'POST';
    const url = props.projectId ? `/api/projects/${props.projectId}` : '/api/projects/';

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
        props.onSaveSuccess();
        props.onClose();
      }
      else {
        const error = await res.json();
        throw new Error(error.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        const errorName = error.message.toString();
        console.error('Error:', errorName);
        // TODO: Add translations for error messages
        setSnackbar({ open: true, message: t(errorName) });
      } else {
        console.error('Error:', error);
        setSnackbar({ open: true, message: 'An unknown error occurred' });
      }
    }
  };

  return (
    <div className='flex justify-center align-middle w-full'>
      <div className='flex flex-col w-full'>
        {usersList && user && (
          <ProjectForm
            title={t(props.projectId ? 'projects.form.edit-project' : 'projects.form.new-project')}
            project={project}
            usersList={usersList.filter(u => u.id !== user.id)}
            setProject={setProject}
            handleSubmit={handleSubmit}
            onCancel={props.onClose}
          />
        )}
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}
