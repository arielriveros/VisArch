import { createContext, useReducer } from "react";
import { PatternArchetype, Task } from "../../../api/ModelTypes";

interface TaskState {
    task: Task | null;
    archetype: PatternArchetype | null;
}

interface TaskAction {
    type: 'SET_TASK' | 'ADD_PATTERN_ARCHETYPE' | 'SELECT_PATTERN_ARCHETYPE';
    payload?: Task | PatternArchetype | { patternArchetypeName: string };
}

interface TaskContextProps extends TaskState {
    dispatch: React.Dispatch<TaskAction>;
}

export const TaskContext = createContext<TaskContextProps>(
    {
        task: null,
        archetype: null,
        dispatch: () => {}
    }
);

function taskReducer(state: TaskState, action: TaskAction): TaskState {
    switch (action.type) {
        case 'SET_TASK':
            return { ...state, task: (action.payload as Task) };

        case 'ADD_PATTERN_ARCHETYPE':
            if (!state.task) return state;

            if (action.payload as PatternArchetype) {
                if (!state.task.archetypes)
                {
                    const updatedTask = {
                        ...state.task,
                        archetypes: [action.payload as PatternArchetype],
                    };
                    return { ...state, task: updatedTask };
                }
                else
                {
                    const archetypes = [...state.task.archetypes, action.payload as PatternArchetype];
                    const updatedTask = {
                        ...state.task,
                        archetypes: archetypes,
                    };
                    return { ...state, task: updatedTask };
                }
            }
            return state;

        case 'SELECT_PATTERN_ARCHETYPE':
            if (!state.task) return state;

            let selectedArchetype = state.task.archetypes?.find(archetype => archetype.name === (action.payload as { patternArchetypeName: string }).patternArchetypeName);
            if (!selectedArchetype) return state;

            return { ...state, archetype: selectedArchetype}
            
        default:
            return state;
    }
}

export default function TaskContextProvider({ children }: { children: React.ReactNode}) {

    const [state, dispatch] = useReducer(taskReducer, { task: null, archetype: null });
    return (
        <TaskContext.Provider value={{ ...state, dispatch }}>
            {children}
        </TaskContext.Provider>
    )
}
