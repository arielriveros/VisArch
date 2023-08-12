import { createContext, useReducer } from "react";
import { PatternArchetype, PatternEntity, Task } from "../../../api/ModelTypes";

interface TaskState {
    task: Task | null;
    selectedArchetype: PatternArchetype | null;
}

interface TaskAction {
    type: 
        'SET_TASK' |
        'ADD_PATTERN_ARCHETYPE' |
        'SELECT_PATTERN_ARCHETYPE' |
        'REMOVE_PATTERN_ARCHETYPE' |
        'ADD_PATTERN_ENTITY' |
        'UPDATE_SELECTED_PATTERN_ARCHETYPE';
    payload?: 
        Task |
        PatternArchetype |
        { patternArchetypeName: string } |
        { patternIndices: number[] } |
        null;
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
                color: "#ffffff"
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

            const filteredArchetypes = state.task.archetypes?.filter(archetype => archetype.name !== (action.payload as { patternArchetypeName: string }).patternArchetypeName);
            renameAllArchetypes(filteredArchetypes ?? []);

            state.selectedArchetype = null;

            return { ...state, task: { ...state.task, archetypes: filteredArchetypes } };

        case 'ADD_PATTERN_ENTITY':
            if (!state.task || !state.selectedArchetype) return state;

            const newEntity: PatternEntity = {
                archetypeId: state.selectedArchetype.name,
                orientation: 0,
                scale: 1,
                reflection: false,
                faceIds: (action.payload as {patternIndices: number[]}).patternIndices
            }

            const updatedArchetypes = state.task.archetypes?.map(archetype => {
                if (archetype.name === state.selectedArchetype?.name) {
                    return { ...archetype, entities: [...archetype.entities, newEntity] };
                }
                else {
                    return archetype;
                }
            });

            return { ...state, task: { ...state.task, archetypes: updatedArchetypes } };

        case 'UPDATE_SELECTED_PATTERN_ARCHETYPE':
            if (!state.task || !state.selectedArchetype) return state;

            const updatedSelectedArchetypes = state.task.archetypes?.map(archetype => {
                if (archetype.name === state.selectedArchetype?.name) {
                    return { ...archetype, ...action.payload };
                }
                else {
                    return archetype;
                }
            });

            return { ...state, task: { ...state.task, archetypes: updatedSelectedArchetypes } };

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
