import MeshList from './containers/meshList/MeshList';
import Navbar from './containers/navbar/Navbar';

function App(): JSX.Element {

  return (
    <div className="App">
      <Navbar />
      <div className="content">
        <MeshList />
      </div>
    </div>
  );
}

export default App;