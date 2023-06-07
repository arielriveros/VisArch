import { useState, useEffect } from 'react';
import { API_URL } from '../../App';
import { ModelSource } from '../renderer/Renderer';
import MeshListItem from '../mesh-list-item/MeshListItem';

interface MeshListProps {
    setModelCallback: (newModelSrc: ModelSource) => void;
}

export default function MeshList(props: MeshListProps): JSX.Element {
    const [meshesList, setMeshesList] = useState([]);

    useEffect(() => {
        getMeshesNames();
    }, []);

    const getMeshesNames = () => {
        fetch(`${API_URL}/meshes` )
            .then(response => response.json())
            .then(data => {
                // get only name from data
                const names = data.meshes.map((mesh: any) => mesh.name);
                setMeshesList(names);
            })
            .catch(error => console.error(error));
    };

    return (
        <div className="MeshList">
        <h3>Meshes</h3>
        {meshesList.map((meshName: string) => (
            <MeshListItem name={meshName} key={meshName} setModelCallback={props.setModelCallback}/>
        ))}
        </div>
    );
}
