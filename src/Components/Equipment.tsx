import { useEffect, useState } from "react"
import { useAuth } from "../context/useAuth"
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CATEGORIES } from "../assets/CATEGORIES";




function Equipment() {
    const [isAll, setIsAll] = useState<boolean>(true);
    const [isAvailable, setIsAvailable] = useState<boolean>(false);
    const [isDamaged, setIsDamaged] = useState<boolean>(false);
    const [isDecommissioned, setIsDecomissioned] = useState<boolean>(false);
    const [newEquipmentModal, setNewEquipmentModal] = useState<boolean>(false);
    const [creatingEquipment, setCreatingEquipment] = useState<boolean>(false);
    const { user, workspace, createEquipment } = useAuth();
    const navigate = useNavigate();
    const [categoryOpen, setCategoryOpen] = useState(false);
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
        setIsDamaged(false);
        setIsDecomissioned(false);
    }
    function setAvailable() {
        setIsAll(false);
        setIsAvailable(true);
        setIsDamaged(false);
        setIsDecomissioned(false);
    }
    function setDamaged() {
        setIsAll(false);
        setIsAvailable(false);
        setIsDamaged(true);
        setIsDecomissioned(false);
    }
    function setDecomissioned() {
        setIsAll(false);
        setIsAvailable(false);
        setIsDamaged(false);
        setIsDecomissioned(true);
    }

    async function handleCreateEquipment(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setCreatingEquipment(true);
        console.log("New equipment data:", EquipmentData);
        await createEquipment(EquipmentData.name, EquipmentData.category, EquipmentData.serial_number);
        toast.success("Equipment created successfully!");
        setNewEquipmentModal(false);
        setCreatingEquipment(false);
        setEquipmentData({ name: "", serial_number: "", category: "" });
    }

    return (
        <div className="flex flex-col w-full bg-secondary md:h-full rounded-2xl p-2 gap-5 items-center justify-center">
            <div className="flex flex-col items-center md:flex-row justify-between w-full gap-4 md:gap-0">
                <h1 className="text-primary font-normal md:text-3xl md:text-start text-center text-xl">Equipment</h1>
                <p>{workspace.workspace_name}</p>
                <div className="flex gap-4 items-center justify-center">
                    <button
                        onClick={() => setNewEquipmentModal(true)}
                        className="text-base font-inter px-6 py-2 rounded-lg bg-blue-400 text-white font-bold cursor-pointer"
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
                <button className={`p-2 cursor-pointer ${isAll ? "bg-alternate text-white" : "md:border-r border-alternate"} w-40`} onClick={setAll}>All Equipment</button>
                <button className={`p-2 cursor-pointer ${isAvailable ? "bg-alternate text-white" : "md:border-r border-alternate"} w-40`} onClick={setAvailable}>Available</button>
                <button className={`p-2 cursor-pointer ${isDamaged ? "bg-alternate text-white" : "md:border-r border-alternate"} w-40`} onClick={setDamaged}>Damaged</button>
                <button className={`p-2 cursor-pointer ${isDecommissioned ? "bg-alternate text-white" : ""} w-40`} onClick={setDecomissioned}>Decommissioned</button>
            </div>
            <div className="col-span-5 bg-cardbg h-full rounded-xl p-5 w-full">g</div>
        </div >
    )
}

export default Equipment
