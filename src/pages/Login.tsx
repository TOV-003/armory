import { useNavigate } from "react-router-dom";
import Equipment from "../assets/Equipment.svg";
import toast from "react-hot-toast";
import { useAuth } from "../context/useAuth";
import { useState, useEffect, useRef } from "react";
export default function Login() {
    const navigate = useNavigate();
    const { login, user } = useAuth();
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const justLoggedIn = useRef(false);

    async function handleSignIn(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setIsProcessing(true);
        try {
            justLoggedIn.current = true;
            await login(formData.email, formData.password);
            toast.success("Successfully signed in!");
            setIsProcessing(false);
            navigate('/dashboard');
        } catch (error) {
            justLoggedIn.current = false;
            console.error(error);
            toast.error("Failed to sign in.");
            setIsProcessing(false);
        }
    }

    useEffect(() => {
        if (!user) return;
        if (justLoggedIn.current) return; // skip if we just logged in normally

        setTimeout(() => {
            toast.success("Already signed in! Redirecting to dashboard...");
            navigate('/dashboard');
        }, 500);
    }, [user, navigate]);


    const handleSignUpRedirect = () => {
        navigate('/signup');
    };

    const handleForgotPassword = () => {
        console.log("Forgot password clicked");
        alert("Forgot password functionality not implemented yet!");
    };

    return (
        <div className="min-h-screen bg-primary text-gray-900 flex flex-col p-4">
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => navigate('/')}
                    className="text-secondary hover:text-indigo-600 font-semibold flex items-center gap-2"
                >
                    ← Back to Home
                </button>
            </div>
            <div className="flex flex-col flex-1 items-center justify-center">
                <div className="bg-cardbg p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-200">
                    <img src={Equipment} alt="Armory Logo" className="w-16 h-16 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold mb-6 text-gray-900">Welcome Back to Armory</h2>
                    <form className="space-y-4">
                        <div>
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full p-3 rounded-lg text-gray-900 bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full p-3 rounded-lg text-gray-900 bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full cursor-pointer bg-secondary hover:bg-indigo-600 text-white font-bold py-3 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
                            onClick={handleSignIn}
                        >
                            {isProcessing ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                    <p className="mt-4 text-sm text-gray-600">
                        <span className="text-secondary hover:underline cursor-pointer" onClick={handleForgotPassword}>
                            Forgot Password?
                        </span>
                    </p>
                    <p className="mt-6 text-gray-600">
                        Don't have an account?{" "}
                        <span
                            className="text-secondary hover:underline cursor-pointer font-semibold"
                            onClick={handleSignUpRedirect}
                        >
                            Sign Up
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}