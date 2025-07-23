import { Route, Routes, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DataSiswaPage from './pages/DataSiswaPage';
import DataPengeluaranPage from './pages/DataPengeluaranPage';
import DataPemasukanPage from './pages/DataPemasukanPage';
import TotalSaldoPage from './pages/TotalSaldoPage';
import ApprovalPage from './pages/ApprovalPage'; // ✅ tambahkan import ini
import Navbar from './component/Navbar';

function App() {
  const location = useLocation();

  // Cek apakah saat ini di halaman login
  const hideNavbar = location.pathname === '/';

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Dashboard" element={<DashboardPage />} />
        <Route path="/DataSiswa" element={<DataSiswaPage />} />
        <Route path="/DataPengeluaran" element={<DataPengeluaranPage />} />
        <Route path="/DataPemasukan" element={<DataPemasukanPage />} />
        <Route path="/TotalSaldo" element={<TotalSaldoPage />} />
        <Route path="/Approval" element={<ApprovalPage />} /> {/* ✅ tambahkan route ini */}
      </Routes>
    </>
  );
}

export default App;
