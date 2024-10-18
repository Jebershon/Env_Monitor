import { Route,Routes } from 'react-router-dom';
import Signin from './Components/Authorization/Signin';
import Signup from './Components/Authorization/profile.jsx';
import Home from './Components/Layout/Home.jsx';
import Env_Data from './Components/Functional_Layout/Env_Data.jsx';
import Error from './Components/Functional_Layout/Error404.jsx';
function App() {
  return (
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/Signin' element={<Signin/>}></Route>
      <Route path='/profile' element={<Signup/>}></Route>
      <Route path='/Env_View' element={<Env_Data/>}></Route>
      <Route path='*' element={<Error/>}></Route>
    </Routes>
  );
}

export default App;
