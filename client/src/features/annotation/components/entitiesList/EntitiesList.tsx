import { useEffect, useState } from 'react'
import { useTaskContext } from '../../hooks/useTask';
import { PatternEntity } from '../../../../common/api/ModelTypes';
import EntityItem from './EntityItem';

export default function EntitiesList() {
	const {task, selectedArchetype} = useTaskContext();
	const [entities, setEntities] = useState<PatternEntity[]>([]);

	useEffect(() => {
		if (selectedArchetype && selectedArchetype.entities) {
			task?.annotations?.forEach(archetype => {
				if (archetype.nameId === selectedArchetype.nameId)
					setEntities(archetype.entities);
			});
		}
		else
			setEntities([]);
	}, [task?.annotations, selectedArchetype]);

	return (
		<div>
			{entities.map((entity, index) => (
				<EntityItem
					key={index}
					entity={entity}
					archetypeName={selectedArchetype?.nameId || ''}
				/>
			))}
		</div>
	)
}
