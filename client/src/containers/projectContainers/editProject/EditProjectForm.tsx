import  { useEffect, useState } from 'react'
import { Project, Task } from '../../../api/ModelTypes';
import { config } from '../../../utils/config';
import { useAuthContext } from '../../../hooks/useAuthContext';
import './EditProjectForm.css';

interface ProjectFormData {
    projectName: string;
    projectDescription: string;
    members: { readonly _id: string; username: string; }[];
    taskIds: {
        readonly _id: string;
    }[];
}


export default function EditProjectForm(props: {project: Project}) {
    const { user } = useAuthContext();

    const [formData, setFormData] = useState<ProjectFormData>({
        projectName: props.project.name,
        projectDescription: props.project.description ?? '',
        members: props.project.members,
        taskIds: props.project.tasks
    })

    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        getTasks();
    }, []);

    const getTasks = async () => {
		try {
		    const response = await fetch(`${config.API_URL}/projects/${props.project._id}/tasks/`, {
				headers: {
					'Authorization': `Bearer ${user?.token}`
				}
		});
		const data = await response.json();

        if (!response.ok) throw new Error(data.message);

        for (const t of data.tasks) {
            t.annotations = await getAnnotationInfo(t._id);
        }

		setTasks(data.tasks);
		} catch (error) {
			console.error(error);
		}
	};

    const getAnnotationInfo = async (taskId: string) => {
        try {
            const response = await fetch(`${config.API_URL}/tasks/${taskId}`, {
				headers: {
					'Authorization': `Bearer ${user?.token}`
				}
			});

            const data = await response.json();

            if (!response.ok) throw new Error(data.message);

            return data.annotations;
        }
        catch (error) { console.error(error); }
    }

    
    return (
    <div className='EditProjectForm'>
        <div>
            <h3> {props.project.name} Properties </h3>
            <label>Project Name</label>
            <input type="text" value={formData.projectName} onChange={(e) => setFormData({...formData, projectName: e.target.value})} />
            <br/>
            <label>Project Description</label>
            <textarea value={formData.projectDescription} onChange={(e) => setFormData({...formData, projectDescription: e.target.value})} />
            <br/>
        </div>

        <div>
            <h3>Members</h3>
            <div>
                {formData.members.map((m, i) => 
                <>
                    <input type='checkbox' checked={true} onChange={() => {}} /> 
                    <label>{m.username}</label>
                </>
                )}
            </div>
        </div>

        <div>
            <h3>Tasks</h3>
            <div>
                {tasks.map((t, i) =>
                <>
                    <div>
                        {t.name}
                    </div>
                    {/* Expanded */}
                    <div>
                        {
                            t.annotations.map((a, i) => 
                            <>
                                <div>
                                    Label: {a.label}
                                </div>
                                <div>
                                    Entities: {a.entities.length}
                                </div>
                            </> )
                        }
                    </div>
                </>
                )}
            </div>
        </div>

        <div>
            <h3>Actions</h3>
            <button>Save</button>
            <button>Archive</button>
            <button>Delete Project</button>
        </div>
    </div>
  )
}
