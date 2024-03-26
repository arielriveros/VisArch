import { createContext, useReducer } from 'react';
import { Archetype, Entity, UserApiResponse } from '@/api/types';

interface AnnotationState {
  annotations: Archetype[];
  selectedArchetype: string | null;
  selectedEntity: string | null;
  users: UserApiResponse[];
}

interface SetAnnotationsAction {
  type: 'SET_ANNOTATIONS';
  payload: Archetype[];
}

interface AddArchetypeAction {
  type: 'ADD_ARCHETYPE';
  payload: Archetype;
}

interface RemoveArchetypeAction {
  type: 'REMOVE_ARCHETYPE';
  payload: string;
}

interface SelectArchetypeAction {
  type: 'SELECT_ARCHETYPE';
  payload: string;
}

interface UpdateArchetypeAction {
  type: 'UPDATE_ARCHETYPE';
  payload: Archetype;
}

interface AddEntityAction {
  type: 'ADD_ENTITY';
  payload: { archetypeId: string, entity: Entity };
}

interface RemoveEntityAction {
  type: 'REMOVE_ENTITY';
  payload: { archetypeId: string, entityId: string };
}

interface SelectEntityAction {
  type: 'SELECT_ENTITY';
  payload: { archetypeId: string, entityId: string };
}

interface UpdateEntityAction {
  type: 'UPDATE_ENTITY';
  payload: { archetypeId: string, entityId: string, entity: Entity };
}

interface SetEntityAsArchetypeAction {
  type: 'SET_ENTITY_AS_ARCHETYPE';
  payload: { archetypeId: string, entityId: string | null };
}

interface SetUsersAction {
  type: 'SET_USERS';
  payload: {
    owner: UserApiResponse;
    collaborators: UserApiResponse[];
  };
}

    
type AnnotationAction = SetAnnotationsAction |
  AddArchetypeAction | RemoveArchetypeAction | SelectArchetypeAction | UpdateArchetypeAction |
  AddEntityAction | RemoveEntityAction | SelectEntityAction | UpdateEntityAction | SetEntityAsArchetypeAction |
  SetUsersAction;

interface AnnotationContextProps extends AnnotationState {
  dispatch: React.Dispatch<AnnotationAction>;
}

const defaultState: AnnotationState = {
  annotations: [],
  selectedArchetype: null,
  selectedEntity: null,
  users: []
};

export const AnnotationContext = createContext<AnnotationContextProps>({ ...defaultState, dispatch: () => {} });

function AnnotationReducer(state: AnnotationState, action: AnnotationAction): AnnotationState {
  switch (action.type) {
  case 'SET_ANNOTATIONS':
    return { ...state, annotations: action.payload };

  case 'ADD_ARCHETYPE': {
    return {
      ...state,
      annotations: [...state.annotations, action.payload]
    };
  }

  case 'REMOVE_ARCHETYPE': {
    const id = action.payload;
    return {
      ...state,
      annotations: state.annotations.filter(archetype => archetype.id !== id),
      selectedArchetype: state.selectedArchetype === id ? null : state.selectedArchetype, // Unselect the removed archetype
      selectedEntity: state.annotations.find(archetype => archetype.id === id) ? null : state.selectedEntity // Unselect the removed entity
    };
  }

  case 'SELECT_ARCHETYPE':
    return { ...state, selectedArchetype: action.payload };

  case 'UPDATE_ARCHETYPE': {
    const { id, ...payload } = action.payload;
    return {
      ...state,
      annotations: state.annotations.map(archetype => {
        if (archetype.id === id)
          return { ...archetype, ...payload };
        return archetype;
      })
    };
  }

  case 'ADD_ENTITY': {
    const { archetypeId, entity } = action.payload;
    return {
      ...state,
      annotations: state.annotations.map(archetype => {
        if (archetype.id === archetypeId)
          return { ...archetype, entities: [...archetype.entities, entity] };
        return archetype;
      })
    };
  }

  case 'REMOVE_ENTITY': {
    const { archetypeId, entityId } = action.payload;
    return {
      ...state,
      annotations: state.annotations.map(archetype => {
        if (archetype.id === archetypeId)
          return {
            ...archetype,
            archetype: archetype.archetype === entityId ? null : archetype.archetype, // Unset the archetype if it is the entity being removed
            entities: archetype.entities.filter(entity => entity.id !== entityId) ,
          };
        return archetype;
      }),
      selectedEntity: state.selectedEntity === entityId ? null : state.selectedEntity
    };
  }

  case 'SELECT_ENTITY': {
    const { archetypeId, entityId } = action.payload;
    //TODO: Should the archetype be selected as well?
    return { ...state, selectedArchetype: archetypeId, selectedEntity: entityId };
  }

  case 'UPDATE_ENTITY': {
    const { archetypeId, entityId, entity } = action.payload;
    return {
      ...state,
      annotations: state.annotations.map(archetype => {
        if (archetype.id === archetypeId)
          return {
            ...archetype,
            entities: archetype.entities.map(e => e.id === entityId ? entity : e)
          };
        return archetype;
      })
    };
  }

  case 'SET_ENTITY_AS_ARCHETYPE': {
    const { archetypeId, entityId } = action.payload;
    return {
      ...state,
      annotations: state.annotations.map(archetype => {
        if (archetype.id === archetypeId)
          return {
            ...archetype,
            archetype: entityId
          };
        return archetype;
      })
    };
  }

  case 'SET_USERS':
    return { ...state, users: [action.payload.owner, ...action.payload.collaborators] };

  default:
    return state;
  }
}

export default function AnnotationContextProvider({ children }: { children: React.ReactNode}) {
  const [state, dispatch] = useReducer(AnnotationReducer, defaultState);
  return (
    <AnnotationContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AnnotationContext.Provider>
  );
}
