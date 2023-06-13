import { useEffect, useState } from 'react'
import List from '../../components/list/List'
import Renderer, { ModelSource } from '../../components/renderer/Renderer';
import { ListItemProps } from '../../components/listItem/ListItem';
import './MeshList.css'

export default function MeshList(): JSX.Element {

    const meshUrl = `http://localhost:5000/meshFiles/0027/0027.obj`;
    const materialUrl = 'http://localhost:5000/meshFiles/0027/0027.obj.mtl';

    let [modelSrc, setModelSrc] = useState<ModelSource>({
        obj: meshUrl,
        mtl: materialUrl,
        tex: "" 
    });

    const [meshesList, setMeshesList] = useState<ListItemProps[]>();

    useEffect(() => {
        getMeshesNames();
    }, []);

    const getMeshesNames = () => {
        fetch(`http://localhost:5000/api/meshes` )
            .then(response => response.json())
            .then(data => {
                // get only name from data
                //const meshes = data.meshes.map((mesh: ListItemProps) => mesh.name);
                let meshes: ListItemProps[] = [];
                for( let m of data.meshes){
                    meshes.push({text: m.name, onClick: dummy});
                }
                setMeshesList(meshes);
            })
            .catch(error => console.error(error));
    };
    
 
    function dummy() {
        console.log("dummy");
    }

    return (
        <div className="mesh-list">
            <div className="mesh-list-container">
                {meshesList ? <List items={meshesList}/> : <p>loading...</p>}
            </div>
            <Renderer modelSource={modelSrc}/>
        </div>
    )
}