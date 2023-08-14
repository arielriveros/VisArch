import { PatternEntity } from '../../../../api/ModelTypes'
import { useTaskContext } from '../../hooks/useTask';
import './EntityItem.css'

type EntityItemProps = {
    entity: PatternEntity;
}

export default function EntityItem(props: EntityItemProps) {

	const {task, dispatch: taskDispatcher} = useTaskContext();

	const onClickDelete = () => {
		taskDispatcher({ type: 'REMOVE_PATTERN_ENTITY', payload: { patternEntityName: props.entity.nameId }});
	}

    return (
		<div className='entity-item'>
			<div className='entity-item-info'>
				<div>
					{props.entity.nameId}
				</div>
				<div>
					<button className='delete-entity' onClick={onClickDelete}>
						X
					</button>
				</div>
			</div>
		</div>
    )
}
