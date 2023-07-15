import { useEffect, useState } from 'react'
import List from '../../components/list/List'
import { ListItemProps } from '../../components/listItem/ListItem';
import MeshInput from '../meshInput/MeshInput';
import PreviewRenderer from '../../components/preview/PreviewRenderer';
import { config } from '../../utils/config';
import './MeshList.css'

export default function MeshList(): JSX.Element {
    let [modelSrc, setModelSrc] = useState<string>("");

    const [meshesList, setMeshesList] = useState<ListItemProps[]>();

    useEffect(() => {
        getMeshesNames();
    }, []);

    function getMeshesNames() {
        fetch(`${config.API_URL}/meshes` )
            .then(response => response.json())
            .then(data => {
                let meshes: ListItemProps[] = [];
                for(let m of data.meshes)
                    meshes.push({text: m.name, onClick: ()=>handleModelSrc(m.modelPath)});
                setMeshesList(meshes);
            })
            .catch(error => console.error(error));
    };
  
    function handleModelSrc(modelPath: string) {
        setModelSrc(`${config.BACKEND_URL}/${modelPath}`);
    }
    

    return (
        <div className="mesh-list">
            <div className="mesh-list-container">
                {meshesList ? <List items={meshesList}/> : <p>loading...</p>}
                <MeshInput />
            </div>
            <PreviewRenderer source={modelSrc}/>
        </div>
    )
}