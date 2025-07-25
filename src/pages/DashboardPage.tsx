import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import InfoCard from '../component/InfoCard';

const DashboardPage: React.FC = () => {
  const [totalSiswa, setTotalSiswa] = useState(0);
  const [pemasukan, setPemasukan] = useState(0);
  const [pengeluaran, setPengeluaran] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const siswaSnapshot = await getDocs(collection(db, 'siswa'));
      setTotalSiswa(siswaSnapshot.size);

      const pemasukanSnapshot = await getDocs(collection(db, 'pemasukan'));
      let totalMasuk = 0;
      pemasukanSnapshot.forEach((doc) => {
        const data = doc.data();
        totalMasuk += Number(data.jumlah || 0);
      });
      setPemasukan(totalMasuk);

      const pengeluaranSnapshot = await getDocs(collection(db, 'pengeluaran'));
      let totalKeluar = 0;
      pengeluaranSnapshot.forEach((doc) => {
        const data = doc.data();
        totalKeluar += Number(data.jumlah || 0);
      });
      setPengeluaran(totalKeluar);
    };

    fetchData();
  }, []);

  const saldo = pemasukan - pengeluaran;

  return (
    <div className="min-h-screen bg-green-900 text-white w-screen">
      <div className="text-center py-6 md:py-20">
        <h1 className="text-4xl font-extrabold mb-2 underline decoration-blue-500">
          DASHBOARD ALIMS
        </h1>
        <p className="text-xl">AL-ISHLAH MANAGEMENT SYSTEM</p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 px-6 mt-4 md:mt-12">
        <InfoCard title="Total Siswa" value={totalSiswa} link="/DataSiswa" />
        <InfoCard title="Pemasukan" value={`Rp ${pemasukan.toLocaleString()}`} link="/DataPemasukan" />
        <InfoCard title="Pengeluaran" value={`Rp ${pengeluaran.toLocaleString()}`} link="/DataPengeluaran" />
        <InfoCard title="Total Saldo" value={`Rp ${saldo.toLocaleString()}`} link="/TotalSaldo" />
      </div>
    </div>
  );
};

export default DashboardPage;
