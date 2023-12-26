import { useEffect, useState } from 'react';
import { PatternEntity } from '../../../../common/api/ModelTypes'
import { useTaskContext } from '../../hooks/useTask';
import './EntityItem.css'
import Button from 'common/components/button/Button';

type EntityItemProps = {
    entity: PatternEntity;
	archetypeName: string;
}

export default function EntityItem(props: EntityItemProps) {

	const { selectedEntity, showPropertyController, dispatch: dispatchTask} = useTaskContext();
	const [selected, setSelected] = useState<boolean>(false);

	const onClickEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
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
					{props.entity.isArchetype ? 'Archetype' : 'Instance'}
				</div>
				<div>
					<Button text={'Edit'} class='small' onClick={onClickEdit} />
				</div>
			</div>
		</div>
    )
}
