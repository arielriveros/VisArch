import { useEffect, useState } from 'react'
import { PatternArchetype } from '../../../../api/ModelTypes'
import { useTaskContext } from '../../hooks/useTask';
import ArchetypesItem from './ArchetypesItem'
import useTaskDispatcher from '../../../taskDispatcher';

export default function ArchetypesList() {
    const { task } = useTaskContext();
    const [archetypes, setArchetypes] = useState<PatternArchetype[]>([]);
    const { ADD_PATTERN_ARCHETYPE } = useTaskDispatcher();

    useEffect(() => {
        if (task && task.annotations) 
            setArchetypes(task.annotations);
        else
            setArchetypes([]);

    }, [task?.annotations]);

    return (
        <div className='archetypes-list'>
            {archetypes.map((archetype, index) => (
                <ArchetypesItem
                    key={index}
                    archetype={archetype}
                />
            ))}
            <button className='add-archetype' onClick={()=>ADD_PATTERN_ARCHETYPE(null, true)}>
                Add Archetype
            </button>
        </div>
        
    )
}
