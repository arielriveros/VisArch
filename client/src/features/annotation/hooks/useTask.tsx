import { useContext } from "react";
import { TaskContext } from "../contexts/TaskContext";

export function useTaskContext() {
    const context = useContext(TaskContext);

    if (!context)
        throw new Error('useTaskContext must be used within a TaskContextProvider');

    return context;
}