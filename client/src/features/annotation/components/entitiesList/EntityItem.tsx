import { useEffect, useState } from 'react';
import { PatternEntity } from '../../../../api/ModelTypes'
import { useTaskContext } from '../../hooks/useTask';
import './EntityItem.css'

type EntityItemProps = {
    entity: PatternEntity;
	archetypeName: string;
}

export default function EntityItem(props: EntityItemProps) {

	const { selectedEntity, showPropertyController, dispatch: dispatchTask} = useTaskContext();
	const [selected, setSelected] = useState<boolean>(false);

	const onClickEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
		/* e.stopPropagation(); */
		dispatchTask({ type: 'SELECT_PATTERN_ENTITY', payload: { patternEntityName: props.entity.nameId, patternArchetypeName: props.archetypeName }});
		dispatchTask({ type: 'SET_SHOW_PROPERTY_CONTROLLER', payload: true });
	}

	const onMouseOver = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (showPropertyController) return;
		dispatchTask({ type: 'SELECT_PATTERN_ENTITY', payload: { patternEntityName: props.entity.nameId, patternArchetypeName: props.archetypeName }});
	}

	useEffect(() => {
		setSelected(selectedEntity ? selectedEntity.nameId === props.entity.nameId : false);
	}, [selectedEntity]);

    return (
		<div className={selected ? 'entity-item-selected' : 'entity-item'} onMouseOver={onMouseOver}>
			<div className='entity-item-info'>
				<div>
					{props.entity.nameId}
				</div>
				<div>
					<button className='edit-entity' onClick={onClickEdit}>
						Edit
					</button>
				</div>
			</div>
		</div>
    )
}
