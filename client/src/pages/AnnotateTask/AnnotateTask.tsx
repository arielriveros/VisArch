import { useLocation } from 'react-router-dom'
import TaskContextProvider from '../../features/annotation/contexts/TaskContext';
import TaskMain from '../../features/annotation/containers/main/TaskMain';

export default function AnnotateTask() {
    const location = useLocation();

    return (
        <TaskContextProvider>
            <TaskMain taskId={location.state.taskId} projectId={location.state.projectId}/>
        </TaskContextProvider>
    )
}
