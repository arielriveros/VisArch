import { useEffect, useState } from 'react'
import { PatternArchetype } from '../../../../api/ModelTypes'
import { useTaskContext } from '../../hooks/useTask';
import ArchetypesItem from './ArchetypesItem'

export default function ArchetypesList() {
    const { task, dispatch: dispatchTask } = useTaskContext();
    const [archetypes, setArchetypes] = useState<PatternArchetype[]>([]);

    useEffect(() => {
        if (task && task.archetypes) 
            setArchetypes(task.archetypes);
        else
            setArchetypes([]);

    }, [task?.archetypes]);

    const addArchetype = () => {
        dispatchTask({ type: 'ADD_PATTERN_ARCHETYPE', payload: null});
    }

    return (
        <div className='archetypes-list'>
            {archetypes.map((archetype, index) => (
                <ArchetypesItem
                    key={index}
                    archetype={archetype}
                />
            ))}
            <button className='add-archetype' onClick={addArchetype}>
                Add Archetype
            </button>
        </div>
        
    )
}
