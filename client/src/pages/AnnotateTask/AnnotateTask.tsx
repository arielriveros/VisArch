import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Task } from '../../api/ModelTypes';
import { config } from '../../utils/config';
import { useAuthContext } from '../../hooks/useAuthContext';

export default function AnnotateTask() {
    const location = useLocation();
    const [task, setTask] = useState<Task | null>(null);
    const { user } = useAuthContext();

    const getTask = async () => {
        try {
            const response = await fetch(`${config.API_URL}/tasks/${location.state.taskId}`, {
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });
            const data = await response.json();
            setTask(data);
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };
            
    useEffect(() => {
        getTask();
	}, []);

    return (
        <div> {task?.name} </div>
    )
}
