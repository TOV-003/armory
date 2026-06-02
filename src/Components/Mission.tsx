import Active from "../assets/Active.svg";
import Decommissioned from "../assets/Decommissioned.svg"



function Mission() {
    return (
        <div className="flex flex-col w-full bg-secondary md:h-full rounded-2xl p-2 gap-5 items-center justify-center">
            <div className="flex flex-col items-center md:flex-row justify-between w-full gap-4 md:gap-0">
                <h1 className="text-primary font-normal md:text-3xl md:text-start text-center text-xl">Missions </h1>

                <div className="flex gap-4 items-center justify-center">
                    <button className="text-base font-inter px-6 py-2 rounded-lg bg-blue-400 text-white font-bold cursor-pointer">New Mission</button>
                </div>
            </div>
            <div className="flex flex-col items-center md:grid md:grid-cols-2 lg:flex-row lg:flex  justify-between w-full gap-2 font-inter">
                <div className="h-40 w-full  font-normal flex flex-col justify-evenly items-start p-4 rounded-xl bg-cardbg border-l-8 border-[#3E87DF] text-white">
                    <h4 className="text-2xl">Active Missions</h4>
                    <div className="flex flex-row w-full justify-between">
                        <p className="text-6xl font-bold">7</p>
                        <img src={Active} alt="Logo" />
                    </div>
                </div>
                <div className="h-40 w-full  font-normal flex flex-col justify-evenly items-start p-4 rounded-xl bg-cardbg border-l-8 border-[#919191] text-white">
                    <h4 className="text-2xl">Completed Missions</h4>
                    <div className="flex flex-row w-full justify-between">
                        <p className="text-6xl font-bold">23</p>
                        <img src={Decommissioned} alt="Logo" />
                    </div>
                </div>
            </div>
            <div className="col-span-5 bg-cardbg h-full rounded-xl p-5 w-full">g</div>
        </div >
    )
}

export default Mission
