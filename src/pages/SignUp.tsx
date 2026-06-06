import { useNavigate } from "react-router-dom";
import Equipment from "../assets/Equipment.svg"; // Assuming a logo

export default function SignUp() {
    const navigate = useNavigate();

    const handleSignUp = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        navigate('/dashboard');
    };

    const handleSignInRedirect = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-primary text-white flex flex-col p-4">
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => navigate('/')}
                    className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2"
                >
                    ← Back to Home
                </button>
            </div>
            <div className="flex flex-col flex-1 items-center justify-center">
                <div className="bg-cardbg p-8 rounded-lg shadow-xl max-w-md w-full text-center">
                    <img src={Equipment} alt="Armory Logo" className="w-16 h-16 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold mb-6">Create Your Armory Account</h2>
                    <form className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full p-3 rounded-md text-primary bg-secondary border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full p-3 rounded-md text-primary bg-secondary border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full p-3 rounded-md text-primary bg-secondary border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                className="w-full p-3 rounded-md text-primary bg-secondary border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-md text-lg transition duration-300 ease-in-out transform hover:scale-105"
                            onClick={handleSignUp}
                        >
                            Sign Up
                        </button>
                    </form>
                    <p className="mt-6 text-gray-400">
                        Already have an account?{" "}
                        <span
                            className="text-blue-400 hover:underline cursor-pointer"
                            onClick={handleSignInRedirect}
                        >
                            Sign In
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}