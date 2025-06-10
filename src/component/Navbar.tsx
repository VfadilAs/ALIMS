import React from 'react';
import logo from '../assets/logo-al-islah.png';


const Navbar: React.FC = () => {
  return (
    <nav className="bg-green-600 text-white px-2 top-0 flex justify-between items-center w-max-screen h-16 shadow-md">
      <div className="flex items-center space-x-3">
<img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
        <span className="font-bold text-xl">ALIMS</span>
      </div>
      <ul className="flex space-x-6 font-semibold sm:text-xs md:text-sm lg:text-base">
        <li><a href="#" className="hover:underline">Dashboard</a></li>
        <li><a href="#" className="hover:underline">Siswa</a></li>
        <li><a href="#" className="hover:underline">Saldo Masuk</a></li>
        <li><a href="#" className="hover:underline">Saldo Keluar</a></li>
        <li><a href="#" className="hover:underline">Total Saldo</a></li>
        <li><a href="#" className="hover:underline">Logout</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
