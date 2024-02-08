import { useEffect, useState } from 'react'
import { PatternArchetype } from 'common/api/ModelTypes'
import { useTaskContext } from 'features/annotation/hooks/useTask';
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
        <div>{ archetypes.length !== 0 ? 
            archetypes.map((archetype, index) => (
                <ArchetypesItem
                    key={index}
                    archetype={archetype}
                />
            ))
            : <div>No archetypes</div>
        }
        </div>
        
    )
}
