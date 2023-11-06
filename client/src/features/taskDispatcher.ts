import { useTaskContext } from "./annotation/hooks/useTask";
import { useSocket } from "./socket/hooks/useSocket";

export default function useTaskDispatcher() {
    const { dispatch: taskDispatch } = useTaskContext();
    const { emit } = useSocket();

    function randomName(indexName: string, max: number): string {
        let value = Math.floor(Math.random() * max);
        let name = `${indexName}-${value}`;

        return name;
    }

    const ADD_PATTERN_ARCHETYPE = (name: string | null = null, broadcast: boolean = false) => {
        const patName = name ? name : randomName('pat', 10000);

        taskDispatch({ type: 'ADD_PATTERN_ARCHETYPE', payload: { patternArchetypeName: patName}});
        if (broadcast) emit('ADD_PATTERN_ARCHETYPE', patName);
    }

    const REMOVE_PATTERN_ARCHETYPE = (name: string, broadcast: boolean = false) => {
        taskDispatch({ type: 'REMOVE_PATTERN_ARCHETYPE', payload: { patternArchetypeName: name}});
        if (broadcast) emit('REMOVE_PATTERN_ARCHETYPE', name);
    }

    const ADD_PATTERN_ENTITY = (archetypeName: string, indices: number[], name: string | null = null, broadcast: boolean = false) => {
        const entName = name && !broadcast ? name : randomName('ent', 10000);

        const payload = {
            name: entName,
            archetypeName: archetypeName,
            patternIndices: indices
        }
        taskDispatch({ type: 'ADD_PATTERN_ENTITY', payload});
        if(broadcast) emit('ADD_PATTERN_ENTITY', payload);
    }

    const REMOVE_PATTERN_ENTITY = (archetypeName: string, entityName: string, broadcast: boolean = false) => {
        const payload = {
            patternArchetypeName: archetypeName,
            patternEntityName: entityName
        }
        console.log("Dispatch", payload);
        taskDispatch({ type: 'REMOVE_PATTERN_ENTITY', payload});
        if(broadcast) emit('REMOVE_PATTERN_ENTITY', payload);
    }

    const UPDATE_PATTERN_ENTITY_PROPERTIES = (archetypeName: string, entityName: string, properties: any, broadcast: boolean = false) => {
        const payload = {
            patternArchetypeName: archetypeName,
            patternEntityName: entityName,
            entityProperties: properties
        }
        taskDispatch({ type: 'UPDATE_PATTERN_ENTITY_PROPERTIES', payload});
        if(broadcast) emit('UPDATE_PATTERN_ENTITY_PROPERTIES', payload);
    }

    return {
        ADD_PATTERN_ARCHETYPE,
        REMOVE_PATTERN_ARCHETYPE,
        ADD_PATTERN_ENTITY,
        REMOVE_PATTERN_ENTITY,
        UPDATE_PATTERN_ENTITY_PROPERTIES
    };
}