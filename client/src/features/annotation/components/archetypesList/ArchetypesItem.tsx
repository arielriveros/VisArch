import { useEffect, useState } from 'react'
import { PatternArchetype } from '../../../../common/api/ModelTypes';
import { useTaskContext } from '../../hooks/useTask';
import useTaskDispatcher from '../../../taskDispatcher';
import './ArchetypesItem.css'

type ArchetypesItemProps = {
	archetype: PatternArchetype;
}

export default function ArchetypesItem(props: ArchetypesItemProps) {

    const { selectedArchetype, dispatch: dispatchTask } = useTaskContext();
    const { REMOVE_PATTERN_ARCHETYPE } = useTaskDispatcher();
    const [selected, setSelected] = useState<boolean>(false);

    const onClick = () => {
        selectArchetypeHandler(props.archetype.nameId);
        dispatchTask({ type: 'SELECT_PATTERN_ENTITY', payload: null});
    }

    const onDelete = (name: string) => {
        REMOVE_PATTERN_ARCHETYPE(name, true);
    }

    const selectArchetypeHandler = (name: string) => {
        dispatchTask({ type: 'SELECT_PATTERN_ARCHETYPE', payload: { patternArchetypeName: name }});
    }

    useEffect(() => {
        setSelected(selectedArchetype ? selectedArchetype.nameId === props.archetype.nameId : false);
    }, [selectedArchetype]);

    return (
        <div className={selected ? 'archetype-item-selected' : 'archetype-item'} onClick={onClick}>
            <div className='archetype-item-info'>
                <div>
                    {props.archetype.label !== '' ? props.archetype.label : 'Unlabeled'}
                </div>
            </div>
            
		</div>
    )
}
