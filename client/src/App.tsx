import MeshList from './containers/meshList/MeshList';
import Navbar from './components/navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';

function App(): JSX.Element {

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/meshes" element={<MeshList />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;