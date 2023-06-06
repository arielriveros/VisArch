import * as THREE from 'three';
import { useState, useEffect, useRef } from 'react';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'

export default function Renderer(): JSX.Element{
    const [object, setObject] = useState<THREE.Object3D>(new THREE.Object3D);
    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {

        if (!mountRef.current) return;
    
        let scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 3000 );
        camera.position.z = 100;
        let renderer = new THREE.WebGLRenderer();
        let ambientLight = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
        scene.add( ambientLight );
              
        // Add the renderer to the DOM
        mountRef.current.appendChild(renderer.domElement);
        renderer.setSize( mountRef.current.clientWidth, mountRef.current.clientHeight );
        renderer.setClearColor( 0xFFFFFF, 1 );
        
        // import .obj file from public folder
        const objLoader = new OBJLoader();
        const mtlLoader = new MTLLoader();

        mtlLoader.load('./meshes/0027.obj.mtl', (materials) => {
            materials.preload();
            objLoader.setMaterials(materials);
            objLoader.load( './meshes/0027.obj', (mesh) => {
                setObject(mesh);
                scene.add( object );
            } );
        });
            
        const animate = function () {
          requestAnimationFrame( animate );
          object.rotation.y += 0.005;
          renderer.render( scene, camera );
        };
        
        animate();
        return () => {
            mountRef.current?.removeChild(renderer.domElement);
          };
        }, []);
    return (
        <div className="Renderer">
            <h3>Renderer</h3>
            <div ref={mountRef}></div>
        </div>
    );
}