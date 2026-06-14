import { useNavigate } from "react-router-dom";
import Equipment from "../assets/Equipment.svg";
import toast from "react-hot-toast";
import { useAuth } from "../context/useAuth";
import { useState, useEffect } from "react";

export default function SignUp() {
    const navigate = useNavigate();
    const { signup, user } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        phone: "",
    });


    useEffect(() => {
        if (user) {
            toast.success("Already signed in! Redirecting to dashboard...");
            setTimeout(() => navigate('/dashboard'), 500);
        }
    }, [user, navigate]);

    async function handleSignUp(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        try {
            await signup(formData.email, formData.password, formData.name, formData.phone);
            alert("Check your email for a verification link!");
            toast.success("Successfully signed up!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to sign up.");
        }
        finally {
            setTimeout(() => navigate('/dashboard'), 500);
        }
    };

    const handleSignInRedirect = () => {
        navigate('/login');
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
                    <h2 className="text-3xl font-bold mb-6 text-gray-900">Create Your Armory Account</h2>
                    <form className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full p-3 rounded-lg text-gray-900 bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full p-3 rounded-lg text-gray-900 bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Phone Number (e.g. +234 9034432212)"
                                className="w-full p-3 rounded-lg text-gray-900 bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                        <div>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                className="w-full p-3 rounded-lg text-gray-900 bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-secondary hover:bg-indigo-600 text-white font-bold py-3 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl"
                            onClick={handleSignUp}
                        >
                            Sign Up
                        </button>
                    </form>
                    <p className="mt-6 text-gray-600">
                        Already have an account?{" "}
                        <span
                            className="text-secondary hover:underline cursor-pointer font-semibold"
                            onClick={handleSignInRedirect}
                        >
                            Sign In
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}