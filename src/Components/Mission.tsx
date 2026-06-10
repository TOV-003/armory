import Active from "../assets/Active.svg";
import Decommissioned from "../assets/Decommissioned.svg"
import { useAuth } from "../context/useAuth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
    missions: Missions[];
    setMissions: React.Dispatch<React.SetStateAction<Missions[]>>;
    equipments: Equipment[];
    setEquipments: React.Dispatch<React.SetStateAction<Equipment[]>>;
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


function Mission({ missions, setMissions, equipments }: SettingsProps) {

    const { user, workspace, createMission, updateEquipmentState, newEquipmentLog, getEquipmentLogs, updateMissionStatus } = useAuth();
    const [newMissionModal, setNewMissionModal] = useState<boolean>(false);
    const [addEquipmentModal, setAddEquipmentModal] = useState<boolean>(false);
    const [missionStatusModal, setMissionStatusModal] = useState<boolean>(false);
    const navigate = useNavigate();
    const [note, setNote] = useState<string>("");
    const [MissionData, setMissionData] = useState({
        name: "",
        start_date: new Date(),
        equipment: []
    });
    const [equipmentLogs, setEquipmentLogs] = useState<EquipmentLog[]>([]);

    useEffect(() => {
        async function fetchEquipmentLogs() {
            try {
                const fetchedData = await getEquipmentLogs(user?.id || "");
                setEquipmentLogs(fetchedData || []);
                console.log(fetchedData);
            }
            catch (error) {
                console.error("Error fetching equipment logs:", error);
            }
        }
        fetchEquipmentLogs();
    }, [getEquipmentLogs, user])

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
        console.log(workspace.workspace_name);
        console.log(equipments);
    }, [user, navigate, workspace, equipments]);

    async function handleCreateMission(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setNewMissionModal(true);
        const newMission = await createMission(MissionData.name, MissionData.start_date);
        setMissions(prev => [...prev, newMission]);
        toast.success("Mission created successfully!");
        setNewMissionModal(false);
        setMissionData({ name: "", start_date: new Date(), equipment: [] });
    }

    async function handleAddEquipment(equipmentId: string, missionId: string) {
        try {
            await updateEquipmentState(equipmentId, "IN_USE");
            await newEquipmentLog(equipmentId, "CHECKOUT", missionId, note, new Date());
        }
        catch (error) {
            console.error("Error adding equipment to mission:", error);
        }
        finally {
            const refreshed = await getEquipmentLogs(user?.id || "");
            setEquipmentLogs(refreshed || []);
            toast.success("Equipment added to mission successfully!");
            setAddEquipmentModal(false);
            setNote("");
        }
    }





    return (
        <div className="flex flex-col w-full bg-linear-to-br from-white to-gray-50 md:h-full rounded-2xl p-6 gap-5 items-center justify-center shadow-lg">
            <div className="flex flex-col items-center md:flex-row justify-between w-full gap-4 md:gap-0">
                <h1 className="text-gray-900 font-normal md:text-3xl md:text-start text-center text-xl">Missions </h1>

                <div className="flex gap-4 items-center justify-center">
                    <button className="text-base font-inter px-6 py-2 rounded-lg bg-secondary hover:bg-indigo-600 text-white font-bold cursor-pointer shadow-lg hover:shadow-xl transition-all" onClick={() => setNewMissionModal(true)}>New Mission</button>
                    {newMissionModal && (
                        <div
                            onClick={() => setNewMissionModal(false)}
                            className="fixed inset-0 flex items-start pt-20 justify-center bg-black/50 z-50"
                        >
                            <form
                                onSubmit={handleCreateMission}
                                onClick={(e) => e.stopPropagation()}
                                className="flex flex-col gap-4 max-w-md w-full border border-gray-200 bg-white p-6 rounded-2xl shadow-lg"
                            >
                                <label className="text-gray-900 font-semibold">
                                    New Mission Name:
                                    <input
                                        type="text"
                                        placeholder="Mission Name"
                                        className="w-full p-3 rounded-lg text-gray-900 bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary mt-2"
                                        value={MissionData.name}
                                        onChange={(e) => setMissionData({ ...MissionData, name: e.target.value })}
                                    />
                                </label>
                                <button
                                    type="submit"
                                    className="bg-secondary hover:bg-indigo-600 px-4 py-2 text-white font-semibold rounded-lg cursor-pointer transition duration-200 shadow-md hover:shadow-lg"
                                >
                                    Create Mission
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col items-center md:grid md:grid-cols-2 lg:flex-row lg:flex  justify-between w-full gap-4 font-inter">
                <div className="h-40 w-full  font-normal flex flex-col justify-evenly items-start p-6 rounded-2xl bg-white border-l-8 border-secondary text-gray-900 shadow-lg hover:shadow-xl transition-shadow">
                    <h4 className="text-2xl font-semibold">Active Missions</h4>
                    <div className="flex flex-row w-full justify-between">
                        <p className="text-6xl font-bold text-secondary">{missions.filter(el => el.workspace_id === workspace.workspace_id).filter(el => el.status === "ACTIVE").length}</p>
                        <img src={Active} alt="Logo" />
                    </div>
                </div>
                <div className="h-40 w-full  font-normal flex flex-col justify-evenly items-start p-6 rounded-2xl bg-white border-l-8 border-gray-400 text-gray-900 shadow-lg hover:shadow-xl transition-shadow">
                    <h4 className="text-2xl font-semibold">Completed Missions</h4>
                    <div className="flex flex-row w-full justify-between">
                        <p className="text-6xl font-bold text-gray-400">{missions.filter(el => el.status === "COMPLETED").length}</p>
                        <img src={Decommissioned} alt="Logo" />
                    </div>
                </div>
            </div>
            <div className="col-span-5 bg-white h-full rounded-2xl p-4 w-full flex flex-col items-start overflow-y-auto shadow-lg">
                <h4 className="text-xl text-gray-900 font-semibold w-full text-center pb-4">Active Missions</h4>
                <div className="grid grid-cols-6 place-items-center text-gray-900 w-full gap-2">
                    <p className="text-lg font-semibold col-span-1">Name</p>
                    <div className="flex flex-row gap-4 w-full col-span-3 text-center">
                        <p className="text-lg font-semibold w-full">Start Date</p>
                        <p className="text-lg font-semibold w-full">Status</p>
                        <p className="text-lg font-semibold w-full">Equipment</p>
                    </div>
                    <p className="text-lg font-semibold col-span-2 text-center">Actions</p>

                    {missions.filter(el => el.workspace_id === workspace.workspace_id).map((el) => (
                        <>
                            <button className="text-lg font-semibold w-full col-span-1 text-center cursor-pointer hover:bg-gray-100 rounded-lg">{el.name}</button>
                            <div className="flex flex-row gap-4 w-full col-span-3">
                                <p className="text-lg font-semibold w-full text-center">
                                    {new Date(el.start_date).toISOString().split('T')[0]}
                                </p>
                                <p className="text-lg font-semibold w-full text-center">{el.status}</p>
                                <p className="text-lg font-semibold w-full text-center">
                                    {equipmentLogs.filter(eq => eq.mission_id === el.id).length}
                                </p>
                            </div>
                            <div className="flex flex-row gap-2 col-span-2 justify-center">
                                <button onClick={() => setAddEquipmentModal(true)} className="bg-secondary hover:bg-indigo-600 px-4 py-2 text-white font-semibold rounded-lg cursor-pointer transition duration-200 shadow-md hover:shadow-lg">
                                    Add Equipment
                                </button>
                                {
                                    addEquipmentModal && (
                                        <div
                                            onClick={() => setAddEquipmentModal(false)}
                                            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                                        >
                                            <div
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex flex-col gap-4 max-w-md w-full border border-gray-200 bg-white p-6 rounded-2xl shadow-lg"
                                            >
                                                <p className="font-semibold text-sm text-gray-900">All Equipment</p>
                                                <div className="flex flex-col gap-2">
                                                    {equipments.filter(eq => eq.workspace_id === workspace.workspace_id).filter(item => item.state === "AVAILABLE").length > 0 ?
                                                        equipments.filter(eq => eq.workspace_id === workspace.workspace_id).filter(item => item.state === "AVAILABLE").map((item) => (
                                                            <div
                                                                key={item.id}
                                                                className="flex items-center justify-between gap-4 w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2"
                                                            >
                                                                <span className="font-medium text-gray-900 w-full">{item.name}</span>
                                                                <textarea
                                                                    placeholder="Notes"
                                                                    className="w-full p-3 rounded-lg text-gray-900 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                                                                    value={note}
                                                                    onChange={(e) => setNote(e.target.value)}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleAddEquipment(item.id, el.id)}
                                                                    disabled={item.state !== "AVAILABLE"}
                                                                    className="bg-secondary hover:bg-indigo-600 w-full px-3 py-1 text-white text-sm font-semibold rounded-lg cursor-pointer transition duration-200 shadow-md hover:shadow-lg"
                                                                >
                                                                    Add to Mission
                                                                </button>
                                                            </div>
                                                        ))
                                                        :
                                                        <div className="text-gray-600">No Equipment Available!</div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                <button className="bg-green-500 hover:bg-green-600 px-4 py-2 text-white font-semibold rounded-lg cursor-pointer transition duration-200 shadow-md hover:shadow-lg" onClick={() => setMissionStatusModal(true)}>
                                    Change Status
                                </button>
                                {
                                    missionStatusModal && (
                                        <div
                                            onClick={() => setMissionStatusModal(false)}
                                            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                                        >
                                            <div
                                                onClick={(e) => e.stopPropagation()}
                                                className="flex flex-col gap-4 max-w-md w-full border border-gray-200 bg-white p-6 rounded-2xl shadow-lg"
                                            >
                                                <button onClick={() => {
                                                    updateMissionStatus(el.id, "CANCELLED");

                                                }} className="bg-red-500 hover:bg-red-600 px-4 py-2 text-white font-semibold rounded-lg cursor-pointer transition duration-200 shadow-md hover:shadow-lg">Cancel Mission</button>
                                                <button onClick={() => updateMissionStatus(el.id, "COMPLETED")} className="bg-green-500 hover:bg-green-600 px-4 py-2 text-white font-semibold rounded-lg cursor-pointer transition duration-200 shadow-md hover:shadow-lg">Complete Mission</button>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </>
                    ))}
                </div>

            </div>
        </div >
    )
}

export default Mission
