import React, { useEffect, useState } from 'react'
import { PatternArchetype } from '../../../../api/ModelTypes';
import { useTaskContext } from '../../hooks/useTask';
import EntitiesList from '../entitiesList/EntitiesList';
import './ArchetypesItem.css'
import { useIndicesContext } from '../../hooks/useIndices';

type ArchetypesItemProps = {
	archetype: PatternArchetype;
}

export default function ArchetypesItem(props: ArchetypesItemProps) {

    const { task, selectedArchetype, dispatch: dispatchTask } = useTaskContext();
    const { dispatch: dispatchIndices } = useIndicesContext();
    const [selected, setSelected] = useState<boolean>(false);

    const onChangeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
        changeColorHandler(props.archetype.nameId, e.target.value);
    }

    const onClick = () => {
        selectArchetypeHandler(props.archetype.nameId);
    }

    const onDelete = (name: string) => {
        deleteArchetypeHandler(name);
    }

    const selectArchetypeHandler = (name: string) => {
        dispatchTask({ type: 'SELECT_PATTERN_ARCHETYPE', payload: { patternArchetypeName: name }});
    }

    const deleteArchetypeHandler = (name: string) => {
        dispatchTask({ type: 'REMOVE_PATTERN_ARCHETYPE', payload: { patternArchetypeName: name }});
        dispatchIndices({ type: 'SET_SELECTED_INDICES', payload: []});
    }

    const changeColorHandler = (name: string, color: string) => {
        dispatchTask({ type: 'UPDATE_SELECTED_PATTERN_ARCHETYPE', payload: { patternArchetypeName: name, color }});
    }

    useEffect(() => {
        setSelected(selectedArchetype ? selectedArchetype.nameId === props.archetype.nameId : false);
    }, [selectedArchetype]);

    return (
        <div className={selected ? 'archetype-item-selected' : 'archetype-item'} onClick={onClick}>
            <div className='archetype-item-info'>
                <div>
                    {props.archetype.nameId}
                    <input type="color" value={props.archetype.color} onChange={onChangeColor}/>
                </div>
                <div>
                    <button className='delete-archetype' onClick={()=>onDelete(props.archetype.nameId)}>
                        X
                    </button>
                </div>
            </div>
            { selected && 
            <div>
                <EntitiesList />
            </div>
            }
            
		</div>
    )
}
