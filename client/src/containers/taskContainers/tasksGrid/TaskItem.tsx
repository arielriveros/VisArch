import { useNavigate } from 'react-router-dom';
import { Task } from '../../../api/ModelTypes'
import './TaskList.css'
import { GridItem } from '../../../components/grid/Grid';

interface TaskItemProps extends Task {
    projectId: string;
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
        <GridItem onClick={handleGoToTask}>
            <h4> {props.name} </h4>
            <p> Annotations: {props.annotations?.length} </p>
        </GridItem>
    )
}
