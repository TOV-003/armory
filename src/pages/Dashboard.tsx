import Sidebar from "../Components/Sidebar"
import { useEffect, useState } from "react"
import Splash from "../Components/Splash"
import Mission from "../Components/Mission"
import Equipment from "../Components/Equipment"
import Settings from "../Components/Settings"




export type ViewType = "home" | "mission" | "equipment" | "settings";


function Dashboard() {
  const [activeView, setActiveView] = useState<ViewType>("home");
  useEffect(() => {
    console.log(activeView)
  }, [activeView])


  return (
    <main className="flex gap-5 p-4 items-start h-screen overflow-auto flex-col md:flex-row">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="pt-16 md:pt-0 w-full h-full">
        {
          {
            home: <Splash />,
            mission: <Mission />,
            equipment: <Equipment />,
            settings: <Settings />,
          }[activeView] || <Splash />
        }
      </div>

    </main>
  )
}

export default Dashboard
