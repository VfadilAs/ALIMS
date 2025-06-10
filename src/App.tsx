 import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import { Route, Routes } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <><Routes>
     <Route path='/'element={<LoginPage/>} />
     <Route path='/Dashboard'element={<DashboardPage/>} /></Routes>
    </>
  )
}

export default App
