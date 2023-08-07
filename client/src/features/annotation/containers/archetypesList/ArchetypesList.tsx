import React, { useEffect, useState } from 'react'
import ArchetypesItem from './ArchetypesItem'
import { PatternArchetype } from '../../../../api/ModelTypes'
import { useTaskContext } from '../../hooks/useTask';

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

    const selectArchetype = (name: string) => {
        dispatchTask({ type: 'SELECT_PATTERN_ARCHETYPE', payload: { patternArchetypeName: name }});
    }

    const deleteArchetype = (name: string) => {
        dispatchTask({ type: 'REMOVE_PATTERN_ARCHETYPE', payload: { patternArchetypeName: name }});
    }

    return (
        <div className='archetypes-list'>
            {archetypes.map((archetype, index) => (
                <ArchetypesItem
                    key={index}
                    name={archetype.name}
                    onClick={selectArchetype}
                    onDelete={deleteArchetype}
                />
            ))}
            <button className='add-archetype' onClick={addArchetype}>
                Add Archetype
            </button>
        </div>
        
    )
}
