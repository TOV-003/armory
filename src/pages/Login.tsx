import { useNavigate } from "react-router-dom";
import Equipment from "../assets/Equipment.svg";
import toast from "react-hot-toast";
import { useAuth } from "../context/useAuth";
import { useState, useEffect, useRef } from "react";
export default function Login() {
    const navigate = useNavigate();
    const { login, user, loginWithGoogle } = useAuth();
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
                    className="text-secondary hover:text-indigo-600 font-semibold flex items-center gap-2 cursor-pointer"
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
                        <button
                            type="button"
                            className="cursor-pointer w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg text-lg transition duration-300 ease-in-out shadow-md hover:shadow-lg border border-gray-300"
                            onClick={loginWithGoogle}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-6 h-6">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                                <path fill="none" d="M0 0h48v48H0z" />
                            </svg>
                            Sign in with Google
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