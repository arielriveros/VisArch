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

    const ADD_PATTERN_ARCHETYPE = ( name: string | null = null, broadcast: boolean = false ) => {
        const patName = name ? name : randomName('pat', 10000);

        taskDispatch({ type: 'ADD_PATTERN_ARCHETYPE', payload: { patternArchetypeName: patName}});
        if (broadcast) emit('ADD_PATTERN_ARCHETYPE', patName);
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

    return {
        ADD_PATTERN_ARCHETYPE,
        ADD_PATTERN_ENTITY
    };
}