import { createContext, useReducer } from "react";
import { PatternArchetype, PatternEntity, Task } from "../../../api/ModelTypes";

interface TaskState {
    task: Task | null;
    selectedArchetype: PatternArchetype | null;
    selectedEntity: PatternEntity | null;
    loading: boolean;
}

interface AddPatternEntityPayload { 
        patternIndices: number[];
        centroid: {x: number, y: number, z: number};
        box: {min: {x: number, y: number, z: number}, max: {x: number, y: number, z: number}};
}

interface UpdatePatternEntityPropertiesPayload {
    patternArchetypeName: string;
    patternEntityName: string;
    entityProperties: {
        orientation: number;
        scale: number;
        reflection: boolean;
    };
}

interface TaskAction {
    type: 
        'SET_TASK' |
        'ADD_PATTERN_ARCHETYPE' |
        'SELECT_PATTERN_ARCHETYPE' |
        'REMOVE_PATTERN_ARCHETYPE' |
        'ADD_PATTERN_ENTITY' |
        'REMOVE_PATTERN_ENTITY' |
        'SELECT_PATTERN_ENTITY' |
        'UPDATE_PATTERN_ENTITY_PROPERTIES' |
        'UPDATE_SELECTED_PATTERN_ARCHETYPE' |
        'SET_LOADING';
    payload?: 
        Task |
        PatternArchetype |
        { patternArchetypeName: string } |
        { patternEntityName: string } |
        { patternArchetypeName: string, patternEntityName: string} |
        AddPatternEntityPayload |
        UpdatePatternEntityPropertiesPayload |
        boolean |
        null;
}

interface TaskContextProps extends TaskState {
    dispatch: React.Dispatch<TaskAction>;
}

export const TaskContext = createContext<TaskContextProps>(
    {
        task: null,
        selectedArchetype: null,
        selectedEntity: null,
        loading: false,
        dispatch: () => {}
    }
);

function taskReducer(state: TaskState, action: TaskAction): TaskState {
    function randomName(indexName: string, max: number): string {
        let value = Math.floor(Math.random() * max);
        let name = `${indexName}-${value}`;
        if (state.task?.annotations?.find(archetype => archetype.nameId === name))
            return randomName(indexName, max);

        return name;
    }
    
    switch (action.type) {
        case 'SET_TASK':
            state.selectedArchetype = null;    
            return { ...state, task: (action.payload as Task) };

        case 'ADD_PATTERN_ARCHETYPE':
            if (!state.task) return state;

            const newArchetype: PatternArchetype = {
                nameId: randomName('pat', 10000),
                fold_symmetry: 0,
                entities: [],
                color: "#ffffff"
            };

            if (!state.task.annotations) {
                const updatedTask = {
                    ...state.task,
                    annotations: [newArchetype],
                };
                return { ...state, task: updatedTask };
            }
            else {
                const archetypes = [...state.task.annotations, newArchetype];
                const updatedTask = {
                    ...state.task,
                    annotations: archetypes,
                };
                return { ...state, task: updatedTask };
            }

        case 'SELECT_PATTERN_ARCHETYPE':
            if (!state.task) return state;

            let selectedArchetype = state.task.annotations?.find(archetype => archetype.nameId === (action.payload as { patternArchetypeName: string }).patternArchetypeName);
            if (!selectedArchetype) return state;

            return { ...state, selectedArchetype: selectedArchetype}
            
        case 'REMOVE_PATTERN_ARCHETYPE':
            if (!state.task) return state;

            const filteredArchetypes = state.task.annotations?.filter(archetype => archetype.nameId !== (action.payload as { patternArchetypeName: string }).patternArchetypeName);
            state.selectedArchetype = null;

            return { ...state, task: { ...state.task, annotations: filteredArchetypes } };

        case 'ADD_PATTERN_ENTITY':
            if (!state.task || !state.selectedArchetype) return state;

            const addEntityPayload = action.payload as AddPatternEntityPayload;

            const newEntity: PatternEntity = {
                nameId: randomName('ent', 10000),
                orientation: 0,
                scale: 1,
                reflection: false,
                faceIds: addEntityPayload.patternIndices,
                centroid: addEntityPayload.centroid,
                box: addEntityPayload.box,
            }

            const updatedArchetypes = state.task.annotations?.map(archetype => {
                if (archetype.nameId === state.selectedArchetype?.nameId) {
                    return { ...archetype, entities: [...archetype.entities, newEntity] };
                }
                else {
                    return archetype;
                }
            });

            return { ...state, task: { ...state.task, annotations: updatedArchetypes } };

        case 'REMOVE_PATTERN_ENTITY':
            if (!state.task || !state.selectedArchetype) return state;

            const updatedEntities = state.task.annotations?.map(archetype => {
                if (archetype.nameId === state.selectedArchetype?.nameId) {
                    return { 
                        ...archetype,
                        entities: archetype.entities.filter(entity => entity.nameId !== (action.payload as { patternEntityName: string }).patternEntityName)
                    };
                }
                else {
                    return archetype;
                }
            });

            return { ...state, task: { ...state.task, annotations: updatedEntities } };

        case 'UPDATE_SELECTED_PATTERN_ARCHETYPE':
            if (!state.task || !state.selectedArchetype) return state;

            const updatedSelectedArchetypes = state.task.annotations?.map(archetype => {
                if (archetype.nameId === state.selectedArchetype?.nameId) {
                    return { ...archetype, ...(action.payload as PatternArchetype) };
                }
                else {
                    return archetype;
                }
            });

            return { ...state, task: { ...state.task, annotations: updatedSelectedArchetypes } };

        case 'SELECT_PATTERN_ENTITY':
            if (!state.task || !state.selectedArchetype) return state;

            const selectEntityPayload = action.payload as { patternArchetypeName: string, patternEntityName: string };

            const selectedEntity = state.task.annotations?.find(archetype => archetype.nameId === selectEntityPayload.patternArchetypeName)?.entities.find(entity => entity.nameId === selectEntityPayload.patternEntityName);
            if (!selectedEntity) return state;

            return { ...state, selectedEntity: selectedEntity };

        case 'UPDATE_PATTERN_ENTITY_PROPERTIES':
            if (!state.task || !state.selectedArchetype) return state;

            const { patternArchetypeName, patternEntityName, entityProperties } = action.payload as UpdatePatternEntityPropertiesPayload;

            const updatedEntityProperties = state.task.annotations?.map(archetype => {
                if (archetype.nameId !== patternArchetypeName) 
                    return archetype;

                return {
                    ...archetype,
                    entities: archetype.entities.map(entity => {
                        if (entity.nameId === patternEntityName)
                            return { ...entity, ...entityProperties };

                        else
                            return entity;
                    })
                };
            });

            return { ...state, task: { ...state.task, annotations: updatedEntityProperties } };	

        case 'SET_LOADING':
            return { ...state, loading: (action.payload as boolean) };

        default:
            return state;
        
    }
}

export default function TaskContextProvider({ children }: { children: React.ReactNode}) {

    const [state, dispatch] = useReducer(taskReducer, { task: null, loading: false, selectedArchetype: null, selectedEntity: null });
    return (
        <TaskContext.Provider value={{ ...state, dispatch }}>
            {children}
        </TaskContext.Provider>
    )
}
