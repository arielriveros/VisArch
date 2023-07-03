import { useEffect, useState } from 'react'
import List from '../../components/list/List'
import { ListItemProps } from '../../components/listItem/ListItem';
import './MeshList.css'
import MeshInput from '../meshInput/MeshInput';
import PreviewRenderer from '../../components/preview/PreviewRenderer';
import PreviewModel from '../../components/preview/PreviewModel';

export interface ModelSource {
    obj: string;
    mtl: string;
    tex: string;
}

export default function MeshList(): JSX.Element {

    // TODO: remove this hardcoded url
    const meshUrl = `http://localhost:5000/meshFiles/0027/0027.obj`;
    const materialUrl = 'http://localhost:5000/meshFiles/0027/0027.mtl';
    const textureUrl = 'http://localhost:5000/meshFiles/0027/0027.jpg';

    let [modelSrc, setModelSrc] = useState<ModelSource>({
        obj: meshUrl,
        mtl: materialUrl,
        tex: textureUrl
    });

    const [meshesList, setMeshesList] = useState<ListItemProps[]>();

    useEffect(() => {
        getMeshesNames();
    }, []);

    function getMeshesNames() {
        fetch(`http://localhost:5000/api/meshes` )
            .then(response => response.json())
            .then(data => {
                let meshes: ListItemProps[] = [];
                for( let m of data.meshes){
                    meshes.push({text: m.name, onClick: ()=>handleModelSrc(
                        m.vertexData,
                        m.materialData,
                        m.textureData
                    )});
                }
                setMeshesList(meshes);
            })
            .catch(error => console.error(error));
    };
 
    function handleModelSrc(obj: string, mtl: string, tex: string) {
        setModelSrc({
            obj: "http://localhost:5000/"+obj,
            mtl: "http://localhost:5000/"+mtl,
            tex: "http://localhost:5000/"+tex,
        });
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