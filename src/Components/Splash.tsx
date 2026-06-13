import Active from "../assets/Active.svg";
import Available from "../assets/Available.svg";
import Damaged from "../assets/Damaged.svg";
import Decommissioned from "../assets/Decommissioned.svg"
import { useNavigate } from "react-router-dom";
import { useEffect, useState, type JSX } from "react";
import { useAuth } from "../context/useAuth";
import FleetUtilisationRate from "./FleetUtilisationRate";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { supabase } from '../api/SupabaseClient';


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
    equipments: Equipment[];
    missions: Missions[];
}

interface EquipmentLog {
    id: string;
    equipment_id: string;
    action_type: string;
    user_id: string;
    workspace_id: string;
    mission_id: string;
    notes: string | null;
    timestamp: Date;
}


function Splash({ workspaces, equipments, missions }: SettingsProps) {
    const { user, workspace, getEquipmentLogs } = useAuth();
    const navigate = useNavigate();
    const [equipmentLogs, setEquipmentLogs] = useState<EquipmentLog[]>([]);
    console.log(workspaces);



    useEffect(() => {
        if (!user) {
            navigate('/login');
        }

        async function fetchEquipmentLogs() {
            console.log("fetching equipment logs");

            try {
                const fetchedData = await getEquipmentLogs(user?.id || "");
                setEquipmentLogs(fetchedData || []);
            } catch (error) {
                console.error("Error fetching equipment logs:", error);
            }
        }
        fetchEquipmentLogs();
    }, [user, navigate]);

    function arrayToCSV(data: Record<string, unknown>[]): string {
        if (!data.length) return '';
        const headers = Object.keys(data[0]);
        const rows = data.map(row =>
            headers.map(header => JSON.stringify(row[header] ?? '')).join(',')
        );
        return [headers.join(','), ...rows].join('\n');
    }

    async function exportAllMyDataToZip() {
        const [equipment, missions, workspaces, equipmentLog] = await Promise.all([
            supabase.from('equipment').select('*'),
            supabase.from('missions').select('*'),
            supabase.from('workspaces').select('*'),
            supabase.from('equipment_log').select('*')
        ]);

        const zip = new JSZip();

        if (equipment.data?.length) zip.file('equipment.csv', arrayToCSV(equipment.data));
        if (missions.data?.length) zip.file('missions.csv', arrayToCSV(missions.data));
        if (workspaces.data?.length) zip.file('workspaces.csv', arrayToCSV(workspaces.data));
        if (equipmentLog.data?.length) zip.file('equipment_log.csv', arrayToCSV(equipmentLog.data));

        zip.file('info.json', JSON.stringify({ exported_at: new Date().toISOString() }, null, 2));

        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, `my_local_backup_data_${Date.now()}.zip`);
    }

    return (
        <div className="flex flex-col w-full bg-linear-to-br from-white to-gray-50 md:h-full rounded-2xl p-6 gap-5 items-center justify-start shadow-lg overflow-y-auto">
            <div className="flex flex-col items-center md:flex-row justify-between w-full gap-4 md:gap-0">
                <h1 className="text-gray-900 font-normal md:text-3xl md:text-start text-center text-xl">Hi, here's whats happening <br></br>
                    with your inventory </h1>
                <h2>{workspace.workspace_name}</h2>

                <div className="flex gap-4 items-center justify-center">
                    <button className="text-base font-inter px-6 py-2 rounded-lg bg-secondary hover:bg-indigo-600 text-white font-bold cursor-pointer shadow-lg hover:shadow-xl transition-all" onClick={exportAllMyDataToZip}>Local Backup</button>
                </div>
            </div>
            <div className="flex flex-col items-center md:grid md:grid-cols-2 lg:flex-row lg:flex  justify-between w-full gap-4 font-inter">
                <div className="h-60 w-full font-normal flex flex-col justify-evenly items-start p-6 rounded-2xl bg-white border border-secondary/30 shadow-lg hover:shadow-xl transition-shadow">
                    <h4 className="text-2xl font-semibold">Active in Field</h4>
                    <div className="flex flex-row w-full justify-between items-center bg-secondary/5 p-3 rounded-xl">
                        <p className="text-6xl font-bold text-secondary">
                            {equipments.filter(el => el.workspace_id === workspace.workspace_id && el.state === "IN_USE").length}
                        </p>
                        <img src={Active} alt="Logo" />
                    </div>
                    <h4 className="text-base text-gray-600">Deployed on Missions</h4>
                </div>

                <div className="h-60 w-full font-normal flex flex-col justify-evenly items-start p-6 rounded-2xl bg-white border border-green-500/30 text-gray-900 shadow-lg hover:shadow-xl transition-shadow">
                    <h4 className="text-2xl font-semibold">Available</h4>
                    <div className="flex flex-row w-full justify-between items-center bg-green-500/5 p-3 rounded-xl">
                        <p className="text-6xl font-bold text-green-500">
                            {equipments.filter(el => el.workspace_id === workspace.workspace_id && el.state === "AVAILABLE").length}
                        </p>
                        <img src={Available} alt="Logo" />
                    </div>
                    <h4 className="text-base text-gray-600">Ready for Deployment</h4>
                </div>

                <div className="h-60 w-full font-normal flex flex-col justify-evenly items-start p-6 rounded-2xl bg-white border border-warning/30 text-gray-900 shadow-lg hover:shadow-xl transition-shadow">
                    <h4 className="text-2xl font-semibold">Damaged</h4>
                    <div className="flex flex-row w-full justify-between items-center bg-warning/5 p-3 rounded-xl">
                        <p className="text-6xl font-bold text-warning">
                            {equipments.filter(el => el.workspace_id === workspace.workspace_id && el.state === "DAMAGED").length}
                        </p>
                        <img src={Damaged} alt="Logo" />
                    </div>
                    <h4 className="text-base text-gray-600">To be repaired</h4>
                </div>

                <div className="h-60 w-full font-normal flex flex-col justify-evenly items-start p-6 rounded-2xl bg-white border border-gray-400/30 text-gray-900 shadow-lg hover:shadow-xl transition-shadow">
                    <h4 className="text-2xl font-semibold">Decommissioned</h4>
                    <div className="flex flex-row w-full justify-between items-center bg-gray-400/5 p-3 rounded-xl">
                        <p className="text-6xl font-bold text-gray-400">
                            {equipments.filter(el => el.workspace_id === workspace.workspace_id && el.state === "DECOMMISSIONED").length}
                        </p>
                        <img src={Decommissioned} alt="Logo" />
                    </div>
                    <h4 className="text-base text-gray-600">Permanently Retired</h4>
                </div>
            </div>
            <div className="flex flex-col lg:grid lg:grid-cols-8 items-center justify-center w-full gap-4 h-full">
                <div className="col-span-5 bg-white h-full rounded-2xl p-6 w-full shadow-lg flex flex-col overflow-y-auto">
                    <h2 className="text-2xl font-semibold">Active Missions</h2>
                    <div className="overflow-x-auto w-full">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                            <thead className="bg-gray-100 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Mission Name</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Start Date</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {missions.map((el) => (
                                    <tr key={el.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-base font-medium text-gray-900">{el.name}</td>
                                        <td className="px-4 py-3 text-base text-gray-700">
                                            {new Date(el.start_date).toISOString().split("T")[0]}
                                        </td>
                                        <td className="px-4 py-3 text-base text-gray-700">{el.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-span-3 flex flex-col items-center w-full h-full gap-4">
                    <div className=" max-h-60 w-full bg-white rounded-2xl p-4 shadow-lg flex flex-col overflow-y-auto ">
                        <h2 className="text-2xl font-semibold mb-3">Recent State Updates</h2>
                        <div className="w-full">
                            <div className="flex flex-col gap-0">
                                {equipmentLogs.slice().reverse().map((el, index) => {
                                    const timeStr = new Date(el.timestamp).toTimeString().slice(0, 5);
                                    const isLast = index === equipmentLogs.length - 1;

                                    const statusConfig: Record<string, { color: string; message: JSX.Element }> = {
                                        CHECKOUT: {
                                            color: "text-blue-600",
                                            message: (
                                                <>
                                                    Asset <span className="font-medium text-gray-900">{el.equipment_id}</span> was{" "}
                                                    <span className="font-bold text-blue-600">checked out</span>.
                                                </>
                                            ),
                                        },
                                        RETURN_OK: {
                                            color: "text-green-600",
                                            message: (
                                                <>
                                                    Asset <span className="font-medium text-gray-900">{el.equipment_id}</span> was{" "}
                                                    <span className="font-bold text-green-600">returned in good condition</span>.
                                                </>
                                            ),
                                        },
                                        RETURN_DAMAGED: {
                                            color: "text-orange-500",
                                            message: (
                                                <>
                                                    Asset <span className="font-medium text-gray-900">{el.equipment_id}</span> was{" "}
                                                    <span className="font-bold text-orange-500">returned damaged</span>.
                                                </>
                                            ),
                                        },
                                        REPAIR_COMPLETE: {
                                            color: "text-purple-600",
                                            message: (
                                                <>
                                                    Asset <span className="font-medium text-gray-900">{el.equipment_id}</span> has been{" "}
                                                    <span className="font-bold text-purple-600">repaired and is ready for use</span>.
                                                </>
                                            ),
                                        },
                                        RETIRE: {
                                            color: "text-red-500",
                                            message: (
                                                <>
                                                    Asset <span className="font-medium text-gray-900">{el.equipment_id}</span> has been{" "}
                                                    <span className="font-bold text-red-500">retired from service</span>.
                                                </>
                                            ),
                                        },
                                    };

                                    const config = statusConfig[el.action_type] ?? {
                                        color: "text-gray-500",
                                        message: (
                                            <>
                                                Asset <span className="font-medium text-gray-900">{el.equipment_id}</span> status changed to{" "}
                                                <span className="font-bold text-gray-500">{el.action_type}</span>.
                                            </>
                                        ),
                                    };

                                    return (
                                        <div key={el.id} className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${config.color.replace("text-", "bg-")}`} />
                                                {!isLast && <div className="w-px flex-1 bg-gray-200 my-0.5" />}
                                            </div>

                                            <p className="text-sm text-gray-700 pb-3 leading-snug">
                                                <span className="text-gray-500">[{timeStr}]</span>{" "}
                                                {config.message}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="h-full w-full bg-white rounded-2xl p-4 shadow-lg">
                        <FleetUtilisationRate
                            numerator={equipments.filter(el => el.workspace_id === workspace.workspace_id && el.state === "IN_USE").length}
                            denominator={equipments.filter(el => el.workspace_id === workspace.workspace_id).length}
                            title="Equipment UtiliSation"
                            utilizationLabel="UTILISED"
                        />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Splash
