import { useState, useEffect } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { PiUsersThreeDuotone } from "react-icons/pi";
import { MdOutlineSpaceDashboard, MdTask } from "react-icons/md";
import { GrUserWorker } from "react-icons/gr";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ImCheckmark } from "react-icons/im";

export const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeBtn, setActiveBtn] = useState('btn1');
  const location = useLocation();

  // Handle window resize and check for mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setOpen(false);
      }
    };

    handleResize(); // Check on initial load
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update active button based on current path
  useEffect(() => {
    switch (location.pathname) {
      case '/tasks': setActiveBtn('btn2'); break;
      case '/create-task': setActiveBtn('btn2'); break;
      case '/staffs': setActiveBtn('btn3'); break;
      case '/create-staff': setActiveBtn('btn3'); break;
      case '/attendance': setActiveBtn('btn4'); break;
      default: setActiveBtn('btn1');
    }
  }, [location.pathname]);

  const handleBtnClick = (btn) => {
    setActiveBtn(btn);
    if (isMobile && open) {
      setOpen(false);
    }
  };

  const menuItems = [
    { id: 'btn1', path: '/', icon: <MdOutlineSpaceDashboard />, label: 'Dashboard' },
    { id: 'btn2', path: '/tasks', icon: <MdTask />, label: 'Task' },
    { id: 'btn3', path: '/staffs', icon: <GrUserWorker />, label: 'Staff' },
    { id: 'btn4', path: '/attendance', icon: <ImCheckmark />, label: 'Attendance' },
  ];

  const NavContent = () => (
    <ul className={`${isMobile ? 'flex justify-around items-center' : 'pt-2'}`}>
      {menuItems.map((item) => (
        <Link key={item.id} to={item.path}>
          <li
            className={`text-gray-300 cursor-pointer text-sm flex items-center gap-x-4 p-2 
              ${activeBtn === item.id ? 'bg-light-blue' : 'hover:bg-light-blue'}
              rounded duration-300 ${isMobile ? 'flex-col gap-y-1' : 'mt-2'}`}
            onClick={() => handleBtnClick(item.id)}
          >
            <span className={`text-2xl block ${isMobile ? 'mx-auto' : 'float-left'}`}>
              {item.icon}
            </span>
            <span className={`text-base font-medium ${!open && !isMobile && "hidden"} 
              ${isMobile ? 'text-xs' : 'flex-1'}`}>
              {item.label}
            </span>
          </li>
        </Link>
      ))}
    </ul>
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Desktop Sidebar */}
      <div className={`${!isMobile ? 'block' : 'hidden'}`}>
        <div className={`bg-dark-blue min-h-screen p-5 pt-8 
          ${open ? "w-72" : "w-20"} duration-300 fixed top-0 left-0`}>
          <BsArrowLeft
            className={`bg-white text-3xl absolute -right-3 top-9 rounded-full 
              border-2 border-dark-blue cursor-pointer ${!open && "rotate-180"} duration-300`}
            onClick={() => setOpen(!open)}
          />
          <div className="inline-flex">
            <PiUsersThreeDuotone className="text-light-blue text-4xl rounded cursor-pointer block float-left mr-2" />
            <h3 className={`text-white origin-left font-medium text-lg mt-1 duration-50 
              ${!open && "hidden"}`}>
              WORK STATUS PORTAL
            </h3>
          </div>
          <NavContent />
        </div>
        <div className={`flex-1 p-4 ${open ? 'ml-72' : 'ml-20'} duration-300`}>
          <Outlet />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className={`${isMobile ? 'flex flex-col min-h-screen' : 'hidden'}`}>
        {/* Mobile Header */}
        <div className="bg-dark-blue p-4 fixed top-0 w-full z-10">
          <div className="flex items-center">
            <PiUsersThreeDuotone className="text-light-blue text-3xl mr-2" />
            <h3 className="text-white font-medium text-lg">WORK STATUS PORTAL</h3>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 mt-16 mb-20">
          <Outlet />
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="bg-dark-blue fixed bottom-0 w-full p-2 z-10">
          <NavContent />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;