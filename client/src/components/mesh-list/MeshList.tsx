import { useState, useEffect } from 'react';
import { API_BASE } from '../../App';
import MeshListItem from '../mesh-list-item/MeshListItem';

export default function MeshList(): JSX.Element {
    const [meshesList, setMeshesList] = useState([]);

    useEffect(() => {
        getMeshesNames();
    }, []);

    const getMeshesNames = () => {
        fetch(`${API_BASE}/meshes` )
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
            <MeshListItem name={meshName} key={meshName} />
        ))}
        </div>
    );
}
