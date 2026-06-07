import { useAuth } from "../context/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface Workspace {
    id: string;
    name: string;
    description: string;
    user_id: string;
}



export default function Settings() {
    const { user, logout, loading, setLoading, getWorkspaces, createWorkspace, deleteWorkspace } = useAuth();
    const navigate = useNavigate();
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [newWorkspaceModal, setNewWorkspaceModal] = useState<boolean>(false);
    const [deleteWorkspaceModal, setDeleteWorkspaceModal] = useState<boolean>(false);
    const [workSpaceData, setWorkSpaceData] = useState({
        name: "",
        description: "",
    });



    useEffect(() => {
        setLoading(true);
        if (!user) {
            window.location.href = '/login';
        }
        async function fetchWorkspaces() {
            try {
                const workspaces = await getWorkspaces();
                console.log("Fetched workspaces:", workspaces);
                setWorkspaces(workspaces);
                return workspaces;
            }
            catch (error) {
                console.error("Error fetching workspaces:", error);
            }
        }
        fetchWorkspaces();
        setLoading(false);
    }, [user, setLoading, getWorkspaces, newWorkspaceModal, deleteWorkspaceModal]);

    async function handleCreateWorkspace(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log("New workspace data:", workSpaceData);
        await createWorkspace(workSpaceData.name, workSpaceData.description);
        toast.success("Workspace created successfully!");
        setNewWorkspaceModal(false);
    }

    async function handleDeleteWorkspace(workspaceId: string) {
        await deleteWorkspace(workspaceId);
        toast.success("Workspace deleted successfully!");
        setDeleteWorkspaceModal(false);
    }


    async function handleLogout() {
        toast.success("Logged out!");
        await logout();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="flex flex-col w-full bg-secondary md:h-full rounded-2xl p-2 gap-5 items-center justify-start animate-pulse">
                <div className="flex flex-col items-center md:flex-row justify-between w-full gap-4 md:gap-0">
                    <div className="h-8 w-32 bg-gray-300 rounded md:w-40"></div>
                    <div className="flex gap-4 items-center justify-center">
                        <div className="h-10 w-32 bg-gray-300 rounded-lg"></div>
                    </div>
                </div>

                <div className="flex flex-col items-center md:items-start justify-between w-full gap-4">
                    <div className="h-8 w-44 bg-gray-300 rounded md:w-52"></div>
                    <div className="flex flex-col items-center md:grid md:grid-cols-2 md:place-items-center md:w-fit md:self-center lg:grid-cols-4 lg:grid lg:place-items-center justify-between w-full gap-2">

                        <div className="h-60 w-60 flex flex-col justify-evenly items-start p-4 rounded-xl bg-cardbg border-l-8 border-gray-300">
                            <div className="h-7 w-32 bg-gray-300 rounded"></div>
                            <div className="h-5 w-24 bg-gray-300 rounded"></div>
                            <div className="h-8 w-12 bg-gray-300 rounded"></div>
                            <div className="h-5 w-20 bg-gray-300 rounded"></div>
                            <div className="h-8 w-12 bg-gray-300 rounded"></div>
                        </div>

                        <div className="h-60 w-60 flex flex-col justify-evenly items-start p-4 rounded-xl bg-cardbg border-l-8 border-gray-300">
                            <div className="h-7 w-32 bg-gray-300 rounded"></div>
                            <div className="h-5 w-24 bg-gray-300 rounded"></div>
                            <div className="h-8 w-12 bg-gray-300 rounded"></div>
                            <div className="h-5 w-20 bg-gray-300 rounded"></div>
                            <div className="h-8 w-12 bg-gray-300 rounded"></div>
                        </div>

                        <div className="h-60 w-60 flex flex-col justify-evenly items-start p-4 rounded-xl bg-cardbg border-l-8 border-gray-300">
                            <div className="h-7 w-32 bg-gray-300 rounded"></div>
                            <div className="h-5 w-24 bg-gray-300 rounded"></div>
                            <div className="h-8 w-12 bg-gray-300 rounded"></div>
                            <div className="h-5 w-20 bg-gray-300 rounded"></div>
                            <div className="h-8 w-12 bg-gray-300 rounded"></div>
                        </div>

                        <div className="h-60 w-60 flex flex-col justify-evenly items-start p-4 rounded-xl bg-cardbg border-l-8 border-gray-300">
                            <div className="h-7 w-32 bg-gray-300 rounded"></div>
                            <div className="h-5 w-24 bg-gray-300 rounded"></div>
                            <div className="h-8 w-12 bg-gray-300 rounded"></div>
                            <div className="h-5 w-20 bg-gray-300 rounded"></div>
                            <div className="h-8 w-12 bg-gray-300 rounded"></div>
                        </div>

                    </div>
                </div>

                <div className="flex flex-col items-center md:items-start justify-between w-full gap-4">
                    <div className="h-8 w-40 bg-gray-300 rounded md:w-48"></div>
                    <div className="flex flex-wrap gap-4 items-center justify-start w-full">
                        <div className="h-5 w-36 bg-gray-300 rounded"></div>
                        <div className="h-5 w-48 bg-gray-300 rounded"></div>
                        <div className="h-5 w-44 bg-gray-300 rounded"></div>
                        <div className="h-5 w-36 bg-gray-300 rounded"></div>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap w-full justify-center md:justify-start">
                    <div className="h-10 w-36 bg-gray-300 rounded-lg"></div>
                    <div className="h-10 w-28 bg-gray-300 rounded-lg"></div>
                    <div className="h-10 w-40 bg-gray-300 rounded-lg"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full bg-secondary md:h-full rounded-2xl p-2 gap-5 items-center justify-start">
            <div className="flex flex-col items-center  md:flex-row justify-between w-full gap-4 md:gap-0">
                <h1 className="text-primary font-normal md:text-2xl md:text-start text-center text-xl">Settings </h1>

                <div className="flex gap-4 items-center justify-center">
                    <button className="text-base px-6 py-2 rounded-lg bg-green-600 text-white font-k2d font-semibold cursor-pointer" onClick={() => setNewWorkspaceModal(true)}>Create New Workspace</button>
                    {newWorkspaceModal && (
                        <div
                            onClick={() => setNewWorkspaceModal(false)}
                            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                        >
                            <form
                                onSubmit={handleCreateWorkspace}
                                onClick={(e) => e.stopPropagation()}
                                className="flex flex-col gap-4 max-w-md w-full border border-white/70 bg-blue-200 p-6 rounded-lg"
                            >
                                <label>
                                    New WorkSpace Name:
                                    <input
                                        type="text"
                                        placeholder="Workspace Name"
                                        className="w-full p-3 rounded-md text-primary bg-secondary border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={workSpaceData.name}
                                        onChange={(e) => setWorkSpaceData({ ...workSpaceData, name: e.target.value })}
                                    />
                                </label>
                                <label>
                                    New WorkSpace Description:
                                    <textarea
                                        placeholder="Workspace Description"
                                        className="w-full p-3 rounded-md text-primary bg-secondary border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={workSpaceData.description}
                                        onChange={(e) => setWorkSpaceData({ ...workSpaceData, description: e.target.value })}
                                    />
                                </label>
                                <button
                                    type="submit"
                                    className="bg-green-600/70 backdrop-blur-xl hover:bg-green-600/80 px-4 py-2 text-white font-semibold rounded-xl cursor-pointer transition duration-200"
                                >
                                    Create Workspace
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col items-center md:items-start justify-between w-full gap-4">
                <h1 className="text-primary font-normal md:text-2xl md:text-start text-center text-xl ">Workspaces: </h1>
                <div className="flex flex-col items-center md:grid md:grid-cols-2 md:place-items-center md:w-fit md:self-center lg:grid-cols-4 lg:grid lg:place-items-center justify-between w-full gap-2 font-inter">
                    {workspaces.length > 0 ?
                        workspaces.map((workspace) => (
                            <div key={workspace.id} className="min-h-60 w-60 font-k2d font-normal flex flex-col justify-evenly items-start p-4 rounded-xl bg-cardbg border-l-8 border-[#3E87DF] text-white">
                                <h4 className="text-2xl">{workspace.name}</h4>
                                <h4 className="text-xl">Equipments:</h4>
                                <div className="flex flex-row w-full justify-between">
                                    <p className="text-2xl font-bold">31</p>
                                </div>
                                <h4 className="text-xl">Missions:</h4>
                                <div className="flex flex-row w-full justify-between">
                                    <p className="text-2xl font-bold">12</p>
                                </div>
                                <p className="text-sm w-full h-full font-k2d">Description: {workspace.description}</p>
                                <button
                                    onClick={() => setDeleteWorkspaceModal(true)}
                                    className="bg-red-600/70 backdrop-blur-xl hover:bg-red-600/80 px-4 py-2 text-white font-semibold rounded-xl cursor-pointer transition duration-200 mt-2">
                                    Delete Workspace
                                </button>
                                {deleteWorkspaceModal && (
                                    <div
                                        onClick={() => setNewWorkspaceModal(false)}
                                        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                                    >
                                        <div className="flex flex-col gap-4 max-w-md w-full border border-white/70 bg-blue-200 p-6 rounded-lg">
                                            <p>Are you sure you want to delete this workspace?</p>
                                            <button
                                                onClick={() => handleDeleteWorkspace(workspace.id)}
                                                className="bg-red-600/70 backdrop-blur-xl hover:bg-red-600/80 px-4 py-2 text-white font-semibold rounded-xl cursor-pointer transition duration-200"
                                            >
                                                Delete Workspace
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                        :
                        <h1 className="text-primary font-k2d font-normal  md:text-start text-center text-md">No Workspaces Found</h1>
                    }
                </div>
            </div>
            <div className="flex flex-col items-center md:items-start justify-between w-full gap-4 text-primary">
                <h1 className="text-primary font-normal md:text-2xl md:text-start text-center text-xl ">Account Info: </h1>
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
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-secondary text-primary border border-border-secondary text-sm font-medium transition-all duration-150 hover:bg-tertiary hover:border-border-primary active:scale-[0.97] cursor-pointer" onClick={handleLogout}>
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

