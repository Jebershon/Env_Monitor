import { useNavigate } from "react-router-dom";

function Home() {
    const nav = useNavigate();
    return (
      <div>
        <h1>Home</h1>
        <button onClick={()=>{nav("/Signin")}}>Signin</button>
        <button onClick={()=>{nav("/Signup")}}>Signin</button>
      </div>
    );
  }
  
  export default Home;