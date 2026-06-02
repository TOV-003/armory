import { useNavigate } from "react-router-dom"
function Home() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/dashboard')
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-white">
      <h1>Welcome to Armory!</h1>
      <p className="text-lg">Armory is a platform for creating and managing your own inventory of equipment.</p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleClick}>Get Started</button>
    </div>
  )
}

export default Home
