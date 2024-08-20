import { Route,Routes } from 'react-router-dom';
import Signin from './Components/Authorization/Signin';
import Signup from './Components/Authorization/Signup';
import Home from './Components/Layout/Home.jsx';
function App() {
  return (
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/Signin' element={<Signin/>}></Route>
      <Route path='/Signup' element={<Signup/>}></Route>
    </Routes>
  );
}

export default App;
