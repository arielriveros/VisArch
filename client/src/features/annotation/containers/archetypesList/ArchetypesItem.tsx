import React from 'react'

type ArchetypesItemProps = {
	name: string
}

export default function ArchetypesItem(props: ArchetypesItemProps) {
    return (
        <div className='archetype-item'>
			{props.name}
		</div>
    )
}
