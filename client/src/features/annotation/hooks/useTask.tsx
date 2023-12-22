import { useContext } from "react";
import { TaskContext } from "../contexts/TaskContext";
import { Task } from "../../../api/ModelTypes";
import { API_ENDPOINT } from "../../../api/Endpoints";

export function useTaskContext() {
    const context = useContext(TaskContext);

    if (!context)
        throw new Error('useTaskContext must be used within a TaskContextProvider');

    const uploadTask = async (task: Task, token: string, callback?: (cb: any)=>void) => {
        try {
            if (!task) return;

            const response = await fetch(`${API_ENDPOINT()}/tasks/${task._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...task})
            });

            if (!response.ok)
                throw new Error('Failed to upload task');

            if (callback)
                callback(response);

        } catch (error) {
            console.error(error);
        }
    }

    return {...context, uploadTask};
}