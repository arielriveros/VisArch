import React from 'react'

type SidebarProps = {
	children: React.ReactNode
}

export default function TaskSidebar(props: SidebarProps) {
  	return (
		<div className='task-sidebar'>
			{props.children}
		</div>
  )
}
