import  { useEffect, useState } from 'react'
import { Project, Task } from '../../../api/ModelTypes';
import { config } from '../../../utils/config';
import { useAuthContext } from '../../../hooks/useAuthContext';
import Grid from '../../../components/grid/Grid';
import './EditProjectForm.css';

interface ProjectFormData {
    projectName: string;
    projectDescription: string;
    members: { readonly _id: string; username: string; }[];
    taskIds: {
        readonly _id: string;
    }[];
}

function OptionCard(props: {text: string; onClick:()=>void; toRemove?: boolean; children?: React.ReactNode}) {
    return (
        <div className="OptionCard">
            <div className="Upper">
                {props.text}
                <button onClick={props.onClick}> {props.toRemove ? '<-' : 'X'} </button>
            </div>
            <div>
                {props.children}
            </div>
        </div>
    )
}


export default function EditProjectForm(props: {project: Project}) {
    const { user } = useAuthContext();

    const [formData, setFormData] = useState<ProjectFormData>({
        projectName: props.project.name,
        projectDescription: props.project.description ?? '',
        members: props.project.members,
        taskIds: props.project.tasks
    })

    const [membersToRemove, setMembersToRemove] = useState<{ readonly _id: string; username: string; }[]>([]);

    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        getTasks();
    }, []);

    useEffect(()=>{
        setMembersToRemove([]);
    }, [tasks])

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

    const downloadModel = async (path: string) => {
        const response = await fetch(`${config.STATICS_URL}/${path}`, {
            headers: {
                'Authorization': `Bearer ${user?.token}`
            }
        });

        if (!response.ok) throw new Error('Failed to load mesh');

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = path;
        a.click();
    };

    const onSave = async () => {
        try {
            const body = JSON.stringify(
                {
                    name: formData.projectName,
                    description: formData.projectDescription,
                    membersToDelete: membersToRemove.map(m => m._id),
                    tasksToDelete: tasks.filter(
                            t => !formData.taskIds.some(id => id._id === t._id)
                        ).map(t => t._id)
                }
            )
            const response = await fetch(`${config.API_URL}/projects/${props.project._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: body
            });

            const data = await response.json();
            console.log(data);

            if (!response.ok) throw new Error(data.message);

            props.project.name = formData.projectName;
            props.project.description = formData.projectDescription;
            props.project.members = formData.members;
            props.project.tasks = formData.taskIds;

            const updatedTasks = tasks.filter(
                t => formData.taskIds.some(id => id._id === t._id)
            );

            setTasks(updatedTasks);
        }
        catch (error) { console.error(error); }
    };

    const onDelete = async ()  => {
		const response = await fetch(`${config.API_URL}/projects/${props.project._id}`, {
			method: 'DELETE',
			headers: {
			'Authorization': `Bearer ${user?.token}`
			}
		});

        const data = await response.json();
        console.log(data);
	}
    
    return (
    <div className='EditProjectForm'>
        <div className='EditProject'>
            <h3> {props.project.name} Properties </h3>
            <div>
                Project Name
                <br/>
                <input type="text" value={formData.projectName} onChange={(e) => setFormData({...formData, projectName: e.target.value})} />
            </div>
            <br/>
            <div>
                Project Description
                <br/>
                <textarea value={formData.projectDescription} onChange={(e) => setFormData({...formData, projectDescription: e.target.value})} />
            </div>
        </div>

        <div className='EditProject'>
            <h3>Members</h3>
            <div className="Members">
                <h5>Members:</h5>
                <Grid >
                    {formData.members.map((m, i) => 
                        <OptionCard key={i} text={m.username} onClick={
                            () => {
                                if (m._id === props.project.owner._id) return;
                                setMembersToRemove([...membersToRemove, m]);
                                setFormData({...formData, members: formData.members.filter((m2) => m2._id !== m._id)})
                            }
                        }/>
                    )}
                </Grid>
                <h5>Members to Remove:</h5>
                <Grid>
                    { membersToRemove.map((m, i) => 
                        <OptionCard key={i} text={m.username} toRemove={true} onClick={
                            () => {
                                setMembersToRemove(membersToRemove.filter((m2) => m2._id !== m._id));
                                setFormData({...formData, members: [...formData.members, m]})
                            }
                        }/>
                    )}
                </Grid>
            </div>
        </div>

        <div className='EditProject'>
            <h3>Tasks</h3>
            <table>
            <thead>
                <tr>
                    <th>Keep</th>
                    <th>Name</th>
                    <th>Archetypes</th>
                    <th>Annotations</th>
                    <th>Model</th>
                </tr>
            </thead>
            <tbody>
                {tasks.map((t, i) =>
                t && t.annotations &&
                <tr key={i}>
                    <td>
                        <input 
                            type="checkbox" 
                            checked={formData.taskIds.some((id) => id._id === t._id)}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setFormData({...formData, taskIds: [...formData.taskIds, t]});
                                } else {
                                    setFormData({...formData, taskIds: formData.taskIds.filter((id) => id._id !== t._id)});
                                }
                            }}
                        />
                    </td>
                    <td>{t.name}</td>
                    <td>{t.annotations.length}</td>
                    <td>
                        {t.annotations.reduce((acc, a) => acc + a.entities.length, 0)}
                    </td>
                    <td>
                        <div style={{cursor: 'pointer'}} onClick={()=>downloadModel(t.meshPath)}>Download</div>
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
        <div className='EditProject'>
            <h3>Actions</h3>
            <div className='ActionButtons'>
                <button className='Save' onClick={onSave}>Save</button>
                <button className='Archive'>Archive</button>
                <button className='Delete' onClick={onDelete}>Delete Project</button>
            </div>
        </div>
    </div>
  )
}
