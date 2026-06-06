import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthContextProvider from './context/AuthContext';
import './index.css'
import App from './App.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Home from './pages/Home.tsx'
import ErrorPage from './pages/ErrorPage.tsx'
import Login from './pages/Login.tsx'
import SignUp from './pages/SignUp.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <SignUp />,
      }
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </StrictMode >,
)

