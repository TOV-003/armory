import Active from "../assets/Active.svg";
import Available from "../assets/Available.svg";
import Damaged from "../assets/Damaged.svg";
import Decommissioned from "../assets/Decommissioned.svg"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/useAuth";


interface Workspace {
    id: string;
    name: string;
    description: string;
    user_id: string;
}

interface Equipment {
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

interface SettingsProps {
    workspaces: Workspace[];
    setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>;
    equipments: Equipment[];
    missions: Missions[];
}


function Splash({ workspaces, setWorkspaces, equipments, missions }: SettingsProps) {
    const { user, workspace } = useAuth();
    const navigate = useNavigate();
    console.log(workspaces);


    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    return (
        <div className="flex flex-col w-full bg-linear-to-br from-white to-gray-50 md:h-full rounded-2xl p-6 gap-5 items-center justify-center shadow-lg">
            <div className="flex flex-col items-center md:flex-row justify-between w-full gap-4 md:gap-0">
                <h1 className="text-gray-900 font-normal md:text-3xl md:text-start text-center text-xl">Hi, here's whats happening <br></br>
                    with your inventory </h1>
                <h2>{workspace.workspace_name}</h2>

                <div className="flex gap-4 items-center justify-center">
                    <button className="text-base font-inter px-6 py-2 rounded-lg bg-secondary hover:bg-indigo-600 text-white font-bold cursor-pointer shadow-lg hover:shadow-xl transition-all">Local Backup</button>
                </div>
            </div>
            <div className="flex flex-col items-center md:grid md:grid-cols-2 lg:flex-row lg:flex  justify-between w-full gap-4 font-inter">
                <div className="h-60 w-full  font-normal flex flex-col justify-evenly items-start p-6 rounded-2xl bg-white border-l-8 border-secondary text-gray-900 shadow-lg hover:shadow-xl transition-shadow">
                    <h4 className="text-2xl font-semibold">Active in Field</h4>
                    <div className="flex flex-row w-full justify-between">
                        <p className="text-6xl font-bold text-secondary">{equipments.filter(el => el.workspace_id === workspace.workspace_id && el.state === "IN_USE").length}</p>
                        <img src={Active} alt="Logo" />
                    </div>
                    <h4 className="text-xl text-gray-600">Deployed on Missions</h4>
                </div>
                <div className="h-60 w-full  font-normal flex flex-col justify-evenly items-start p-6 rounded-2xl bg-white border-l-8 border-green-500 text-gray-900 shadow-lg hover:shadow-xl transition-shadow">
                    <h4 className="text-2xl font-semibold">Available</h4>
                    <div className="flex flex-row w-full justify-between">
                        <p className="text-6xl font-bold text-green-500">{equipments.filter(el => el.workspace_id === workspace.workspace_id && el.state === "AVAILABLE").length}</p>
                        <img src={Available} alt="Logo" />
                    </div>
                    <h4 className="text-xl text-gray-600">Ready for Deployment</h4>
                </div>
                <div className="h-60 w-full  font-normal flex flex-col justify-evenly items-start p-6 rounded-2xl bg-white border-l-8 border-warning text-gray-900 shadow-lg hover:shadow-xl transition-shadow">
                    <h4 className="text-2xl font-semibold">Damaged</h4>
                    <div className="flex flex-row w-full justify-between">
                        <p className="text-6xl font-bold text-warning">{equipments.filter(el => el.workspace_id === workspace.workspace_id && el.state === "DAMAGED").length}</p>
                        <img src={Damaged} alt="Logo" />
                    </div>
                    <h4 className="text-xl text-gray-600">To be repaired</h4>
                </div>
                <div className="h-60 w-full  font-normal flex flex-col justify-evenly items-start p-6 rounded-2xl bg-white border-l-8 border-gray-400 text-gray-900 shadow-lg hover:shadow-xl transition-shadow">
                    <h4 className="text-2xl font-semibold">Decommissioned</h4>
                    <div className="flex flex-row w-full justify-between">
                        <p className="text-6xl font-bold text-gray-400">{equipments.filter(el => el.workspace_id === workspace.workspace_id && el.state === "DECOMMISSIONED").length}</p>
                        <img src={Decommissioned} alt="Logo" />
                    </div>
                    <h4 className="text-xl text-gray-600">Permanently Retired</h4>
                </div>
            </div>
            <div className="flex flex-col lg:grid lg:grid-cols-8 items-center justify-center w-full gap-4 h-full">
                <div className="col-span-5 bg-white h-full rounded-2xl p-6 w-full shadow-lg">g</div>
                <div className="col-span-3 flex flex-col items-center w-full h-full gap-4">
                    <div className="flex-2 w-full bg-white rounded-2xl p-4 shadow-lg">g</div>
                    <div className="flex-1 w-full bg-white rounded-2xl p-4 shadow-lg">g</div>
                </div>
            </div>
        </div >
    )
}

export default Splash
