
import './App.css';
import Signup from './components/Signup';
import Homepage from './components/Homepage';
import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import {useEffect } from "react";


function App() {


  return (
    <div >
   <Router>
    <Routes>
     <Route path="/" element={<Signup/>}/>
     <Route path="/homepage" element={<Homepage/>} />
    </Routes>
   </Router>
    </div>
  );
}

export default App;