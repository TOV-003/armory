import { useNavigate } from "react-router-dom"
import Equipment from "../assets/Equipment.svg";

function Home() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/signup')
  }

  const handleSignIn = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-primary text-white flex flex-col items-center p-4 sm:p-8 md:p-12">
      <header className="w-full max-w-6xl flex flex-col gap-4 md:flex-row justify-between items-center mb-16 px-4">
        <div className="flex items-center gap-3">
          <img src={Equipment} alt="Armory Logo" className="w-8 h-8" />
          <span className="text-xl font-bold tracking-wider">ARMORY</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={handleSignIn} className="text-gray-300 hover:text-white transition-colors cursor-pointer font-medium">
            Sign In
          </button>
          <button onClick={handleClick} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition-all cursor-pointer shadow-lg shadow-blue-500/20">
            Get Started
          </button>
        </div>
      </header>

      <section className="text-center max-w-4xl mx-auto mb-16">
        <img src={Equipment} alt="Armory Logo" className="w-24 h-24 mx-auto mb-6" />
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 leading-tight">
          Manage Your Arsenal with <span className="text-blue-400">Armory</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Streamline your equipment and mission management with this intuitive and powerful platform.
        </p>
        <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          We do not recommend using Armory on a smartphone or a computer with a narrow screen in portrait orientation. However the horizontal layout is optimized for mobile devices.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-xl shadow-blue-500/20 w-full sm:w-auto"
            onClick={handleClick}
          >
            Get Started Today
          </button>
          <button
            className="bg-transparent border border-gray-600 hover:border-gray-400 text-white font-bold py-3 px-8 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 w-full sm:w-auto"
            onClick={handleSignIn}
          >
            Sign In
          </button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold mb-10">Why Choose Armory?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-cardbg p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-3">Intuitive Dashboard</h3>
            <p className="text-gray-300">
              Keep track of all your assets and missions from a single, easy-to-use interface.
            </p>
          </div>
          <div className="bg-cardbg p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-3">Efficient Equipment Tracking</h3>
            <p className="text-gray-300">
              Monitor the status of your equipment, whether it's active, available, or damaged.
            </p>
          </div>
          <div className="bg-cardbg p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-3">Seamless Mission Planning</h3>
            <p className="text-gray-300">
              Organize and manage your missions with clear overviews and detailed insights.
            </p>
          </div>
        </div>
      </section>

      <section className="text-center max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold mb-6">Ready to Optimize Your Operations?</h2>
        <p className="text-lg text-gray-300 mb-8">
          Join countless users who are transforming their inventory management with Armory.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-xl shadow-green-500/20 w-full sm:w-auto"
            onClick={handleClick}
          >
            Start Your Journey
          </button>
        </div>
      </section>
    </div>
  )
}

export default Home
