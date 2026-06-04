export default function Settings() {
    return (
        <div className="flex flex-col w-full bg-secondary md:h-full rounded-2xl p-2 gap-5 items-center justify-start">
            <div className="flex flex-col items-center  md:flex-row justify-between w-full gap-4 md:gap-0">
                <h1 className="text-primary font-normal md:text-3xl md:text-start text-center text-xl">Settings </h1>

                <div className="flex gap-4 items-center justify-center">
                    <button className="text-base font-inter px-6 py-2 rounded-lg bg-green-600 text-white font-bold cursor-pointer">Local Backup</button>
                </div>
            </div>
            <div className="flex flex-col items-center md:items-start justify-between w-full gap-4">
                <h1 className="text-primary font-normal md:text-3xl md:text-start text-center text-xl ">Workspaces: </h1>
                <div className="flex flex-col items-center md:grid md:grid-cols-2 lg:grid-cols-4 lg:grid lg:place-items-center justify-between w-full gap-2 font-inter">
                    <div className="h-60 w-60  font-normal flex flex-col justify-evenly items-start p-4 rounded-xl bg-cardbg border-l-8 border-[#3E87DF] text-white">
                        <h4 className="text-2xl">Workspace 1</h4>
                        <h4 className="text-xl">Equipments:</h4>
                        <div className="flex flex-row w-full justify-between">
                            <p className="text-3xl font-bold">31</p>
                        </div>
                        <h4 className="text-xl">Missions:</h4>
                        <div className="flex flex-row w-full justify-between">
                            <p className="text-3xl font-bold">12</p>
                        </div>

                    </div>
                    <div className="h-60 w-60  font-normal flex flex-col justify-evenly items-start p-4 rounded-xl bg-cardbg border-l-8 border-[#3E87DF] text-white">
                        <h4 className="text-2xl">Workspace 2</h4>
                        <h4 className="text-xl">Equipments:</h4>
                        <div className="flex flex-row w-full justify-between">
                            <p className="text-3xl font-bold">31</p>
                        </div>
                        <h4 className="text-xl">Missions:</h4>
                        <div className="flex flex-row w-full justify-between">
                            <p className="text-3xl font-bold">12</p>
                        </div>

                    </div>
                    <div className="h-60 w-60  font-normal flex flex-col justify-evenly items-start p-4 rounded-xl bg-cardbg border-l-8 border-[#3E87DF] text-white">
                        <h4 className="text-2xl">Workspace 3</h4>
                        <h4 className="text-xl">Equipments:</h4>
                        <div className="flex flex-row w-full justify-between">
                            <p className="text-3xl font-bold">31</p>
                        </div>
                        <h4 className="text-xl">Missions:</h4>
                        <div className="flex flex-row w-full justify-between">
                            <p className="text-3xl font-bold">12</p>
                        </div>

                    </div>
                    <div className="h-60 w-60  font-normal flex flex-col justify-evenly items-start p-4 rounded-xl bg-cardbg border-l-8 border-[#3E87DF] text-white">
                        <h4 className="text-2xl">Workspace 4</h4>
                        <h4 className="text-xl">Equipments:</h4>
                        <div className="flex flex-row w-full justify-between">
                            <p className="text-3xl font-bold">31</p>
                        </div>
                        <h4 className="text-xl">Missions:</h4>
                        <div className="flex flex-row w-full justify-between">
                            <p className="text-3xl font-bold">12</p>
                        </div>

                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center md:items-start justify-between w-full gap-4 text-primary">
                <h1 className="text-primary font-normal md:text-3xl md:text-start text-center text-xl ">Account Info: </h1>
                <div className="flex flex-wrap gap-4 items-center justify-start w-full">
                    <p>Username: admin</p>
                    <p>Email: admin@admin.com</p>
                    <p>Total Missions Created: 12</p>
                    <p>Total Equipments: 8</p>
                </div>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-info/10 text-info border border-info/30 text-sm font-medium transition-all duration-150 hover:opacity-85 active:scale-[0.97] cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
                    Edit Account
                </button>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-secondary text-primary border border-border-secondary text-sm font-medium transition-all duration-150 hover:bg-tertiary hover:border-border-primary active:scale-[0.97] cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" /><path d="M9 12h12l-3 -3m0 6l3 -3" /></svg>
                    Logout
                </button>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-danger/10 text-danger border border-danger/30 text-sm font-medium transition-all duration-150 hover:opacity-85 active:scale-[0.97] cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                    Delete Account
                </button>
            </div>

        </div >
    )
}

