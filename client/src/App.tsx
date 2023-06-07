import { useState } from 'react';
import MeshList from './components/mesh-list/MeshList';
import Renderer, { ModelSource } from './components/renderer/Renderer';

function App(): JSX.Element {
  const meshUrl = `http://localhost:5000/meshFiles/0027/0027.obj`;
  const materialUrl = 'http://localhost:5000/meshFiles/0027/0027.obj.mtl';

  let [modelSrc, setModelSrc] = useState<ModelSource>({
    obj: meshUrl,
    mtl: materialUrl,
    tex: ""
  });

  function setModel(newModelSrc: ModelSource) {
    console.log(newModelSrc);
    setModelSrc(newModelSrc);
  }

  return (
    <div className="App">
      <h1>VisArch</h1>
      <div className="content">
        <MeshList setModelCallback={setModel}/>
        <Renderer modelSource={modelSrc} />
      </div>
    </div>
  );
}

export default App;