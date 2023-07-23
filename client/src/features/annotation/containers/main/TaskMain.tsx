import { useEffect } from 'react'
import { config } from '../../../../utils/config';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { useTaskContext } from '../../hooks/useTask';

type TaskMainProps = {
    taskId: string;
}

export default function TaskMain(props: TaskMainProps) {
    const { user } = useAuthContext();
    const { task, dispatch } = useTaskContext();

    const getTask = async () => {
        try {
            const response = await fetch(`${config.API_URL}/tasks/${props.taskId}`, {
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });
            const task = await response.json();
            dispatch({ type: 'SET_TASK', payload: task });
        } catch (error) {
            console.error(error);
        }
    };
            
    useEffect(() => {
        getTask();
	}, []);

    return (
        <div>
            {task?._id}
            <br />
            {task?.name}
            <br />
            {task?.meshPath}
            <br />
            {task?.status}
            <br />
        </div>
    )
}
