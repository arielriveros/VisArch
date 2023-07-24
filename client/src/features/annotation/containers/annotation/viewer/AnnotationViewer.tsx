import { Canvas } from '@react-three/fiber';
import { Group } from 'three';
import './AnnotationViewer.css';

type AnnotationViewerProps = {
	mesh: Group | null;
}

export default function AnnotationViewer(props: AnnotationViewerProps) {
	const { mesh } = props;

	return (
		<div className='annotation-viewer-container'>
			<Canvas camera={{position: [0, 1, 1]}} >
				<ambientLight />
				<color attach="background" args={['black']} />
				<pointLight position={[10, 10, 10]} />
				{mesh && <primitive object={mesh} />}
			</Canvas>
		</div>
	)
}
