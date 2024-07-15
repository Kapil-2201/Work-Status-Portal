// import Sidebar from "./Components/Sidebar";
// import Staffs1 from "./Components/Staffs1";
// import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Staffs} from "./pages/Staffs"
import { Dashboard } from "./pages/Dashboard";
import { Tasks } from "./pages/Tasks";
import { Sidebar } from "./pages/Sidebar";
function App() {

  return (
    
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Sidebar />}>
          <Route index element={<Dashboard />} />
          <Route path="staffs" element={<Staffs />} />
          <Route path="tasks" element={<Tasks />} />
          
        </Route>
      </Routes>  
    </BrowserRouter>
    
    
  
     
  );
}
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />);

export default App;  