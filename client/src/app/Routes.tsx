import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSocket } from '@/features/socket/hooks/useSocket';
import Home from '@/pages/Home';
import Projects from '@/pages/projects/Projects';
import Tasks from '@/pages/tasks/Tasks';
import ProjectForm from '@/pages/projects/ProjectForm';
import NotFound from '@/pages/NotFound';
import Layout from '@/pages/Layout';
import Login from '@/pages/Login';
import NewTask from '@/pages/tasks/NewTask';
import useSession from '@/hooks/useSession';
import AnnotationApp from '@/features/annotation/AnnotationApp';
import ProjectDetails from '@/pages/projects/ProjectDetails';

export default function AppRoutes() {
  const { login, signedIn } = useSession();

  useEffect(() => {
    if (!signedIn)
      login();
  }, [signedIn, login]);

  
  const { connect, disconnect } = useSocket();

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='login' element={<Login />} />
        <Route path='projects'>
          <Route index element={<Projects />} />
          <Route path='new' element={<ProjectForm />} />
          <Route path=':projectId'>
            <Route path='details' element={<ProjectDetails />} />
            <Route path='tasks' element={<Tasks />} />
            <Route path='new-task' element={<NewTask />} />
            <Route path='edit' element={<ProjectForm />} />
          </Route>
        </Route>
        <Route path='*' element={<NotFound />} />
      </Route>
      <Route path='/task/:taskId' element={<AnnotationApp />} />
    </Routes>
  );
}
