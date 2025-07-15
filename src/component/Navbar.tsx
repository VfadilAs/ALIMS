import React, { useState } from 'react';
import logo from '../assets/logo-al-islah.png';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogoutClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const konfirmasi = window.confirm("Apakah Anda yakin ingin logout?");
    if (konfirmasi) {
      window.location.href = "/";
    }
  };

  return (
    <nav className="bg-green-600 print:hidden sticky top-0 text-white px-4 py-2 flex items-center justify-between w-full h-16 shadow-md z-50">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
        <span className="font-bold text-xl">ALIMS</span>
      </div>

      {/* Hamburger button (mobile only) */}
      <div className="md:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Menu items */}
      <ul className={`flex-col md:flex md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 font-semibold pr-2 absolute md:static top-16 left-0 w-full md:w-auto bg-green-600 md:bg-transparent px-4 py-2 md:p-5 transition-all duration-300 ${isOpen ? 'block' : 'hidden'} md:block`}>
        <li><a href="/Dashboard" className="block hover:underline">Dashboard</a></li>
        <li><a href="/DataSiswa" className="block hover:underline">Siswa</a></li>
        <li><a href="/DataPemasukan" className="block hover:underline">Saldo Masuk</a></li>
        <li><a href="/DataPengeluaran" className="block hover:underline">Saldo Keluar</a></li>
        <li><a href="/TotalSaldo" className="block hover:underline">Total Saldo</a></li>
        <li><a href="/" onClick={handleLogoutClick} className="block hover:underline">Logout</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
