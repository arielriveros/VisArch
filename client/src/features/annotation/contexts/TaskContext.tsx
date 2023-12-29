import { createContext, useReducer, Dispatch } from "react";
import { PatternArchetype, PatternEntity, Task } from "../../../common/api/ModelTypes";
import { Vector3 } from "three";

interface TaskState {
    task: Task | null;
    selectedArchetype: PatternArchetype | null;
    selectedEntity: PatternEntity | null;
    hoveredEntity: PatternEntity | null;
    indexPosition: IntersectionPayload | null;
    loading: boolean;
}

interface AddPatternEntityPayload { 
    name: string;
    archetypeName: string;
    patternIndices: number[];
    client: boolean; // Checks if the action is from the client or from the server
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

interface TaskActionBase {
    type: string;
    payload?: any;
}

interface SetTaskAction extends TaskActionBase {
    type: 'SET_TASK';
    payload: Task;
}

interface SetAnnotationsAction extends TaskActionBase {
    type: 'SET_ANNOTATIONS';
    payload: PatternArchetype[];
}

interface AddSelectRemovePatternArchetypeAction extends TaskActionBase {
    type: 'ADD_PATTERN_ARCHETYPE' | 'SELECT_PATTERN_ARCHETYPE' | 'REMOVE_PATTERN_ARCHETYPE';
    payload: { patternArchetypeName: string };
}

interface UpdateSelectedPatternArchetypeAction extends TaskActionBase {
    type: 'UPDATE_SELECTED_PATTERN_ARCHETYPE';
    payload: { fold_symmetry?: number, color?: string, label?: string };
}

interface UpdatePatternArchetypeLabelAction extends TaskActionBase {
    type: 'UPDATE_PATTERN_ARCHETYPE_LABEL';
    payload: { patternArchetypeName: string, label: string };
}

interface AddPatternEntityAction extends TaskActionBase {
    type: 'ADD_PATTERN_ENTITY';
    payload: AddPatternEntityPayload;
}

interface RemovePatternEntityAction extends TaskActionBase {
    type: 'REMOVE_PATTERN_ENTITY';
    payload: { patternArchetypeName: string, patternEntityName: string, client: boolean };
}

interface SelectPatternEntityAction extends TaskActionBase {
    type: 'SELECT_PATTERN_ENTITY';
    payload: { patternArchetypeName: string, patternEntityName: string } | null;
}

interface HoverPatternEntityAction extends TaskActionBase {
    type: 'HOVER_PATTERN_ENTITY';
    payload: { patternArchetypeName: string, patternEntityName: string } | null;
}

interface UpdatePatternEntityPropertiesAction extends TaskActionBase {
    type: 'UPDATE_PATTERN_ENTITY_PROPERTIES';
    payload: UpdatePatternEntityPropertiesPayload;
}

interface SetIndexPositionAction extends TaskActionBase {
    type: 'SET_INDEX_POSITION';
    payload: IntersectionPayload | null;
}

interface SetLoadingAction extends TaskActionBase {
    type: 'SET_LOADING';
    payload: boolean;
}

interface SetClassAction extends TaskActionBase {
    type: 'SET_CLASS';
    payload: 'object' | 'terrain';
}


type TaskAction = SetTaskAction |
                  SetAnnotationsAction |
                  AddSelectRemovePatternArchetypeAction |
                  UpdateSelectedPatternArchetypeAction |
                  UpdatePatternArchetypeLabelAction |
                  AddPatternEntityAction |
                  RemovePatternEntityAction |
                  SelectPatternEntityAction |
                  HoverPatternEntityAction |
                  UpdatePatternEntityPropertiesAction |
                  SetIndexPositionAction |
                  SetLoadingAction |
                  SetClassAction;

interface TaskContextProps extends TaskState {
    dispatch: Dispatch<TaskAction>;
}

export const TaskContext = createContext<TaskContextProps>(
    {
        task: null,
        selectedArchetype: null,
        selectedEntity: null,
        hoveredEntity: null,
        indexPosition: null,
        loading: false,
        dispatch: () => {}
    }
);

function taskReducer(state: TaskState, action: TaskAction): TaskState {  
    switch (action.type) {
        case 'SET_TASK':
            return { ...state, task: (action.payload as Task), selectedArchetype: null, selectedEntity: null, hoveredEntity: null };

        case 'SET_ANNOTATIONS':
            if (!state.task) return state;
            return { ...state, task: { ...state.task, annotations: action.payload as PatternArchetype[] }};

        case 'ADD_PATTERN_ARCHETYPE':
            if (!state.task) return state;
            const payload = action.payload as { patternArchetypeName: string };

            const newArchetype: PatternArchetype = {
                nameId: payload.patternArchetypeName,
                fold_symmetry: 0,
                entities: [],
                color: "#ffffff",
                label: ""
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

            return { ...state, task: { ...state.task, annotations: filteredArchetypes }, selectedEntity: null, hoveredEntity: null };

        case 'ADD_PATTERN_ENTITY':
        {
            if (!state.task) return state;

            const payload = action.payload as AddPatternEntityPayload;

            const isThereAnArchetype = state.task.annotations?.find(archetype => archetype.nameId === payload.archetypeName)?.entities.some(entity => entity.isArchetype);

            const newEntity: PatternEntity = {
                nameId: payload.name,
                orientation: 0,
                scale: 1,
                reflection: false,
                faceIds: payload.patternIndices,
                // Check if there is already an archetype in the list
                isArchetype: !isThereAnArchetype
            }

            const updatedArchetypes = state.task.annotations?.map(archetype => {
                if (archetype.nameId === payload.archetypeName) {
                    return { ...archetype, entities: [...archetype.entities, newEntity] };
                }
                else {
                    return archetype;
                }
            });

            if (payload.client) {
                return { ...state, task: { ...state.task, annotations: updatedArchetypes }, selectedEntity: newEntity };
            }
            return { ...state, task: { ...state.task, annotations: updatedArchetypes } };
        }
        case 'REMOVE_PATTERN_ENTITY':
        {
            if (!state.task ) return state;

            const { patternArchetypeName, patternEntityName } = action.payload as { patternArchetypeName: string, patternEntityName: string, client: boolean };

            const updatedArchetypes = state.task.annotations?.map(archetype => {
                if (archetype.nameId !== patternArchetypeName) 
                    return archetype;

                // check if the entity is an archetype
                const isArchetype = archetype.entities.find(entity => entity.nameId === patternEntityName)?.isArchetype;

                // if it is an archetype, make the first entity in the list the new archetype
                if (isArchetype) {
                    const newArchetype = archetype.entities.find(entity => entity.nameId !== patternEntityName);
                    if (!newArchetype) return archetype;

                    return {
                        ...archetype,
                        entities: archetype.entities.filter(entity => entity.nameId !== patternEntityName).map(entity => {
                            if (entity.nameId === newArchetype.nameId) {
                                return { ...entity, isArchetype: true };
                            }
                            else {
                                return entity;
                            }
                        })
                    };
                }

                return {
                    ...archetype,
                    entities: archetype.entities.filter(entity => entity.nameId !== patternEntityName)
                };
            });

            if (action.payload.client) {
                return { ...state, task: { ...state.task, annotations: updatedArchetypes }, selectedEntity: null, hoveredEntity: null };
            }

            return { ...state, task: { ...state.task, annotations: updatedArchetypes } };
        }

        case 'UPDATE_SELECTED_PATTERN_ARCHETYPE':
            if (!state.task || !state.selectedArchetype) return state;

            const updatedSelectedArchetypes = state.task.annotations?.map(archetype => {
                if (archetype.nameId === state.selectedArchetype?.nameId) {
                    return { ...archetype, ...action.payload };
                }
                else {
                    return archetype;
                }
            });

            return { ...state, task: { ...state.task, annotations: updatedSelectedArchetypes } };

        case 'UPDATE_PATTERN_ARCHETYPE_LABEL':
        {
            if (!state.task) return state;

            const { patternArchetypeName, label } = action.payload as { patternArchetypeName: string, label: string };

            const updatedArchetypes = state.task.annotations?.map(archetype => {
                if (archetype.nameId === patternArchetypeName) {
                    return { ...archetype, label: label };
                }
                else {
                    return archetype;
                }
            });

            return { ...state, task: { ...state.task, annotations: updatedArchetypes } };
        }

        case 'SELECT_PATTERN_ENTITY':
            if (!state.task || !state.selectedArchetype) return state;

            if (!action.payload) return { ...state, selectedEntity: null };

            const selectEntityPayload = action.payload as { patternArchetypeName: string, patternEntityName: string };

            const selectedEntity = state.task.annotations?.find(archetype => archetype.nameId === selectEntityPayload.patternArchetypeName)?.entities.find(entity => entity.nameId === selectEntityPayload.patternEntityName);
            if (!selectedEntity) return state;

            return { ...state, selectedEntity: selectedEntity, hoveredEntity: null };

        case 'HOVER_PATTERN_ENTITY':
            if (!state.task || !state.selectedArchetype) return state;

            if (!action.payload) return { ...state, hoveredEntity: null };

            const hoverEntityPayload = action.payload as { patternArchetypeName: string, patternEntityName: string };

            const hoveredEntity = state.task.annotations?.find(archetype => archetype.nameId === hoverEntityPayload.patternArchetypeName)?.entities.find(entity => entity.nameId === hoverEntityPayload.patternEntityName);
            if (!hoveredEntity) return state;

            return { ...state, hoveredEntity: hoveredEntity };


        case 'UPDATE_PATTERN_ENTITY_PROPERTIES':
            if (!state.task) return state;

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
        hoveredEntity: null,
        indexPosition: null,
        loading: false
    });
    return (
        <TaskContext.Provider value={{ ...state, dispatch }}>
            {children}
        </TaskContext.Provider>
    )
}
