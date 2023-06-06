import MeshList from './components/mesh-list/MeshList';
import Renderer from './components/renderer/Renderer';

export const API_BASE = 'http://localhost:5000';

function App(): JSX.Element {
  return (
    <div className="App">
      <h1>VisArch</h1>
      <div className="content">
        <MeshList />
        <Renderer />
      </div>
    </div>
  );
}

export default App;