import { useState } from "react"




function Equipment() {
    const [isAll, setIsAll] = useState<boolean>(true);
    const [isAvailable, setIsAvailable] = useState<boolean>(false);
    const [isDamaged, setIsDamaged] = useState<boolean>(false);
    const [isDecommissioned, setIsDecomissioned] = useState<boolean>(false);

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

    return (
        <div className="flex flex-col w-full bg-secondary md:h-full rounded-2xl p-2 gap-5 items-center justify-center">
            <div className="flex flex-col items-center md:flex-row justify-between w-full gap-4 md:gap-0">
                <h1 className="text-primary font-normal md:text-3xl md:text-start text-center text-xl">Equipment</h1>

                <div className="flex gap-4 items-center justify-center">
                    <button className="text-base font-inter px-6 py-2 rounded-lg bg-blue-400 text-white font-bold cursor-pointer">Add new Equipment</button>
                </div>
            </div>
            <div className="flex items-center w-fit rounded-lg border border-alternate overflow-clip">
                <button className={`p-2 cursor-pointer ${isAll ? "bg-alternate text-white" : "border-r border-alternate"} w-40`} onClick={setAll}>All Equipment</button>
                <button className={`p-2 cursor-pointer ${isAvailable ? "bg-alternate text-white" : "border-r border-alternate"} w-40`} onClick={setAvailable}>Available</button>
                <button className={`p-2 cursor-pointer ${isDamaged ? "bg-alternate text-white" : "border-r border-alternate"} w-40`} onClick={setDamaged}>Damaged</button>
                <button className={`p-2 cursor-pointer ${isDecommissioned ? "bg-alternate text-white" : ""} w-40`} onClick={setDecomissioned}>Decommissioned</button>
            </div>
            <div className="col-span-5 bg-cardbg h-full rounded-xl p-5 w-full">g</div>
        </div >
    )
}

export default Equipment
