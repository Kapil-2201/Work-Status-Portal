import { useState, useEffect } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { PiUsersThreeDuotone } from "react-icons/pi";
import { MdOutlineSpaceDashboard, MdTask } from "react-icons/md";
import { GrUserWorker } from "react-icons/gr";
import { Link, Outlet, useLocation } from "react-router-dom";

export const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [activeBtn, setActiveBtn] = useState('btn1'); // Default to 'btn1'
  const location = useLocation(); // Get current location

  useEffect(() => {
    // Update activeBtn based on current path
    switch (location.pathname) {
      case '/tasks':
        setActiveBtn('btn2');
        break;
      case '/staffs':
        setActiveBtn('btn3');
        break;
      default:
        setActiveBtn('btn1');
        break;
    }
  }, [location.pathname]); // Dependency array ensures this runs when pathname changes

  const handleBtnClick = (btn) => {
    setActiveBtn(btn);
  };

  return (
    <>
      <div className="flex">
        {/* Sidebar section */}
        <div
          className={`bg-dark-blue h-screen p-5 pt-8 ${
            open ? "w-72" : "w-20"
          } duration-300 relative`}
        >
          <BsArrowLeft
            className={`bg-white text-3xl absolute -right-3 top-9 rounded-full border-2 border-dark-blue cursor-pointer ${
              !open && "rotate-180 duration-300"
            }`}
            onClick={() => setOpen(!open)}
          />
          <div className="inline-flex">
            <PiUsersThreeDuotone className="text-light-blue text-4xl rounded cursor-pointer block float-left mr-2" />
            <h3
              className={`text-white origin-left font-medium text-lg mt-1 duration-50 ${
                !open && "hidden"
              }`}
            >
              WORK STATUS PORTAL
            </h3>
          </div>
          <ul className="pt-2">
            <Link to="/">
              <li
                className={`text-gray-300 cursor-pointer text-sm flex items-center gap-x-4 p-2 ${activeBtn === 'btn1' ? 'bg-light-blue' : 'hover:bg-light-blue'}
                  rounded duration-300 mt-2`}
                onClick={() => handleBtnClick('btn1')}
              >
                <span className="text-2xl block float-left">
                  <MdOutlineSpaceDashboard />
                </span>
                <span className={`text-base font-medium flex-1 ${!open && "hidden"}`}>
                  Dashboard
                </span>
              </li>
            </Link>
            <Link to="/tasks">
              <li
                className={`text-gray-300 cursor-pointer text-sm flex items-center gap-x-4 p-2 ${activeBtn === 'btn2' ? 'bg-light-blue' : 'hover:bg-light-blue'}
                  rounded duration-300 mt-2`}
                onClick={() => handleBtnClick('btn2')}
              >
                <span className="text-2xl block float-left">
                  <MdTask />
                </span>
                <span className={`text-base font-medium flex-1 ${!open && "hidden"}`}>
                  Task
                </span>
              </li>
            </Link>
            <Link to="/staffs">
              <li
                className={`text-gray-300 cursor-pointer text-sm flex items-center gap-x-4 p-2 ${activeBtn === 'btn3' ? 'bg-light-blue' : 'hover:bg-light-blue'}
                  rounded duration-300 mt-2`}
                onClick={() => handleBtnClick('btn3')}
              >
                <span className="text-2xl block float-left">
                  <GrUserWorker />
                </span>
                <span className={`text-base font-medium flex-1 ${!open && "hidden"}`}>
                  Staff
                </span>
              </li>
            </Link>
          </ul>
        </div>
        <Outlet />
        {/* Content section with search bar at right corner */}
      </div>
    </>
  );
};
