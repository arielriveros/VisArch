import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import { useEffect } from 'react';
import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from 'three-mesh-bvh';
import { BufferGeometry, Mesh } from 'three';
import Navbar from './components/navbar/Navbar';
import Content from './components/content/Content';
import Home from './pages/Home/Home';
import Projects from './pages/Projects/Projects';
import AnnotateTask from './pages/AnnotateTask/AnnotateTask';
import ProjectDetails from './pages/projectDetails/ProjectDetails';
import ProjectSettings from './pages/ProjectSettings/ProjectSettings';

export default function App(): JSX.Element {
	const { user } = useAuthContext();

	const loadExtensions = () => {
		// Add BVH acceleration to raycasting
		BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
		BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
		Mesh.prototype.raycast = acceleratedRaycast;
	}

	useEffect(() => {
		loadExtensions();
	}, []);

	return (
		<div className="App">
		<BrowserRouter>
			<Navbar />
			<Content>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/projects" element={ user ? <Projects /> : <Navigate to="/" />} />
					<Route path="/projects/:id" element={ user ? <ProjectDetails /> : <Navigate to="/" />} />
					<Route path="/projects/:id/settings" element={ user ? <ProjectSettings /> : <Navigate to="/" />} />
					<Route path="/task/:id" element={ user ? <AnnotateTask /> : <Navigate to="/" />} />
				</Routes>
			</Content>
		</BrowserRouter>
		</div>
	);
}