import React from 'react'
import './CrossHairs.css';

type CrossHairsProps = {
	resolution: number;
}

export default function CrossHairs(props: CrossHairsProps) {
	const { resolution } = props;
	return (
		<div className="cross-hairs">
			<svg width="100%" height="100%" viewBox={`0 0 ${resolution*2} ${resolution*2}`} preserveAspectRatio="none">
				<line x1="0" y1={resolution} x2={2*resolution} y2={resolution} stroke="gray" strokeWidth="0.5" />
				<line x1={resolution} y1="0" x2={resolution} y2={2*resolution} stroke="gray" strokeWidth="0.5" />
				<circle cx={resolution} cy={resolution} r={resolution/20} stroke="orange" strokeWidth="0.5" fill="none" />
			</svg>
		</div>
	)
}
