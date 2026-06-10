import { useAuth } from "../context/useAuth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface Workspace {
    id: string;
    name: string;
    description: string;
    user_id: string;
}

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
    workspaces: Workspace[];
    setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>;
    equipments: Equipment[];
    missions: Missions[];
}

export default function Settings({ workspaces, setWorkspaces, equipments, missions }: SettingsProps) {
    const { user, logout, loading, workspace, setWorkspace, createWorkspace, deleteWorkspace, getWorkspaces, setLastActiveWorkspace } = useAuth();
    const navigate = useNavigate();
    const [newWorkspaceModal, setNewWorkspaceModal] = useState<boolean>(false);
    const [deleteWorkspaceModal, setDeleteWorkspaceModal] = useState<boolean>(false);
    const [workSpaceData, setWorkSpaceData] = useState({
        name: "",
        description: "",
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate, workspace]);

    async function handleCreateWorkspace(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await createWorkspace(workSpaceData.name, workSpaceData.description);
        const updated = await getWorkspaces();
        setWorkspaces(updated);
        toast.success("Workspace created successfully!");
        setNewWorkspaceModal(false);
        setWorkSpaceData({ name: "", description: "" });
    }

    async function handleDeleteWorkspace(workspaceId: string) {
        await deleteWorkspace(workspaceId);
        setWorkspaces(prev => prev.filter(w => w.id !== workspaceId));
        toast.success("Workspace deleted successfully!");
        setDeleteWorkspaceModal(false);
    }

    async function handleSelectWorkspace(workspaceId: string, workspaceName: string) {
        setWorkspace({ workspace_id: workspaceId, workspace_name: workspaceName });
        toast.success("Workspace selected!");
        try {
            await setLastActiveWorkspace(workspaceId, workspaceName)
        }
        finally {
            console.log("Selected workspace:", workspaceId);
            setNewWorkspaceModal(false);
            setDeleteWorkspaceModal(false);
        }
    }

    async function handleLogout() {
        toast.success("Logged out!");
        await logout();
        navigate('/');
    }

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
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-60 w-60 flex flex-col justify-evenly items-start p-4 rounded-xl bg-cardbg border-l-8 border-gray-300">
                                <div className="h-7 w-32 bg-gray-300 rounded"></div>
                                <div className="h-5 w-24 bg-gray-300 rounded"></div>
                                <div className="h-8 w-12 bg-gray-300 rounded"></div>
                                <div className="h-5 w-20 bg-gray-300 rounded"></div>
                                <div className="h-8 w-12 bg-gray-300 rounded"></div>
                            </div>
                        ))}
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
        );
    }

    return (
        <div className="flex flex-col w-full bg-linear-to-br from-white to-gray-50 md:h-full rounded-2xl p-6 gap-5 items-center justify-start shadow-lg">
            <div className="flex flex-col items-center md:flex-row justify-between w-full gap-4 md:gap-0">
                <h1 className="text-gray-900 font-normal md:text-2xl md:text-start text-center text-xl">Settings</h1>
                <div className="flex gap-4 items-center justify-center">
                    <button
                        className="text-base px-6 py-2 rounded-lg bg-secondary hover:bg-indigo-600 text-white font-k2d font-semibold cursor-pointer shadow-lg hover:shadow-xl transition-all"
                        onClick={() => setNewWorkspaceModal(true)}
                    >
                        Create New Workspace
                    </button>
                </div>
            </div>

            <div className="flex flex-col items-center md:items-start justify-between w-full gap-4">
                <h1 className="text-gray-900 font-normal md:text-2xl md:text-start text-center text-xl">Workspaces:</h1>
                <div className="flex flex-col items-center md:grid md:grid-cols-2 md:place-items-center md:w-fit md:self-center lg:grid-cols-4 lg:grid lg:place-items-center justify-between w-full gap-4 font-inter">
                    {workspaces.length > 0 ? workspaces.map((el) => (
                        <div key={el.id} className="h-full w-60 font-k2d font-normal flex flex-col justify-evenly items-start p-6 rounded-2xl bg-white border-l-8 border-secondary text-gray-900 shadow-lg hover:shadow-xl transition-shadow">
                            <h4 className="text-xl">{el.name}</h4>
                            <h4 className="text-lg">Equipments:</h4>
                            <div className="flex flex-row w-full justify-between">
                                <p className="text-2xl font-bold">
                                    {(() => {
                                        return equipments.filter(eq => eq.workspace_id === el.id).length;
                                    })()}
                                </p>
                            </div>
                            <h4 className="text-lg">Missions:</h4>
                            <div className="flex flex-row w-full justify-between">
                                <p className="text-2xl font-bold">12</p>
                            </div>
                            <p className="text-sm w-full h-full font-k2d">Description: {el.description}</p>
                            <button
                                onClick={() => setDeleteWorkspaceModal(true)}
                                className="bg-red-600/70 self-center backdrop-blur-xl hover:bg-red-600/80 px-4 py-2 text-white font-semibold rounded-xl cursor-pointer transition duration-200 mt-2"
                            >
                                Delete Workspace
                            </button>
                            {workspace.workspace_id === el.id ? (
                                <button className="bg-primary/70 self-center backdrop-blur-xl hover:bg-primary/80 text-alternate text-shadow-alternate px-4 py-2 font-semibold rounded-xl transition duration-200 mt-2">
                                    Current Workspace
                                </button>
                            ) : (
                                <button
                                    className="bg-green-600/70 self-center backdrop-blur-xl hover:bg-green-600/80 px-4 py-2 text-white font-semibold rounded-xl cursor-pointer transition duration-200 mt-2"
                                    onClick={() => handleSelectWorkspace(el.id, el.name)}
                                >
                                    Select Workspace
                                </button>
                            )}
                            {deleteWorkspaceModal && (
                                <div
                                    onClick={() => setDeleteWorkspaceModal(false)}
                                    className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                                >
                                    <div
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex flex-col text-primary text-center gap-4 max-w-md w-full border border-white/70 bg-blue-200 p-6 rounded-lg"
                                    >
                                        <p>Are you sure you want to delete this workspace?</p>
                                        <button
                                            onClick={() => handleDeleteWorkspace(el.id)}
                                            className="bg-red-600/70 backdrop-blur-xl hover:bg-red-600/80 px-4 py-2 text-white font-semibold rounded-xl cursor-pointer transition duration-200"
                                        >
                                            Delete Workspace
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )) : (
                        <h1 className="text-gray-900 font-k2d font-normal md:text-start text-center text-md">No Workspaces Found</h1>
                    )}
                </div>

                {newWorkspaceModal && (
                    <div
                        onClick={() => setNewWorkspaceModal(false)}
                        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                    >
                        <form
                            onSubmit={handleCreateWorkspace}
                            onClick={(e) => e.stopPropagation()}
                            className="flex flex-col gap-4 max-w-md w-full border border-gray-200 bg-white p-6 rounded-2xl shadow-lg"
                        >
                            <label className="text-gray-900 font-semibold">
                                New WorkSpace Name:
                                <input
                                    type="text"
                                    placeholder="Workspace Name"
                                    className="w-full p-3 rounded-lg text-gray-900 bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary mt-2"
                                    value={workSpaceData.name}
                                    onChange={(e) => setWorkSpaceData({ ...workSpaceData, name: e.target.value })}
                                />
                            </label>
                            <label className="text-gray-900 font-semibold">
                                New WorkSpace Description:
                                <textarea
                                    placeholder="Workspace Description"
                                    className="w-full p-3 rounded-lg text-gray-900 bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary mt-2"
                                    value={workSpaceData.description}
                                    onChange={(e) => setWorkSpaceData({ ...workSpaceData, description: e.target.value })}
                                />
                            </label>
                            <button
                                type="submit"
                                className="bg-secondary hover:bg-indigo-600 px-4 py-2 text-white font-semibold rounded-lg cursor-pointer transition duration-200 shadow-md hover:shadow-lg"
                            >
                                Create Workspace
                            </button>
                        </form>
                    </div>
                )}
            </div>

            <div className="flex flex-col items-center md:items-start justify-between w-full gap-4 text-gray-700">
                <h1 className="text-gray-900 font-normal md:text-2xl md:text-start text-center text-xl">Account Info:</h1>
                <div className="flex flex-wrap gap-4 items-center justify-start w-full text-gray-600">
                    <p>Username: admin</p>
                    <p>Email: {user?.email}</p>
                    <p>Total Missions Created: {missions.filter(el => el.user_id === user?.id).length}</p>
                    <p>Total Equipments: {equipments.filter(el => el.user_id === user?.id).length}</p>
                </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-secondary/10 text-secondary border border-secondary/30 text-sm font-medium transition-all duration-150 hover:opacity-85 active:scale-[0.97] cursor-pointer shadow-md hover:shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
                    Edit Account
                </button>
                <button
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-secondary text-white border border-secondary text-sm font-medium transition-all duration-150 hover:bg-indigo-600 hover:border-indigo-600 active:scale-[0.97] cursor-pointer shadow-md hover:shadow-lg"
                    onClick={handleLogout}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" /><path d="M9 12h12l-3 -3m0 6l3 -3" /></svg>
                    Logout
                </button>
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-500/10 text-red-600 border border-red-500/30 text-sm font-medium transition-all duration-150 hover:opacity-85 active:scale-[0.97] cursor-pointer shadow-md hover:shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                    Delete Account
                </button>
            </div>
        </div>
    );
}