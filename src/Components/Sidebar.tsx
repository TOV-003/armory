import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import Equipment from "../assets/Equipment.svg";
import Home from "../assets/Home.svg";
import Mission from "../assets/Mission.svg";
import Settings from "../assets/Settings.svg";
import type { ViewType } from "../pages/Dashboard";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user } = useAuth();

  const handleNavigation = (view: ViewType) => {
    setActiveView(view);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 h-16 bg-cardbg border-b border-gray-200 flex items-center justify-between px-4 text-gray-900 z-50 shadow-md">
          <Link to="/" className="flex gap-2 items-center">
            <img src={Equipment} alt="Logo" className="w-8 invert" />
            <h1 className="font-normal">ARMORY</h1>
          </Link>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 cursor-pointer text-xl">
            {isOpen ? "✕" : "☰"}
          </button>
        </div>

        <div className={`fixed inset-y-0 left-0 w-60 bg-cardbg text-gray-900 flex flex-col items-start justify-start gap-16 p-6 z-40 transform transition-transform duration-200 ease-in-out shadow-lg ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="w-full flex flex-col items-start gap-1 mt-16">
            <button className={`flex gap-2 items-center px-7 py-5 w-full cursor-pointer rounded-lg transition-all ${activeView === "home" ? "bg-secondary text-white shadow-md" : "text-gray-700 hover:bg-gray-100"}`} onClick={() => handleNavigation("home")}>
              <img src={Home} alt="Logo" />
              <h2 className="font-extralight">Home</h2>
            </button>
            <button className={`flex gap-2 items-center px-7 py-5 w-full cursor-pointer rounded-lg transition-all ${activeView === "mission" ? "bg-secondary text-white shadow-md" : "text-gray-700 hover:bg-gray-100"}`} onClick={() => handleNavigation("mission")}>
              <img src={Mission} alt="Logo" />
              <h2 className="font-extralight">Missions</h2>
            </button>
            <button className={`flex gap-2 items-center px-7 py-5 w-full cursor-pointer rounded-lg transition-all ${activeView === "equipment" ? "bg-secondary text-white shadow-md" : "text-gray-700 hover:bg-gray-100"}`} onClick={() => handleNavigation("equipment")}>
              <img src={Equipment} alt="Logo" />
              <h2 className="font-extralight">Equipment</h2>
            </button>
            <button className={`flex gap-2 items-center px-7 py-5 w-full cursor-pointer rounded-lg transition-all ${activeView === "settings" ? "bg-secondary text-white shadow-md" : "text-gray-700 hover:bg-gray-100"}`} onClick={() => handleNavigation("settings")}>
              <img src={Settings} alt="Logo" />
              <h2 className="font-extralight">Settings</h2>
            </button>
          </div>
          <button className={`flex mt-auto gap-2 items-center px-7 py-5 w-full rounded-lg text-gray-700 hover:bg-gray-100 transition-all`}>
            <img src={Equipment} alt="Logo" />
            <h2 className="font-extralight">{user?.user_metadata.name || "Account"}</h2>
          </button>
        </div>
        {isOpen && <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setIsOpen(false)} />}
      </>
    );
  }

  return (
    <div className="w-60 flex flex-col items-start justify-start text-gray-900 gap-16 min-h-full bg-cardbg shadow-lg rounded-r-2xl">
      <Link to="/" className="flex gap-2 items-center pt-6 px-6">
        <img src={Equipment} alt="Logo" className="w-8" />
        <h1 className="font-normal">ARMORY</h1>
      </Link>

      <div className="w-full flex flex-col items-start gap-1 px-4">
        <button
          className={`flex gap-2 items-center px-7 py-5 w-full cursor-pointer rounded-lg transition-all ${activeView === "home" ? "bg-secondary text-white shadow-md" : "text-gray-700 hover:bg-gray-100"}`}
          onClick={() => setActiveView("home")}
        >
          <img src={Home} alt="Logo" />
          <h2 className="font-extralight">Home</h2>
        </button>

        <button
          className={`flex gap-2 items-center px-7 py-5 w-full cursor-pointer rounded-lg transition-all ${activeView === "mission" ? "bg-secondary text-white shadow-md" : "text-gray-700 hover:bg-gray-100"}`}
          onClick={() => setActiveView("mission")}
        >
          <img src={Mission} alt="Logo" />
          <h2 className="font-extralight">Missions</h2>
        </button>

        <button
          className={`flex gap-2 items-center px-7 py-5 w-full cursor-pointer rounded-lg transition-all ${activeView === "equipment" ? "bg-secondary text-white shadow-md" : "text-gray-700 hover:bg-gray-100"}`}
          onClick={() => setActiveView("equipment")}
        >
          <img src={Equipment} alt="Logo" />
          <h2 className="font-extralight">Equipment</h2>
        </button>


        <button
          className={`flex gap-2 items-center px-7 py-5 w-full cursor-pointer rounded-lg transition-all ${activeView === "settings" ? "bg-secondary text-white shadow-md" : "text-gray-700 hover:bg-gray-100"}`}
          onClick={() => setActiveView("settings")}
        >
          <img src={Settings} alt="Logo" />
          <h2 className="font-extralight">Settings</h2>
        </button>
      </div>

      <button
        className={`flex mt-auto gap-2 items-center px-7 py-5 w-full rounded-lg text-gray-700 hover:bg-gray-100 transition-all mb-6`}
      >
        <img src={Equipment} alt="Logo" />
        <h2 className="font-extralight">{user?.user_metadata.name || "Account"}</h2>
      </button>
    </div>
  );
}

export default Sidebar;