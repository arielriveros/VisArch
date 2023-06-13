import MeshList from './containers/meshList/MeshList';

function App(): JSX.Element {

  return (
    <div className="App">
      <h1>VisArch</h1>
      <div className="content">
        <MeshList />
      </div>
    </div>
  );
}

export default App;