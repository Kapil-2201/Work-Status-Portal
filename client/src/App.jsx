// import React from 'react'
// import { CreateTasks } from './pages/CreateTasks';
//  const App = () => {
//   return (
//     <>
//     <CreateTasks />
//     </>
//   );
// }
// export default App;

// import Sidebar from "./Components/Sidebar";
// import Staffs1 from "./Components/Staffs1";
// import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Staffs} from "./pages/Staffs"
import { Dashboard } from "./pages/Dashboard";
import { Tasks } from "./pages/Tasks";
import { Sidebar } from "./pages/Sidebar";
import { WorkersAttendance } from "./pages/WorkersAttendance";
import {LoginPage} from "./pages/LoginPage"
import CreateTasks from "./pages/CreateTasks";
import CreateStaffs from "./pages/CreateStaffs";
function App() {

  return (
    
    <BrowserRouter>
    <Routes>
          <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Sidebar />}>
          <Route index element={<Dashboard />} />
          <Route path="staffs" element={<Staffs />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="/create-task" element={<CreateTasks />} />
          <Route path="/create-staff" element={<CreateStaffs />} />
          <Route path="/attendance" element={<WorkersAttendance />} />
        </Route>
      </Routes>  
    </BrowserRouter>
    
    
  
     
  );
}
// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />);

export default App;  