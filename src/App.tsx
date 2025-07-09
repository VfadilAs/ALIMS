 import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import { Route, Routes } from 'react-router-dom'
import DataSiswaPage from './pages/DataSiswaPage'
import DataPengeluaranPage from './pages/DataPengeluaranPage'
import DataPemasukanPage from './pages/DataPemasukanPage'
import TotalSaldoPage from './pages/TotalSaldoPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <><Routes>
     <Route path='/'element={<LoginPage/>} />
     <Route path='/Dashboard'element={<DashboardPage/>} />
     <Route path='/DataSiswa'element={<DataSiswaPage/>}/>
     <Route path='/DataPengeluaran'element={<DataPengeluaranPage/>}/>
     <Route path='/DataPemasukan'element={<DataPemasukanPage/>}/>
     <Route path='/TotalSaldo'element={<TotalSaldoPage/>}/></Routes>
    </>
  )
}

export default App
