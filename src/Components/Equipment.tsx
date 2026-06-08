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
        <div className="flex flex-col w-full bg-secondary md:h-full rounded-2xl p-2 gap-5 items-center justify-center">
            <div className="flex flex-col items-center md:flex-row justify-between w-full gap-4 md:gap-0">
                <h1 className="text-primary font-normal md:text-3xl md:text-start text-center text-xl">Equipment</h1>
                <p>{workspace.workspace_name}</p>
                <div className="flex gap-4 items-center justify-center">
                    <button
                        onClick={() => setNewEquipmentModal(true)}
                        className="text-base px-6 py-2 rounded-lg bg-blue-400 text-white font-bold cursor-pointer"
                    >Add new Equipment</button>
                    {newEquipmentModal && (
                        <div
                            onClick={() => setNewEquipmentModal(false)}
                            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                        >
                            <form
                                onSubmit={handleCreateEquipment}
                                onClick={(e) => e.stopPropagation()}
                                className="flex flex-col gap-4 max-w-md w-full border border-white/70 bg-blue-200 p-6 rounded-lg"
                            >
                                <label>
                                    New Equipment Name:
                                    <input
                                        type="text"
                                        placeholder="Equipment Name"
                                        className="w-full p-3 rounded-md text-primary bg-secondary border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={EquipmentData.name}
                                        onChange={(e) => setEquipmentData({ ...EquipmentData, name: e.target.value })}
                                    />
                                </label>
                                <label>
                                    New Equipment Serial Number:
                                    <input
                                        placeholder="Equipment Description"
                                        className="w-full p-3 rounded-md text-primary bg-secondary border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={EquipmentData.serial_number}
                                        onChange={(e) => setEquipmentData({ ...EquipmentData, serial_number: e.target.value })}
                                    />
                                </label>
                                <label>
                                    New Equipment Category:
                                    <div className="relative">
                                        <input
                                            placeholder="Type to search categories..."
                                            className="w-full p-3 rounded-md text-primary bg-secondary border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                            <div className="absolute z-50 w-full max-h-48 overflow-y-auto bg-secondary border border-gray-700 rounded-md mt-1 shadow-lg">
                                                {CATEGORIES.filter(cat =>
                                                    cat.toLowerCase().includes(EquipmentData.category.toLowerCase())
                                                ).map(cat => (
                                                    <div
                                                        key={cat}
                                                        className="px-3 py-2 cursor-pointer hover:bg-cardbg text-primary text-sm"
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
                                    className="bg-green-600/70 backdrop-blur-xl hover:bg-green-600/80 px-4 py-2 text-white font-semibold rounded-xl cursor-pointer transition duration-200"
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
            <div className="flex flex-col md:flex-row items-center w-fit rounded-lg border border-alternate overflow-clip">
                <button className={`p-2 cursor-pointer ${isAll ? "bg-alternate text-white" : "md:border-r border-alternate"} w-40 md:`} onClick={setAll}>All Equipment</button>
                <button className={`p-2 cursor-pointer ${isAvailable ? "bg-alternate text-white" : "md:border-r border-alternate"} w-40 md:w-fit`} onClick={setAvailable}>Available</button>
                <button className={`p-2 cursor-pointer ${isInUse ? "bg-alternate text-white" : "md:border-r border-alternate"} w-40 md:w-fit`} onClick={setInUse}>In Use</button>
                <button className={`p-2 cursor-pointer ${isDamaged ? "bg-alternate text-white" : "md:border-r border-alternate"} w-40 md:w-fit`} onClick={setDamaged}>Damaged</button>
                <button className={`p-2 cursor-pointer ${isDecommissioned ? "bg-alternate text-white" : ""} w-40 md:w-fit `} onClick={setDecomissioned}>Decommissioned</button>
            </div>
            <div className="col-span-5 bg-cardbg h-full rounded-xl md:p-5 w-full">
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
                        <h1 className="text-primary font-k2d font-normal md:text-start text-center text-md">No Equipment Found</h1>
                    );

                    return (
                        <div className="w-full ">
                            <table className="w-full text-left text-primary font-k2d">
                                <thead>
                                    <tr className="bg-cardbg text-white text-sm uppercase tracking-wider">
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
                                            className={`border-t border-white/10 hover:bg-white/5 transition-colors duration-150 ${index % 2 === 0 ? "bg-cardbg/30" : "bg-cardbg/10"}`}
                                        >
                                            <td className="px-4 py-3 text-white font-medium">{el.name}</td>
                                            <td className="px-4 py-3 text-white/80">{el.category}</td>
                                            <td className="px-4 py-3 text-white/80 font-mono text-sm hidden md:block">{el.serial_number}</td>
                                            <td className="px-4 py-3 relative">
                                                <button
                                                    onClick={() => setStateModalId(stateModalId === el.id ? null : el.id)}
                                                    className={`px-2 py-1 rounded-md text-xs font-semibold cursor-pointer transition-opacity hover:opacity-80 ${el.state === "AVAILABLE" ? "bg-blue-600/30 text-blue-400 border border-blue-500/30" :
                                                        el.state === "IN_USE" ? "bg-green-600/30 text-green-400 border border-green-500/30" :
                                                            el.state === "DAMAGED" ? "bg-yellow-600/30 text-yellow-400 border border-yellow-500/30" :
                                                                el.state === "DECOMMISSIONED" ? "bg-gray-600/30 text-gray-400 border border-gray-500/30" :
                                                                    "hidden"
                                                        }`}
                                                >
                                                    {el.state}
                                                </button>
                                                {stateModalId === el.id && (
                                                    <div className="absolute z-50 left-0 bottom-full mt-1 w-48 bg-secondary border border-white/20 rounded-xl shadow-xl overflow-hidden">
                                                        {(["AVAILABLE", "IN_USE", "DAMAGED", "DECOMMISSIONED"] as const).map(state => (
                                                            <button
                                                                key={state}
                                                                onClick={() => handleUpdateState(el.id, state)}
                                                                className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white/10 ${el.state === state ? "opacity-40 cursor-default" : "cursor-pointer"
                                                                    } ${state === "AVAILABLE" ? "text-blue-400" :
                                                                        state === "IN_USE" ? "text-green-400" :
                                                                            state === "DAMAGED" ? "text-yellow-400" :
                                                                                "text-gray-400"
                                                                    }`}
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
