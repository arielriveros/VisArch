import { useLocation } from 'react-router-dom'
import TaskContextProvider from 'features/annotation/contexts/TaskContext';
import TaskMain from 'features/annotation/containers/main/TaskMain';
import SocketContextProvider from 'features/socket/contexts/SocketContext';

export default function AnnotateTask() {
    const location = useLocation();

    return (
        <SocketContextProvider>
            <TaskContextProvider>
                <TaskMain taskId={location.state.taskId} project={location.state.project}/>
            </TaskContextProvider>
        </SocketContextProvider>
    )
}
