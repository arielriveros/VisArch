import { useEffect, useState } from 'react';
import { PatternEntity } from '../../../../common/api/ModelTypes'
import { useTaskContext } from '../../hooks/useTask';
import './EntityItem.css'

type EntityItemProps = {
    entity: PatternEntity;
	archetypeName: string;
}

export default function EntityItem(props: EntityItemProps) {

	const { selectedEntity, dispatch: dispatchTask} = useTaskContext();
	const [selected, setSelected] = useState<boolean>(false);

	const onClick = (e: React.MouseEvent< HTMLDivElement, MouseEvent >) => {
		dispatchTask({ 
			type: 'SELECT_PATTERN_ENTITY',
			payload: selected ? null : { patternEntityName: props.entity.nameId, patternArchetypeName: props.archetypeName }
		});
	}

	const onMouseOver = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (selected) return;
		dispatchTask({ type: 'HOVER_PATTERN_ENTITY', payload: { patternEntityName: props.entity.nameId, patternArchetypeName: props.archetypeName }});
	}

	const onMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		dispatchTask({ type: 'HOVER_PATTERN_ENTITY', payload: null});
	}

	useEffect(() => {
		setSelected(selectedEntity ? selectedEntity.nameId === props.entity.nameId : false);
	}, [selectedEntity]);

    return (
		<div className={selected ? 'entity-item-selected' : 'entity-item'} onClick={onClick} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
			<div className='entity-item-info'>
				<div>
					{props.entity.isArchetype ? 'Archetype' : 'Instance'}
				</div>
				<div>
					{props.entity.nameId.replace('ent-','')}
				</div>
			</div>
		</div>
    )
}
