import Active from "../assets/Active.svg";
import Available from "../assets/Available.svg";
import Damaged from "../assets/Damaged.svg";
import Decommissioned from "../assets/Decommissioned.svg"



function Splash() {
    return (
        <div className="flex flex-col w-full bg-secondary md:h-full rounded-2xl p-2 gap-5 items-center justify-center">
            <div className="flex flex-col items-start md:flex-row justify-between w-full gap-4 md:gap-0">
                <h1 className="text-primary font-normal md:text-3xl md:text-start text-center text-xl">Hi, here's whats happening <br />
                    with your inventory </h1>

                <div className="flex gap-4 items-center justify-center">
                    <button className="text-base font-inter px-6 py-2 rounded-lg bg-green-600 text-white font-bold cursor-pointer">Local Backup</button>
                </div>
            </div>
            <div className="flex flex-col items-center md:grid md:grid-cols-2 lg:flex-row lg:flex  justify-between w-full gap-2 font-inter">
                <div className="h-60 w-full  font-normal flex flex-col justify-evenly items-start p-4 rounded-xl bg-cardbg border-l-8 border-[#3E87DF] text-white">
                    <h4 className="text-2xl">Active in Field</h4>
                    <div className="flex flex-row w-full justify-between">
                        <p className="text-6xl font-bold">31</p>
                        <img src={Active} alt="Logo" />
                    </div>
                    <h4 className="text-xl">Deployed on Missions</h4>
                </div>
                <div className="h-60 w-full  font-normal flex flex-col justify-evenly items-start p-4 rounded-xl bg-cardbg border-l-8 border-[#44B072] text-white">
                    <h4 className="text-2xl">Available</h4>
                    <div className="flex flex-row w-full justify-between">
                        <p className="text-6xl font-bold">8</p>
                        <img src={Available} alt="Logo" />
                    </div>
                    <h4 className="text-xl">Ready for Deployment</h4>
                </div>
                <div className="h-60 w-full  font-normal flex flex-col justify-evenly items-start p-4 rounded-xl bg-cardbg border-l-8 border-[#EBAB47] text-white">
                    <h4 className="text-2xl">Damaged</h4>
                    <div className="flex flex-row w-full justify-between">
                        <p className="text-6xl font-bold">6</p>
                        <img src={Damaged} alt="Logo" />
                    </div>
                    <h4 className="text-xl">To be repaired</h4>
                </div>
                <div className="h-60 w-full  font-normal flex flex-col justify-evenly items-start p-4 rounded-xl bg-cardbg border-l-8 border-[#919191] text-white">
                    <h4 className="text-2xl">Decommissioned</h4>
                    <div className="flex flex-row w-full justify-between">
                        <p className="text-6xl font-bold">2</p>
                        <img src={Decommissioned} alt="Logo" />
                    </div>
                    <h4 className="text-xl">Permanently Retired</h4>
                </div>
            </div>
            <div className="flex flex-col lg:grid lg:grid-cols-8 items-center justify-center w-full gap-2 h-full">
                <div className="col-span-5 bg-cardbg h-full rounded-xl p-5 w-full">g</div>
                <div className="col-span-3 flex flex-col items-center w-full h-full gap-2">
                    <div className="flex-2 w-full bg-cardbg rounded-xl p-4">g</div>
                    <div className="flex-1 w-full bg-cardbg rounded-xl p-4">g</div>
                </div>
            </div>
        </div >
    )
}

export default Splash
