import { useEffect, useState } from 'react'
import { PatternArchetype } from 'common/api/ModelTypes'
import { useTaskContext } from 'features/annotation/hooks/useTask';
import Button from 'common/components/button/Button';
import useTaskDispatcher from 'features/taskDispatcher';
import ArchetypesItem from './ArchetypesItem'

export default function ArchetypesList() {
    const { task } = useTaskContext();
    const [archetypes, setArchetypes] = useState<PatternArchetype[]>([]);

    useEffect(() => {
        if (task && task.annotations) 
            setArchetypes(task.annotations);
        else
            setArchetypes([]);

    }, [task?.annotations]);

    return (
        <div>
            {archetypes.map((archetype, index) => (
                <ArchetypesItem
                    key={index}
                    archetype={archetype}
                />
            ))}
        </div>
        
    )
}
