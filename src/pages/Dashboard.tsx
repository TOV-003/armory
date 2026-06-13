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
interface Equipments {
  id: string;
  name: string;
  category: string;
  serial_number: string;
  user_id: string;
  workspace_id: string;
  created_at: string;
  updated_at: string;
  state: string;
}
interface Missions {
  id: string;
  name: string;
  serial_number: string;
  user_id: string;
  workspace_id: string;
  start_date: Date;
  status: string;
}


function Dashboard() {
  const [activeView, setActiveView] = useState<ViewType>("home");
  const {
    setLoading,
    getWorkspaces,
    getLastActiveWorkspace,
    setWorkspace,
    getEquipments,
    getMissions
  } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [equipments, setEquipments] = useState<Equipments[]>([]);
  const [missions, setMissions] = useState<Missions[]>([]);



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
    async function fetchEquipments() {
      try {
        setLoading(true);
        const fetchedData = await getEquipments();
        setEquipments(fetchedData || []);
        console.log(`${fetchedData.length} equipments initialized in dashboard state.`);
      }
      catch (error) {
        console.error("Error fetching equipments:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEquipments();
    fetchWorkspaces();
  }, [getLastActiveWorkspace, getWorkspaces, setWorkspace, setLoading, getEquipments]);

  useEffect(() => {
    async function fetchMissions() {
      try {
        const fetchedData = await getMissions();
        setMissions(fetchedData || []);
        console.log(`${fetchedData.length} missions initialized in dashboard state.`);
      }
      catch (error) {
        console.error("Error fetching missions:", error);
      }
    }
    fetchMissions();


  }, [workspaces, getMissions]);

  return (
    <main className="flex gap-5 p-4 items-start h-screen overflow-auto flex-col md:flex-row bg-primary">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="pt-16 md:pt-0 w-full h-full">
        {
          {
            home: <Splash workspaces={workspaces} equipments={equipments} missions={missions} />,
            mission: <Mission missions={missions} setMissions={setMissions} equipments={equipments} setEquipments={setEquipments} />,
            equipment: <Equipment equipments={equipments} setEquipments={setEquipments} />,
            settings: <Settings workspaces={workspaces} setWorkspaces={setWorkspaces} equipments={equipments} missions={missions} />,
          }[activeView] || <Splash workspaces={workspaces} equipments={equipments} missions={missions} />
        }
      </div>

    </main>
  )
}

export default Dashboard
