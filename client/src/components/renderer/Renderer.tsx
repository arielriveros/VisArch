import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

export interface ModelSource {
    obj: string;
    mtl: string;
    tex: string;
}

interface RendererProps {
    modelSource: ModelSource;
}

function Renderer(props: RendererProps): JSX.Element {
    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {

        if (!mountRef.current) return;
    
        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 3000 );
        camera.position.y = 100;
        camera.position.z = 100;
        camera.lookAt(0,0,0);
        let renderer = new THREE.WebGLRenderer();
        let ambientLight = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
        scene.add( ambientLight );
        
        // Add the renderer to the DOM
        mountRef.current.appendChild(renderer.domElement);
        renderer.setSize( mountRef.current.clientWidth, mountRef.current.clientHeight );
        renderer.setClearColor( 0xAAAAAA, 1 );

        let object: THREE.Object3D;

        const animate = () => {
        if (object) {
            object.rotation.y += 0.005;
        }

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
        };

        const mtlLoader = new MTLLoader();
        mtlLoader.load(props.modelSource.mtl, (materials) => {
        materials.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(props.modelSource.obj, (mesh) => {
            object = mesh;
            scene.add(object);
            animate();
            });
        });
        
        return () => {
        mountRef.current?.removeChild(renderer.domElement);
        };

    }, []);

  return (
    <div className="renderer">
      <div ref={mountRef} />
    </div>
  );
};

export default Renderer;
