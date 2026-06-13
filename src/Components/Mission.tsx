import Active from "../assets/Active.svg";
import Decommissioned from "../assets/Decommissioned.svg";
import { useAuth } from "../context/useAuth";
import { useState, useEffect } from "react";
import { Fragment } from "react";
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

function Mission({ missions, setMissions, equipments, setEquipments }: SettingsProps) {
    const { user, workspace, createMission, updateEquipmentState, newEquipmentLog, getEquipmentLogs, updateMissionStatus } = useAuth();
    const [newMissionModal, setNewMissionModal] = useState<boolean>(false);
    const [addEquipmentModal, setAddEquipmentModal] = useState<string | null>(null);
    const [missionStatusModal, setMissionStatusModal] = useState<string | null>(null);
    const [equipmentReturnStates, setEquipmentReturnStates] = useState<Record<string, "AVAILABLE" | "DAMAGED" | "DECOMMISSIONED">>({});
    const navigate = useNavigate();
    const [addEquipmentNotes, setAddEquipmentNotes] = useState<Record<string, string>>({});
    const [returnNotes, setReturnNotes] = useState<Record<string, string>>({});
    const [MissionData, setMissionData] = useState({
        name: "",
        start_date: new Date(),
        equipment: [],
    });
    const [equipmentLogs, setEquipmentLogs] = useState<EquipmentLog[]>([]);
    const [viewMode, setViewMode] = useState<"active" | "completed">("active");

    useEffect(() => {
        async function fetchEquipmentLogs() {
            try {
                const fetchedData = await getEquipmentLogs(user?.id || "");
                setEquipmentLogs(fetchedData || []);
            } catch (error) {
                console.error("Error fetching equipment logs:", error);
            }
        }
        fetchEquipmentLogs();
    }, [getEquipmentLogs, user]);

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    async function handleCreateMission(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const newMission = await createMission(MissionData.name, MissionData.start_date);
        setMissions((prev) => [...prev, newMission]);
        toast.success("Mission created successfully!");
        setNewMissionModal(false);
        setMissionData({ name: "", start_date: new Date(), equipment: [] });
    }

    async function handleAddEquipment(equipmentId: string, missionId: string, note: string) {
        try {
            await updateEquipmentState(equipmentId, "IN_USE");
            await newEquipmentLog(equipmentId, "CHECKOUT", missionId, note, new Date());

            setEquipments((prev) =>
                prev.map((eq) => (eq.id === equipmentId ? { ...eq, state: "IN_USE" } : eq))
            );

            const refreshed = await getEquipmentLogs(user?.id || "");
            setEquipmentLogs(refreshed || []);
            toast.success("Equipment added to mission successfully!");
        } catch (error) {
            console.error("Error adding equipment to mission:", error);
            toast.error("Failed to add equipment.");
        } finally {
            setAddEquipmentModal(null);
            setAddEquipmentNotes({});
        }
    }

    async function updateEquipmentReturn(
        equipmentId: string,
        missionId: string,
        returnType: "AVAILABLE" | "DAMAGED" | "DECOMMISSIONED",
        noteText: string
    ) {
        let newState: string;
        let action: string;

        switch (returnType) {
            case "AVAILABLE":
                newState = "AVAILABLE";
                action = "RETURN_OK";
                break;
            case "DAMAGED":
                newState = "DAMAGED";
                action = "RETURN_DAMAGED";
                break;
            case "DECOMMISSIONED":
                newState = "DECOMMISSIONED";
                action = "RETIRED";
                break;
        }

        await updateEquipmentState(equipmentId, newState);
        await newEquipmentLog(equipmentId, action, missionId, noteText, new Date());

        setEquipments((prev) => prev.map((eq) => (eq.id === equipmentId ? { ...eq, state: newState } : eq)));
    }

    async function handleCancelMission(missionId: string) {
        try {
            const missionEquipment = equipments
                .filter((eq) => eq.workspace_id === workspace.workspace_id)
                .filter((item) =>
                    equipmentLogs.some(
                        (log) => log.equipment_id === item.id && log.mission_id === missionId
                    )
                );

            await Promise.all(
                missionEquipment.map(async (item) => {
                    await updateEquipmentState(item.id, "AVAILABLE");
                    await newEquipmentLog(item.id, "RETURN_OK", missionId, "Mission cancelled", new Date());
                    setEquipments((prev) =>
                        prev.map((eq) => (eq.id === item.id ? { ...eq, state: "AVAILABLE" } : eq))
                    );
                })
            );

            await updateMissionStatus(missionId, "CANCELLED");
            setMissions((prev) =>
                prev.map((m) => (m.id === missionId ? { ...m, status: "CANCELLED" } : m))
            );

            const refreshed = await getEquipmentLogs(user?.id || "");
            setEquipmentLogs(refreshed || []);

            toast.success("Mission cancelled and all equipment returned.");
        } catch (error) {
            console.error("Error cancelling mission:", error);
            toast.error("Failed to cancel mission.");
        } finally {
            setMissionStatusModal(null);
            setReturnNotes({});
            setEquipmentReturnStates({});
        }
    }

    const activeMissionForModal = missionStatusModal
        ? missions.find((m) => m.id === missionStatusModal && m.status === "ACTIVE")
        : null;
    const addEquipmentMissionForModal = addEquipmentModal
        ? missions.find((m) => m.id === addEquipmentModal)
        : null;

    const filteredMissions = missions
        .filter((el) => el.workspace_id === workspace.workspace_id)
        .filter((el) => {
            if (viewMode === "active") {
                return el.status === "ACTIVE";
            } else {
                return el.status === "COMPLETED" || el.status === "CANCELLED";
            }
        });

    const tableTitle = viewMode === "active" ? "Active Missions" : "Completed & Cancelled Missions";

    return (
        <div className="flex flex-col w-full bg-linear-to-br from-white to-gray-50 md:h-full rounded-2xl p-6 gap-5 items-center justify-center shadow-lg">
            <div className="flex flex-col items-center md:flex-row justify-between w-full gap-4 md:gap-0">
                <h1 className="text-gray-900 font-normal md:text-3xl md:text-start text-center text-xl">
                    Missions
                </h1>

                <div className="flex gap-4 items-center justify-center">
                    <button
                        className="text-base font-inter px-6 py-2 rounded-lg bg-secondary hover:bg-indigo-600 text-white font-bold cursor-pointer shadow-lg hover:shadow-xl transition-all"
                        onClick={() => setNewMissionModal(true)}
                    >
                        New Mission
                    </button>
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

            <div className="flex flex-col items-center md:grid md:grid-cols-2 lg:flex-row lg:flex justify-between w-full gap-4 font-inter">
                <div
                    onClick={() => setViewMode("active")}
                    className={`min-h-40 w-full font-normal flex flex-col justify-evenly items-start p-6 rounded-2xl bg-white border border-secondary/30 transition-all cursor-pointer shadow-lg hover:shadow-xl ${viewMode === "active" ? "ring-2 ring-secondary/30" : ""
                        }`}
                >
                    <h4 className="text-2xl font-semibold">Active Missions</h4>
                    <div className="flex flex-row w-full justify-between items-center bg-secondary/5 p-3 rounded-xl mb-2">
                        <p className="text-6xl font-bold text-secondary">
                            {missions.filter((el) => el.workspace_id === workspace.workspace_id && el.status === "ACTIVE").length}
                        </p>
                        <img src={Active} alt="Logo" />
                    </div>
                </div>

                <div
                    onClick={() => setViewMode("completed")}
                    className={`min-h-40 w-full font-normal flex flex-col justify-evenly items-start p-6 rounded-2xl bg-white border border-gray-400/30 transition-all cursor-pointer shadow-lg hover:shadow-xl ${viewMode === "completed" ? "ring-2 ring-gray-400/30" : ""
                        }`}
                >
                    <h4 className="text-2xl font-semibold">Completed Missions</h4>
                    <div className="flex flex-row w-full justify-between items-center bg-gray-400/5 p-3 rounded-xl mb-2">
                        <p className="text-6xl font-bold text-gray-400">
                            {missions.filter(m => m.workspace_id === workspace.workspace_id).filter((el) => el.status === "COMPLETED" || el.status === "CANCELLED").length}
                        </p>
                        <img src={Decommissioned} alt="Logo" />
                    </div>
                </div>
            </div>

            <div className="col-span-5 bg-white h-full rounded-2xl p-4 w-full flex flex-col items-start overflow-y-auto shadow-lg">
                <h4 className="text-xl text-gray-900 font-semibold w-full text-center pb-4">
                    {tableTitle}
                </h4>
                <div className="grid grid-cols-6 place-items-center text-gray-900 w-full gap-2">
                    <p className="text-lg font-semibold col-span-1">Name</p>
                    <div className="flex flex-row gap-4 w-full col-span-3 text-center">
                        <p className="text-lg font-semibold w-full">Start Date</p>
                        <p className="text-lg font-semibold w-full">Status</p>
                        <p className="text-lg font-semibold w-full">Equipment</p>
                    </div>
                    <p className="text-lg font-semibold col-span-2 text-center">Actions</p>

                    {filteredMissions.map((el) => {
                        const activeEquipmentCount = equipmentLogs.filter(
                            (log) => log.mission_id === el.id && log.action_type === "CHECKOUT"
                        ).length;

                        const isActive = el.status === "ACTIVE";

                        return (
                            <Fragment key={el.id}>
                                <button className="text-lg font-semibold w-full col-span-1 text-center cursor-pointer hover:bg-gray-100 rounded-lg">
                                    {el.name}
                                </button>
                                <div className="flex flex-row gap-4 w-full col-span-3">
                                    <p className="text-lg font-semibold w-full text-center">
                                        {new Date(el.start_date).toISOString().split("T")[0]}
                                    </p>
                                    <p className="text-lg font-semibold w-full text-center">{el.status}</p>
                                    <p className="text-lg font-semibold w-full text-center">{activeEquipmentCount}</p>
                                </div>
                                <div className="flex flex-row gap-2 col-span-2 justify-center">
                                    {isActive && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setAddEquipmentNotes({});
                                                    setAddEquipmentModal(el.id);
                                                }}
                                                className="bg-secondary hover:bg-indigo-600 px-4 py-2 text-white font-semibold rounded-lg cursor-pointer transition duration-200 shadow-md hover:shadow-lg"
                                            >
                                                Add Equipment
                                            </button>
                                            <button
                                                className="bg-green-500 hover:bg-green-600 px-4 py-2 text-white font-semibold rounded-lg cursor-pointer transition duration-200 shadow-md hover:shadow-lg"
                                                onClick={() => {
                                                    setReturnNotes({});
                                                    setEquipmentReturnStates({});
                                                    setMissionStatusModal(el.id);
                                                }}
                                            >
                                                Change Status
                                            </button>
                                        </>
                                    )}
                                    {!isActive && viewMode === "completed" && (
                                        <span className="text-gray-400 italic">No actions</span>
                                    )}
                                </div>
                            </Fragment>
                        );
                    })}
                    {filteredMissions.length === 0 && (
                        <div className="col-span-6 text-center text-gray-500 py-8">
                            No missions to display.
                        </div>
                    )}
                </div>
            </div>

            {addEquipmentModal && addEquipmentMissionForModal && (
                <div
                    onClick={() => {
                        setAddEquipmentModal(null);
                        setAddEquipmentNotes({});
                    }}
                    className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="flex flex-col gap-4 max-w-md w-full border border-gray-200 bg-white p-6 rounded-2xl shadow-lg"
                    >
                        <p className="font-semibold text-sm text-gray-900">All Equipment</p>
                        <div className="flex flex-col gap-2">
                            {equipments
                                .filter((eq) => eq.workspace_id === workspace.workspace_id)
                                .filter((item) => item.state === "AVAILABLE").length > 0 ? (
                                equipments
                                    .filter((eq) => eq.workspace_id === workspace.workspace_id)
                                    .filter((item) => item.state === "AVAILABLE")
                                    .map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex flex-col gap-2 w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2"
                                        >
                                            <span className="font-medium text-gray-900">{item.name}</span>
                                            <span className="font-medium text-gray-900">{item.category}</span>
                                            <textarea
                                                placeholder="Notes"
                                                className="w-full p-3 rounded-lg text-gray-900 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                                                value={addEquipmentNotes[item.id] || ""}
                                                onChange={(e) => setAddEquipmentNotes(prev => ({ ...prev, [item.id]: e.target.value }))}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleAddEquipment(item.id, addEquipmentMissionForModal.id, addEquipmentNotes[item.id] || "")}
                                                className="bg-secondary hover:bg-indigo-600 w-full px-3 py-1 text-white text-sm font-semibold rounded-lg cursor-pointer transition duration-200 shadow-md hover:shadow-lg"
                                            >
                                                Add to Mission
                                            </button>
                                        </div>
                                    ))
                            ) : (
                                <div className="text-gray-600">No Equipment Available!</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {missionStatusModal && activeMissionForModal && (
                <div
                    onClick={() => {
                        setMissionStatusModal(null);
                        setReturnNotes({});
                        setEquipmentReturnStates({});
                    }}
                    className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="flex flex-col gap-4 max-w-md w-full border border-gray-200 bg-white p-6 rounded-2xl shadow-lg"
                    >
                        <button
                            onClick={() => handleCancelMission(activeMissionForModal.id)}
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 text-white font-semibold rounded-lg cursor-pointer transition duration-200 shadow-md hover:shadow-lg"
                        >
                            Cancel Mission
                        </button>

                        <div className="flex flex-col gap-2">
                            {equipments
                                .filter((eq) => eq.workspace_id === workspace.workspace_id)
                                .filter((item) =>
                                    equipmentLogs.some(
                                        (log) => log.equipment_id === item.id && log.mission_id === activeMissionForModal.id
                                    )
                                ).length > 0 ? (
                                equipments
                                    .filter((eq) => eq.workspace_id === workspace.workspace_id)
                                    .filter((item) =>
                                        equipmentLogs.some(
                                            (log) => log.equipment_id === item.id && log.mission_id === activeMissionForModal.id
                                        )
                                    )
                                    .map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex flex-col gap-2 w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2"
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <span className="font-medium text-gray-900">{item.name}</span>
                                                <div className="flex gap-2">
                                                    {(["AVAILABLE", "DAMAGED", "DECOMMISSIONED"] as const).map((state) => (
                                                        <button
                                                            key={state}
                                                            type="button"
                                                            onClick={() =>
                                                                setEquipmentReturnStates((prev) => ({ ...prev, [item.id]: state }))
                                                            }
                                                            className={`px-2 py-1 rounded-md text-xs font-semibold border transition-all ${equipmentReturnStates[item.id] === state
                                                                ? state === "AVAILABLE"
                                                                    ? "bg-blue-100 text-blue-700 border-blue-400"
                                                                    : state === "DAMAGED"
                                                                        ? "bg-yellow-100 text-yellow-700 border-yellow-400"
                                                                        : "bg-gray-200 text-gray-700 border-gray-400"
                                                                : "bg-white text-gray-400 border-gray-200 hover:border-gray-400"
                                                                }`}
                                                        >
                                                            {state}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <textarea
                                                placeholder="Return notes (optional)"
                                                className="w-full p-3 rounded-lg text-gray-900 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                                                value={returnNotes[item.id] || ""}
                                                onChange={(e) => setReturnNotes(prev => ({ ...prev, [item.id]: e.target.value }))}
                                                rows={2}
                                            />
                                        </div>
                                    ))
                            ) : (
                                <div className="text-gray-600">No Equipment in this Mission!</div>
                            )}
                        </div>

                        <button
                            onClick={async () => {
                                const missionEquipment = equipments
                                    .filter((eq) => eq.workspace_id === workspace.workspace_id)
                                    .filter((item) =>
                                        equipmentLogs.some(
                                            (log) => log.equipment_id === item.id && log.mission_id === activeMissionForModal.id
                                        )
                                    );

                                await Promise.all(
                                    missionEquipment.map((item) => {
                                        const returnState = equipmentReturnStates[item.id] ?? "AVAILABLE";
                                        const noteText = returnNotes[item.id] || "";
                                        return updateEquipmentReturn(item.id, activeMissionForModal.id, returnState, noteText);
                                    })
                                );

                                await updateMissionStatus(activeMissionForModal.id, "COMPLETED");
                                setMissions((prev) =>
                                    prev.map((m) =>
                                        m.id === activeMissionForModal.id ? { ...m, status: "COMPLETED" } : m
                                    )
                                );

                                const refreshed = await getEquipmentLogs(user?.id || "");
                                setEquipmentLogs(refreshed || []);

                                setMissionStatusModal(null);
                                setReturnNotes({});
                                setEquipmentReturnStates({});
                                toast.success("Mission completed and equipment returned.");
                            }}
                            className="bg-green-500 hover:bg-green-600 px-4 py-2 text-white font-semibold rounded-lg cursor-pointer transition duration-200 shadow-md hover:shadow-lg"
                        >
                            Complete Mission
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Mission;