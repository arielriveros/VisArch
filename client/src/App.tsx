import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import { useEffect } from 'react';
import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from 'three-mesh-bvh';
import Navbar from './components/navbar/Navbar';
import Home from './pages/Home/Home';
import Projects from './pages/Projects/Projects';
import ProjectDetails from './pages/Projects/ProjectDetails';
import AnnotateTask from './pages/AnnotateTask/AnnotateTask';
import * as THREE from 'three';

export default function App(): JSX.Element {
	const { user } = useAuthContext();

	const loadExtensions = () => {
		// Add BVH acceleration to raycasting
		THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
		THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
		THREE.Mesh.prototype.raycast = acceleratedRaycast;
	}

	useEffect(() => {
		loadExtensions();
	}, []);

	return (
		<div className="App">
		<BrowserRouter>
			<Navbar />
			<div className="content">
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/projects" element={ user ? <Projects /> : <Navigate to="/" />} />
				<Route path="/projects/:id" element={ user ? <ProjectDetails /> : <Navigate to="/" />} />
				<Route path="/task/:id" element={ user ? <AnnotateTask /> : <Navigate to="/" />} />
			</Routes>
			</div>
		</BrowserRouter>
		</div>
	);
}