import { createContext, useReducer } from "react";
import { PatternArchetype, Task } from "../../../api/ModelTypes";

interface TaskState {
    task: Task | null;
    selectedArchetype: PatternArchetype | null;
}

interface TaskAction {
    type: 
        'SET_TASK' |
        'ADD_PATTERN_ARCHETYPE' |
        'SELECT_PATTERN_ARCHETYPE' |
        'REMOVE_PATTERN_ARCHETYPE';
    payload?: Task | PatternArchetype | { patternArchetypeName: string } | null;
}

interface TaskContextProps extends TaskState {
    dispatch: React.Dispatch<TaskAction>;
}

export const TaskContext = createContext<TaskContextProps>(
    {
        task: null,
        selectedArchetype: null,
        dispatch: () => {}
    }
);

function renameAllArchetypes(archetypes: PatternArchetype[]) {
    const renamedArchetypes = archetypes.map((archetype, index) => {
        archetype.name = `pat-${index}`;
        return archetype;
    });

    return renamedArchetypes;
}

function taskReducer(state: TaskState, action: TaskAction): TaskState {
    switch (action.type) {
        case 'SET_TASK':
            state.selectedArchetype = null;    
            return { ...state, task: (action.payload as Task) };

        case 'ADD_PATTERN_ARCHETYPE':
            if (!state.task) return state;

            const newArchetype: PatternArchetype = {
                name: `pat-${state.task.archetypes?.length ?? 0}`,
                fold_symmetry: 0,
                imgPath: '',
                entities: [],
            };

            if (!state.task.archetypes) {
                const updatedTask = {
                    ...state.task,
                    archetypes: [newArchetype],
                };
                return { ...state, task: updatedTask };
            }
            else {
                const archetypes = [...state.task.archetypes, newArchetype];
                const updatedTask = {
                    ...state.task,
                    archetypes: archetypes,
                };
                return { ...state, task: updatedTask };
            }

        case 'SELECT_PATTERN_ARCHETYPE':
            if (!state.task) return state;

            let selectedArchetype = state.task.archetypes?.find(archetype => archetype.name === (action.payload as { patternArchetypeName: string }).patternArchetypeName);
            if (!selectedArchetype) return state;

            return { ...state, selectedArchetype: selectedArchetype}
            
        case 'REMOVE_PATTERN_ARCHETYPE':
            if (!state.task) return state;

            const updatedArchetypes = state.task.archetypes?.filter(archetype => archetype.name !== (action.payload as { patternArchetypeName: string }).patternArchetypeName);
            console.log(renameAllArchetypes(updatedArchetypes ?? []) );

            state.selectedArchetype = null;

            return { ...state, task: { ...state.task, archetypes: updatedArchetypes } };

        default:
            return state;
    }
}

export default function TaskContextProvider({ children }: { children: React.ReactNode}) {

    const [state, dispatch] = useReducer(taskReducer, { task: null, selectedArchetype: null });
    return (
        <TaskContext.Provider value={{ ...state, dispatch }}>
            {children}
        </TaskContext.Provider>
    )
}
