import { useEffect, useState } from 'react';
import { PatternEntity } from '../../../../api/ModelTypes'
import { useTaskContext } from '../../hooks/useTask';
import './EntityItem.css'

type EntityItemProps = {
    entity: PatternEntity;
	archetypeName: string;
}

export default function EntityItem(props: EntityItemProps) {

	const { selectedEntity, dispatch: dispatchTask} = useTaskContext();
	const [selected, setSelected] = useState<boolean>(false);
	const [properties, setProperties] = useState<{orientation: number, scale: number, reflection: boolean}>({
		orientation: props.entity.orientation,
		scale: props.entity.scale,
		reflection: props.entity.reflection
	});

	const onClickDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		dispatchTask({ type: 'SET_SELECTED_INDICES', payload: []});
		dispatchTask({ type: 'REMOVE_PATTERN_ENTITY', payload: { patternEntityName: props.entity.nameId }});
		dispatchTask({ type: 'SELECT_PATTERN_ENTITY', payload: null});
	}

	const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		dispatchTask({ type: 'SELECT_PATTERN_ENTITY', payload: { patternEntityName: props.entity.nameId, patternArchetypeName: props.archetypeName }});
		dispatchTask({ type: 'SET_SELECTED_INDICES', payload: props.entity.faceIds});
	}

	useEffect(() => {
		setSelected(selectedEntity ? selectedEntity.nameId === props.entity.nameId : false);
	}, [selectedEntity]);

	useEffect(() => {
		dispatchTask({ type: 'UPDATE_PATTERN_ENTITY_PROPERTIES', payload: {
			patternArchetypeName: props.archetypeName,
			patternEntityName: props.entity.nameId,
			entityProperties: properties
		}});
	}, [properties]);

    return (
		<div className={selected ? 'entity-item-selected' : 'entity-item'}>
			<div className='entity-item-info' onClick={onClick}>
				<div>
					{props.entity.nameId}
				</div>
				<div>
					<button className='delete-entity' onClick={onClickDelete}>
						X
					</button>
				</div>
			</div>
			{ selected &&
			<div>
				<input type="range" min="0" max="360" value={properties.orientation} onChange={(e) => setProperties({...properties, orientation: parseInt(e.target.value)})}/>
				<input type="range" min="0" max="1" step="0.01" value={properties.scale} onChange={(e) => setProperties({...properties, scale: parseFloat(e.target.value)})}/>
				<input type="checkbox" checked={properties.reflection} onChange={(e) => setProperties({...properties, reflection: e.target.checked})}/>
			</div>
			}
		</div>
    )
}
