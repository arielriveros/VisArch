import React, { useEffect, useState } from 'react'
import { PatternArchetype } from '../../../../api/ModelTypes';
import './ArchetypesItem.css'

type ArchetypesItemProps = {
	archetype: PatternArchetype;
    onClick: (archetypeName: string) => void;
    onDelete: (archetypeName: string) => void;
    onColorChange: (archetypeName: string, color: string) => void;
}

export default function ArchetypesItem(props: ArchetypesItemProps) {

    const onChangeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onColorChange(props.archetype.name, e.target.value);
    }

    return (
        <div className='archetype-item' onClick={()=>props.onClick(props.archetype.name)}>
            <div>
                {props.archetype.name}
                <input type="color" value={props.archetype.color} onChange={onChangeColor}/>
            </div>
            <div>
                <button className='delete-archetype' onClick={()=>props.onDelete(props.archetype.name)}>
                    X
                </button>
            </div>
		</div>
    )
}
