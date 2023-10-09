import { createContext, useReducer } from "react";
import { PatternArchetype, PatternEntity, Task } from "../../../api/ModelTypes";
import { Vector3 } from "three";

interface TaskState {
    task: Task | null;
    selectedArchetype: PatternArchetype | null;
    selectedEntity: PatternEntity | null;
    indexPosition: IntersectionPayload | null;
    showPropertyController: boolean;
    loading: boolean;
}

interface AddPatternEntityPayload { 
        patternIndices: number[];
}

interface UpdatePatternEntityPropertiesPayload {
    patternArchetypeName: string;
    patternEntityName: string;
    entityProperties: {
        orientation: number;
        scale: number;
        reflection: boolean;
        isArchetype: boolean;
    };
}

interface IntersectionPayload {
	face: {a: number, b: number, c: number, normal: Vector3} | null,
	faceIndex: number | null
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
        'SET_INDEX_POSITION' |
        'SET_SHOW_PROPERTY_CONTROLLER' |
        'SET_LOADING';
    payload?: 
        Task |
        PatternArchetype |
        { patternArchetypeName: string } |
        { patternEntityName: string } |
        { patternArchetypeName: string, patternEntityName: string} |
        AddPatternEntityPayload |
        UpdatePatternEntityPropertiesPayload |
        IntersectionPayload |
        number[] |
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
        indexPosition: null,
        showPropertyController: false,
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
            return { ...state, task: (action.payload as Task), selectedArchetype: null, selectedEntity: null };

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

            return { ...state, task: { ...state.task, annotations: filteredArchetypes }, selectedEntity: null };

        case 'ADD_PATTERN_ENTITY':
            if (!state.task || !state.selectedArchetype) return state;

            const addEntityPayload = action.payload as AddPatternEntityPayload;

            const newEntity: PatternEntity = {
                nameId: randomName('ent', 10000),
                orientation: 0,
                scale: 1,
                reflection: false,
                faceIds: addEntityPayload.patternIndices,
                isArchetype: state.selectedArchetype.entities.length === 0 || false
            }

            const updatedArchetypes = state.task.annotations?.map(archetype => {
                if (archetype.nameId === state.selectedArchetype?.nameId) {
                    return { ...archetype, entities: [...archetype.entities, newEntity] };
                }
                else {
                    return archetype;
                }
            });

            return { ...state, task: { ...state.task, annotations: updatedArchetypes }, selectedEntity: newEntity };

            case 'REMOVE_PATTERN_ENTITY':
                if (!state.task || !state.selectedArchetype) return state;
              
                const updatedEntities = state.task.annotations?.map(archetype => {
                  if (archetype.nameId === state.selectedArchetype?.nameId) {
                    const entities = archetype.entities.map((entity, index) => {
                      if (entity.nameId === (action.payload as { patternEntityName: string }).patternEntityName) {
                        if (entity.isArchetype && index < archetype.entities.length - 1) {
                          archetype.entities[index + 1].isArchetype = true;
                        }
                        return null;
                      } else {
                        return entity;
                      }
                    }).filter(Boolean) as PatternEntity[];
              
                    return { ...archetype, entities };
                  } else {
                    return archetype;
                  }
                });
              
                return { ...state, task: { ...state.task, annotations: updatedEntities }, selectedEntity: null };

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

            if (!action.payload) return { ...state, selectedEntity: null };

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

        case 'SET_INDEX_POSITION':
            if (!action.payload)
                return { ...state, indexPosition: null };

            return { ...state, indexPosition: action.payload as IntersectionPayload };

        case 'SET_SHOW_PROPERTY_CONTROLLER':
            if (!action.payload)
                return { ...state, showPropertyController: false };

            return { ...state, showPropertyController: action.payload as boolean };

        case 'SET_LOADING':
            return { ...state, loading: (action.payload as boolean) };

        default:
            return state;
        
    }
}

export default function TaskContextProvider({ children }: { children: React.ReactNode}) {

    const [state, dispatch] = useReducer(taskReducer, { 
        task: null,
        selectedArchetype: null,
        selectedEntity: null,
        indexPosition: null,
        showPropertyController: false,
        loading: false
    });
    return (
        <TaskContext.Provider value={{ ...state, dispatch }}>
            {children}
        </TaskContext.Provider>
    )
}
