import { useLocation } from 'react-router-dom'
import TaskContextProvider from 'features/annotation/contexts/TaskContext';
import TaskMain from 'features/annotation/containers/main/TaskMain';
import { useEffect } from 'react';
import { SocketContextProvider } from 'features/socket/contexts/SocketContext';

export default function AnnotateTask() {
    const location = useLocation();
    useEffect(() => {
        console.log(location.state);
        return () => {
            console.log("AnnotateTask unmounting");
        }
    }, []);

    return (
        <TaskContextProvider>
            <SocketContextProvider>
                <TaskMain taskId={location.state.taskId} project={location.state.project}/>
            </SocketContextProvider>
        </TaskContextProvider>
    )
}
