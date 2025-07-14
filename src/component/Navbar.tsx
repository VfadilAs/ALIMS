import React from 'react';
import logo from '../assets/logo-al-islah.png';

const Navbar: React.FC = () => {
  const handleLogoutClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const konfirmasi = window.confirm("Apakah Anda yakin ingin logout?");
    if (konfirmasi) {
      window.location.href = "/";
    }
  };

  return (
    <nav className="bg-green-600 print:hidden sticky text-white px-2 top-0 flex justify-between items-center w-screen h-16 shadow-md">
      <div className="flex items-center space-x-3">
        <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
        <span className="font-bold text-xl">ALIMS</span>
      </div>
      <ul className="flex space-x-6 font-semibold pr-10 sm:text-xs md:text-sm lg:text-base">
        <li><a href="/Dashboard" className="hover:underline">Dashboard</a></li>
        <li><a href="/DataSiswa" className="hover:underline">Siswa</a></li>
        <li><a href="/DataPemasukan" className="hover:underline">Saldo Masuk</a></li>
        <li><a href="/DataPengeluaran" className="hover:underline">Saldo Keluar</a></li>
        <li><a href="/TotalSaldo" className="hover:underline">Total Saldo</a></li>
        <li><a href="/" onClick={handleLogoutClick} className="hover:underline">Logout</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
