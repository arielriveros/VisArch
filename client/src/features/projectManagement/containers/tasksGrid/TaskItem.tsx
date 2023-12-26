import { useNavigate } from 'react-router-dom';
import { Project, Task } from 'common/api/ModelTypes'
import { GridItem } from 'common/components/grid/Grid';
import './TaskList.css'

interface TaskItemProps extends Task {
    project: Project;
}

export default function TaskItem(props: TaskItemProps) {
    const navigate = useNavigate();

    const handleGoToTask = () => {
		// Navigate to the task annotation tool page and pass task id as state
		navigate(`/task/${props._id}`, {
			state: {
				taskId: props._id,
                project: props.project
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
