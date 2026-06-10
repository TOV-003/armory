import { useEffect, useState } from "react"
import { useAuth } from "../context/useAuth"
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CATEGORIES } from "../assets/CATEGORIES";


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
interface SettingsProps {
    equipments: Equipment[];
    setEquipments: React.Dispatch<React.SetStateAction<Equipment[]>>;
}


function Equipment({ equipments, setEquipments }: SettingsProps) {
    const [isAll, setIsAll] = useState<boolean>(true);
    const [isAvailable, setIsAvailable] = useState<boolean>(false);
    const [isDamaged, setIsDamaged] = useState<boolean>(false);
    const [isInUse, setIsInUse] = useState<boolean>(false);
    const [isDecommissioned, setIsDecomissioned] = useState<boolean>(false);
    const [newEquipmentModal, setNewEquipmentModal] = useState<boolean>(false);
    const [creatingEquipment, setCreatingEquipment] = useState<boolean>(false);
    const { user, workspace, createEquipment, updateEquipmentState } = useAuth();
    const navigate = useNavigate();
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [stateModalId, setStateModalId] = useState<string | null>(null);
    const [EquipmentData, setEquipmentData] = useState({
        name: "",
        serial_number: "",
        category: "",
    });

    useEffect(() => {
        console.log(workspace);
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate, workspace]);

    function setAll() {
        setIsAll(true);
        setIsAvailable(false);
        setIsInUse(false);
        setIsDamaged(false);
        setIsDecomissioned(false);
    }
    function setAvailable() {
        setIsAll(false);
        setIsAvailable(true);
        setIsInUse(false);
        setIsDamaged(false);
        setIsDecomissioned(false);
    }
    function setDamaged() {
        setIsAll(false);
        setIsAvailable(false);
        setIsInUse(false);
        setIsDamaged(true);
        setIsDecomissioned(false);
    }
    function setDecomissioned() {
        setIsAll(false);
        setIsAvailable(false);
        setIsInUse(false);
        setIsDamaged(false);
        setIsDecomissioned(true);
    }
    function setInUse() {
        setIsAll(false);
        setIsAvailable(false);
        setIsInUse(true);
        setIsDamaged(false);
        setIsDecomissioned(false);
    }

    async function handleCreateEquipment(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setCreatingEquipment(true);
        const newEquipment = await createEquipment(EquipmentData.name, EquipmentData.category, EquipmentData.serial_number);
        setEquipments(prev => [...prev, newEquipment]);
        toast.success("Equipment created successfully!");
        setNewEquipmentModal(false);
        setCreatingEquipment(false);
        setEquipmentData({ name: "", serial_number: "", category: "" });
    }

    async function handleUpdateState(equipmentId: string, newState: string) {
        await updateEquipmentState(equipmentId, newState);
        setEquipments(prev => prev.map(el => el.id === equipmentId ? { ...el, state: newState } : el));
        setStateModalId(null);
    }

    return (
        <div className="flex flex-col w-full bg-linear-to-br from-white to-gray-50 md:h-full rounded-2xl p-6 gap-5 items-center justify-center shadow-lg">
            <div className="flex flex-col items-center md:flex-row justify-between w-full gap-4 md:gap-0">
                <h1 className="text-gray-900 font-normal md:text-3xl md:text-start text-center text-xl">Equipment</h1>
                <p className="text-gray-700">{workspace.workspace_name}</p>
                <div className="flex gap-4 items-center justify-center">
                    <button
                        onClick={() => setNewEquipmentModal(true)}
                        className="text-base px-6 py-2 rounded-lg bg-secondary hover:bg-indigo-600 text-white font-bold cursor-pointer shadow-lg hover:shadow-xl transition-all"
                    >Add new Equipment</button>
                    {newEquipmentModal && (
                        <div
                            onClick={() => setNewEquipmentModal(false)}
                            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                        >
                            <form
                                onSubmit={handleCreateEquipment}
                                onClick={(e) => e.stopPropagation()}
                                className="flex flex-col gap-4 max-w-md w-full border border-gray-200 bg-white p-6 rounded-2xl shadow-lg"
                            >
                                <label className="text-gray-900 font-semibold">
                                    New Equipment Name:
                                    <input
                                        type="text"
                                        placeholder="Equipment Name"
                                        className="w-full p-3 rounded-lg text-gray-900 bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary mt-2"
                                        value={EquipmentData.name}
                                        onChange={(e) => setEquipmentData({ ...EquipmentData, name: e.target.value })}
                                    />
                                </label>
                                <label className="text-gray-900 font-semibold">
                                    New Equipment Serial Number:
                                    <input
                                        placeholder="Equipment Description"
                                        className="w-full p-3 rounded-lg text-gray-900 bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary mt-2"
                                        value={EquipmentData.serial_number}
                                        onChange={(e) => setEquipmentData({ ...EquipmentData, serial_number: e.target.value })}
                                    />
                                </label>
                                <label className="text-gray-900 font-semibold">
                                    New Equipment Category:
                                    <div className="relative mt-2">
                                        <input
                                            placeholder="Type to search categories..."
                                            className="w-full p-3 rounded-lg text-gray-900 bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                                            value={EquipmentData.category}
                                            autoComplete="off"
                                            onFocus={() => setCategoryOpen(true)}
                                            onBlur={() => {
                                                setCategoryOpen(false);
                                                if (!CATEGORIES.includes(EquipmentData.category)) {
                                                    setEquipmentData({ ...EquipmentData, category: "" });
                                                }
                                            }}
                                            onChange={(e) => setEquipmentData({ ...EquipmentData, category: e.target.value })}
                                        />
                                        {categoryOpen && (
                                            <div className="absolute z-50 w-full max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
                                                {CATEGORIES.filter(cat =>
                                                    cat.toLowerCase().includes(EquipmentData.category.toLowerCase())
                                                ).map(cat => (
                                                    <div
                                                        key={cat}
                                                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-gray-900 text-sm"
                                                        onMouseDown={() => {
                                                            setEquipmentData({ ...EquipmentData, category: cat });
                                                            setCategoryOpen(false);
                                                        }}
                                                    >
                                                        {cat}
                                                    </div>
                                                ))}
                                                {CATEGORIES.filter(cat =>
                                                    cat.toLowerCase().includes(EquipmentData.category.toLowerCase())
                                                ).length === 0 && (
                                                        <div className="px-3 py-2 text-sm text-gray-400 italic">No matches found</div>
                                                    )}
                                            </div>
                                        )}
                                    </div>
                                </label>
                                <button
                                    type="submit"
                                    className="bg-secondary hover:bg-indigo-600 px-4 py-2 text-white font-semibold rounded-lg cursor-pointer transition duration-200 shadow-md hover:shadow-lg"
                                >
                                    {
                                        creatingEquipment ?
                                            "Creating Equipment..."
                                            :
                                            "Create Equipment"
                                    }
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-center w-fit rounded-lg border border-secondary overflow-clip shadow-md">
                <button className={`p-2 cursor-pointer transition-all ${isAll ? "bg-secondary text-white shadow-md" : "md:border-r border-secondary text-gray-700 hover:bg-gray-100"} w-40 md:`} onClick={setAll}>All Equipment</button>
                <button className={`p-2 cursor-pointer transition-all ${isAvailable ? "bg-secondary text-white shadow-md" : "md:border-r border-secondary text-gray-700 hover:bg-gray-100"} w-40 md:w-fit`} onClick={setAvailable}>Available</button>
                <button className={`p-2 cursor-pointer transition-all ${isInUse ? "bg-secondary text-white shadow-md" : "md:border-r border-secondary text-gray-700 hover:bg-gray-100"} w-40 md:w-fit`} onClick={setInUse}>In Use</button>
                <button className={`p-2 cursor-pointer transition-all ${isDamaged ? "bg-secondary text-white shadow-md" : "md:border-r border-secondary text-gray-700 hover:bg-gray-100"} w-40 md:w-fit`} onClick={setDamaged}>Damaged</button>
                <button className={`p-2 cursor-pointer transition-all ${isDecommissioned ? "bg-secondary text-white shadow-md" : "text-gray-700 hover:bg-gray-100"} w-40 md:w-fit `} onClick={setDecomissioned}>Decommissioned</button>
            </div>
            <div className="col-span-5 bg-white h-full rounded-2xl md:p-5 w-full shadow-lg">
                {(() => {
                    const filtered = equipments
                        .filter(el => el.workspace_id === workspace.workspace_id)
                        .filter(el =>
                            isAll ? true :
                                isAvailable ? el.state === "AVAILABLE" :
                                    isInUse ? el.state === "IN_USE" :
                                        isDamaged ? el.state === "DAMAGED" :
                                            isDecommissioned ? el.state === "DECOMMISSIONED" :
                                                false
                        );

                    if (filtered.length === 0) return (
                        <h1 className="text-gray-900 font-k2d font-normal md:text-start text-center text-md">No Equipment Found</h1>
                    );

                    return (
                        <div className="w-full ">
                            <table className="w-full text-left text-gray-900 font-k2d">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-900 text-sm uppercase tracking-wider border-b border-gray-200">
                                        <th className="px-4 py-3">Name</th>
                                        <th className="px-4 py-3">Category</th>
                                        <th className="px-4 py-3 hidden md:block">Serial Number</th>
                                        <th className="px-4 py-3">State</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((el, index) => (
                                        <tr
                                            key={el.id}
                                            className={`border-t border-gray-200 hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                                        >
                                            <td className="px-4 py-3 text-gray-900 font-medium">{el.name}</td>
                                            <td className="px-4 py-3 text-gray-700">{el.category}</td>
                                            <td className="px-4 py-3 text-gray-600 font-mono text-sm hidden md:block">{el.serial_number}</td>
                                            <td className="px-4 py-3 relative">
                                                <button
                                                    onClick={el.state === "DAMAGED" ? () => setStateModalId(stateModalId === el.id ? null : el.id) : undefined}
                                                    className={`px-2 py-1 rounded-md text-xs font-semibold transition-opacity shadow-sm ${el.state === "DAMAGED" ? "cursor-pointer hover:opacity-80" : "cursor-default"
                                                        } ${el.state === "AVAILABLE" ? "bg-blue-100 text-blue-700 border border-blue-300" :
                                                            el.state === "IN_USE" ? "bg-green-100 text-green-700 border border-green-300" :
                                                                el.state === "DAMAGED" ? "bg-yellow-100 text-yellow-700 border border-yellow-300" :
                                                                    el.state === "DECOMMISSIONED" ? "bg-gray-100 text-gray-700 border border-gray-300" :
                                                                        "hidden"
                                                        }`}
                                                >
                                                    {el.state}
                                                </button>
                                                {stateModalId === el.id && (
                                                    <div className="absolute z-50 left-0 bottom-full mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden">
                                                        {(["AVAILABLE", "DECOMMISSIONED"] as const).map(state => (
                                                            <button
                                                                key={state}
                                                                onClick={() => handleUpdateState(el.id, state)}
                                                                className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-gray-100 ${el.state === state ? "opacity-40 cursor-default" : "cursor-pointer"
                                                                    } ${state === "AVAILABLE" ? "text-blue-700" : "text-gray-700"}`}
                                                                disabled={el.state === state}
                                                            >
                                                                {state}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                })()}
            </div>
        </div >
    )
}

export default Equipment
