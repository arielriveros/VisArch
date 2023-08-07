import React from 'react'
import './ArchetypesItem.css'

type ArchetypesItemProps = {
	name: string;
    onClick: (archetypeName: string) => void;
}

export default function ArchetypesItem(props: ArchetypesItemProps) {
    return (
        <div className='archetype-item' onClick={()=>props.onClick(props.name)}>
			{props.name}
		</div>
    )
}
