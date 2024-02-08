import { MemoryRouter as Router, Routes, Route, Navigate, Link,  } from 'react-router-dom';
import { useAuthContext } from 'features/authentication/hooks/useAuthContext';
import { useEffect } from 'react';
import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from 'three-mesh-bvh';
import { BufferGeometry, Mesh } from 'three';
import Navbar from 'common/components/navbar/Navbar';
import Content from 'common/components/content/Content';
import Home from 'pages/Home/Home';
import Projects from 'pages/Projects/Projects';
import AnnotateTask from 'pages/AnnotateTask/AnnotateTask';
import ProjectDetails from 'pages/Projects/ProjectDetails/ProjectDetails';
import ProjectSettings from 'pages/Projects/ProjectSettings/ProjectSettings';
import ProfileCard from 'features/authentication/containers/profileCard/ProfileCard';

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
		<Router>
			<Navbar>
				<Link className='navbar-link' to="/">Home</Link>
                <Link className='navbar-link' to="/projects">Projects</Link>
                <ProfileCard/>
			</Navbar>
			<Content>
				<Routes>
					{/*  Home  */}
					<Route path="/" element={<Home />} />

					{/*  Projects  */}
					<Route path="/projects" element={ user ? <Projects /> : <Navigate to="/" />} />
					<Route path="/projects/:id" element={ user ? <ProjectDetails /> : <Navigate to="/" />} />
					<Route path="/projects/:id/settings" element={ user ? <ProjectSettings /> : <Navigate to="/" />} />

					{/*  Tasks Annotation */}
					<Route path="/task/:id" element={ user ? <AnnotateTask /> : <Navigate to="/" />} />
				</Routes>
			</Content>
		</Router>
		</div>
	);
}