import { useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { PiUsersThreeDuotone } from "react-icons/pi";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { GrUserWorker } from "react-icons/gr";
import { MdTask } from "react-icons/md";



export const Dashboard = () => {
  const [open, setOpen] = useState(true);

  return (
    
    <>
      <div className="flex">

       {/* Sidebar section */}
        {/* <div
          className={`bg-dark-blue h-screen p-5 pt-8 ${
            open? "w-72" : "w-20"
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
            <li
              className={`text-gray-300 cursor-pointer text-sm flex items-center gap-x-4 p-2 hover:bg-light-blue
              }  rounded duration-300 mt-2`}
            >
              <span className="text-2xl block float-left">
                <MdOutlineSpaceDashboard />
              </span>
              <span className={`text-base font-medium flex-1 ${!open && "hidden"}`}>
                Dashboard
              </span>
            </li>
            <li className={`text-gray-300 cursor-pointer text-sm flex items-center gap-x-4 p-2 hover:bg-light-blue
              }  rounded duration-300 mt-2`}
            >
              <span className="text-2xl block float-left">
                <MdTask />
              </span>
              <span className={`text-base font-medium flex-1 ${!open && "hidden"}`}>
                Task
              </span>
            </li>
            <li
              className={`text-gray-300 cursor-pointer text-sm flex items-center gap-x-4 p-2 bg-light-blue
              }  rounded duration-300 mt-2`}
            >
              <span className="text-2xl block float-left">
                <GrUserWorker />
              </span>
              <span className={`text-base font-medium flex-1 ${!open && "hidden"}`}>
                Staff
              </span>
            </li>
          </ul>
        </div> */}

        <div className="inline-block flex-grow p-7">
          <h2 className="text-2xl inline-block font-semibold">Dashboard</h2>
          </div>
          </div>

         

    </>
  )
}
