import React from 'react';
import Navbar from '../component/Navbar';
import InfoCard from '../component/InfoCard';

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-green-900 text-white w-screen">
      <Navbar />
      <div className="text-center py-10">
        <h1 className="text-4xl font-extrabold mb-2 underline decoration-blue-500">
          DASHBOARD ALIMS
        </h1>
        <p className="text-xl">AL-ISHLAH MANAGEMENT SYSTEM</p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 px-6 pb-12">
        <InfoCard title="Total Siswa" value={199} link="/DataSiswa" />
        <InfoCard title="Pemasukan Bulan Ini" value="12.000.000" link="/DataPemasukan" />
        <InfoCard title="Pengeluaran Bulan Ini" value="10.000.000" link="/DataPengeluaran" />
        <InfoCard title="Total Saldo" value="2.000.000" link="/TotalSaldo" />
      </div>
    </div>
  );
};

export default DashboardPage;
