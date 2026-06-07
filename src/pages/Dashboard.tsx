import Sidebar from "../Components/Sidebar"
import { useState, useEffect } from "react"
import Splash from "../Components/Splash"
import Mission from "../Components/Mission"
import Equipment from "../Components/Equipment"
import Settings from "../Components/Settings"
import { useAuth } from "../context/useAuth";



export type ViewType = "home" | "mission" | "equipment" | "settings";
interface Workspace {
  id: string;
  name: string;
  description: string;
  user_id: string;
}


function Dashboard() {
  const [activeView, setActiveView] = useState<ViewType>("home");
  const { setLoading, getWorkspaces, getLastActiveWorkspace, setWorkspace } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);


  useEffect(() => {
    console.log(activeView)
    console.log(workspaces);
  }, [activeView, workspaces]);

  useEffect(() => {
    async function fetchWorkspaces() {
      try {
        setLoading(true);
        const fetchedData = await getWorkspaces();
        setWorkspaces(fetchedData || []);

        if (fetchedData && fetchedData.length > 0) {
          console.log(`${fetchedData.length} workspaces initialized in dashboard state.`);
        }

        const lastActiveWorkspace = await getLastActiveWorkspace();
        if (lastActiveWorkspace) {
          setWorkspace(lastActiveWorkspace);
        }
      }
      catch (error) {
        console.error("Error fetching workspaces:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkspaces();
  }, [getLastActiveWorkspace, getWorkspaces, setWorkspace, setLoading]);



  return (
    <main className="flex gap-5 p-4 items-start h-screen overflow-auto flex-col md:flex-row">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="pt-16 md:pt-0 w-full h-full">
        {
          {
            home: <Splash />,
            mission: <Mission />,
            equipment: <Equipment />,
            settings: <Settings workspaces={workspaces} setWorkspaces={setWorkspaces} />,
          }[activeView] || <Splash />
        }
      </div>

    </main>
  )
}

export default Dashboard
