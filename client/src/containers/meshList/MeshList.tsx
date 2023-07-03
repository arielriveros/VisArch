import { useEffect, useState } from 'react'
import List from '../../components/list/List'
import { ListItemProps } from '../../components/listItem/ListItem';
import './MeshList.css'
import MeshInput from '../meshInput/MeshInput';
import PreviewRenderer from '../../components/preview/PreviewRenderer';
import PreviewModel from '../../components/preview/PreviewModel';

interface ModelSource {
    obj: string;
    mtl: string;
}

export default function MeshList(): JSX.Element {

    const meshUrl = `http://localhost:5000/meshFiles/0027/0027.obj`;
    const materialUrl = 'http://localhost:5000/meshFiles/0027/0027.mtl';

    let [modelSrc, setModelSrc] = useState<ModelSource>({
        obj: meshUrl,
        mtl: materialUrl
    });

    const [meshesList, setMeshesList] = useState<ListItemProps[]>();

    useEffect(() => {
        getMeshesNames();
    }, []);

    useEffect(() => {
        console.log(modelSrc);
    }, [modelSrc]);

    function getMeshesNames() {
        fetch(`http://localhost:5000/api/meshes` )
            .then(response => response.json())
            .then(data => {
                console.log(data);
                let meshes: ListItemProps[] = [];
                for( let m of data.meshes){
                    meshes.push({text: m.name, onClick: ()=>handleModelSrc(
                        m.vertexData,
                        m.materialData
                    )});
                }
                setMeshesList(meshes);
            })
            .catch(error => console.error(error));
    };
 
    function handleModelSrc(obj: string, mtl: string) {
        console.log(obj, mtl);
        setModelSrc({
            obj: obj,
            mtl: mtl
        });
    }

    const model = <PreviewModel obj={meshUrl} mtl={materialUrl} />;

    return (
        <div className="mesh-list">
            <div className="mesh-list-container">
                {meshesList ? <List items={meshesList}/> : <p>loading...</p>}
                <MeshInput />
            </div>
            <PreviewRenderer model={model}/>
        </div>
    )
}