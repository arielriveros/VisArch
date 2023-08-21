import { useNavigate } from 'react-router-dom';
import { Task } from '../../../api/ModelTypes'
import './TaskItem.css'

interface TaskItemProps extends Task {
    projectId: string;
    minimal?: boolean;
}

export default function TaskItem(props: TaskItemProps) {
    const navigate = useNavigate();

    const handleGoToTask = () => {
		// Navigate to the task annotation tool page and pass task id as state
		navigate(`/task/${props._id}`, {
			state: {
				taskId: props._id,
                projectId: props.projectId
			}
		});
	}

    return (
        <div className='task-item' onClick={handleGoToTask}>
            {
                props.minimal ? 
                <p> {props.name} </p>
                : 
                <>
                    <h4> {props.name} </h4>
                    <p> Annotations: {props.annotations?.length} </p>
                </>
            }
            
        </div>
    )
}
