import { useTranslation } from 'react-i18next';
import { ProjectsApiResponse } from '@/api/types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';

interface ProjectTableProps {
  userId: string;
  projects: ProjectsApiResponse;
  onRowClick: (projectId: string) => void;
  onDetailsClick: (projectId: string) => void;
  onEditClick: (projectId: string) => void;
}

export default function ProjectTable(props: ProjectTableProps) {
  const { projects, userId } = props;
  const { t } = useTranslation();

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">{t('projects.name')}</TableCell>
            <TableCell align="center">{t('projects.description')}</TableCell>
            <TableCell align="center">{t('projects.tasks')}</TableCell>
            <TableCell align="center">{t('projects.owner')}</TableCell>
            <TableCell align="center">{t('projects.collaborators')}</TableCell>
            <TableCell align="center">{t('tasks.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects?.map((project) => (
            <TableRow
              key={project._id}
              hover
              onClick={() => props.onRowClick(project._id)}
              style={{ cursor: 'pointer' }}
            >
              <TableCell align="center">{project.name}</TableCell>
              <TableCell align="center">
                {project.description && project.description !== '' ? (
                  project.description
                ) : (
                  <i>{t('projects.no-description')}</i>
                )}
              </TableCell>
              <TableCell align="center">{project.tasks.length}</TableCell>
              <TableCell align="center">
                {project.owner.displayName}{' '}
                {project.owner._id === userId
                  ? `(${t('projects.owner-you')})`
                  : `(${project.owner.email})`}
              </TableCell>
              <TableCell align="center">{project.collaborators.length}</TableCell>
              <TableCell align="center">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                  onClick={(e) => e.stopPropagation()} // Prevent row click when interacting with buttons
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => props.onDetailsClick(project._id)}
                  >
                    {t('projects.details')}
                  </Button>
                  {project.owner._id === userId && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => props.onEditClick(project._id)}
                    >
                      {t('projects.edit')}
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}