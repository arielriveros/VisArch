import MeshList from './components/mesh-list/MeshList';

export const API_BASE = 'http://localhost:5000';

function App(): JSX.Element {
  return (
    <div className="App">
      <h1>VisArch</h1>
      <MeshList />
    </div>
  );
}

export default App;