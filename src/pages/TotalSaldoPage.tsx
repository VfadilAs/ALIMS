import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

interface Transaksi {
  tanggal: string;
  keterangan: string;
  uangMasuk: number;
  uangKeluar: number;
}

const TotalSaldoPage: React.FC = () => {
  const [dataGabungan, setDataGabungan] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const pemasukanSnap = await getDocs(collection(db, "pemasukan"));
      const pengeluaranSnap = await getDocs(collection(db, "pengeluaran"));

      const pemasukanData = pemasukanSnap.docs.map((doc) => {
        const data = doc.data();
        return {
          tanggal: data.tanggal,
          keterangan: data.keterangan,
          uangMasuk: data.jumlah || 0,
          uangKeluar: 0,
        };
      });

      const pengeluaranData = pengeluaranSnap.docs.map((doc) => {
        const data = doc.data();
        return {
          tanggal: data.tanggal,
          keterangan: data.keterangan,
          uangMasuk: 0,
          uangKeluar: data.jumlah || 0,
        };
      });

      const gabungan = [...pemasukanData, ...pengeluaranData];

      const sortedGabungan = gabungan.sort(
        (a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()
      );

      setDataGabungan(sortedGabungan);
      setLoading(false);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setLoading(false);
    }
  };

  let saldoAkhir = 0;

  return (
    <div className="min-h-screen bg-teal-100 p-8">
      <h1 className="text-3xl font-bold text-green-700 mb-6">SALDO SAAT INI</h1>

      <div className="flex justify-end mb-4">
        <button className="bg-white px-4 py-2 border rounded shadow">
          🖨
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        {loading ? (
          <p className="p-4 text-gray-600">Memuat data...</p>
        ) : (
          <table className="min-w-full text-sm text-left border border-gray-200">
            <thead className="bg-green-600 text-white text-base">
              <tr>
                <th className="p-3 border">Tanggal</th>
                <th className="p-3 border">Keterangan</th>
                <th className="p-3 border">Uang Masuk</th>
                <th className="p-3 border">Uang Keluar</th>
                <th className="p-3 border">Saldo Akhir</th>
              </tr>
            </thead>
            <tbody>
              {dataGabungan.map((item, index) => {
                saldoAkhir += item.uangMasuk - item.uangKeluar;
                return (
                  <tr key={index} className="hover:bg-green-50 text-black">
                    <td className="p-3 border">{item.tanggal}</td>
                    <td className="p-3 border">{item.keterangan}</td>
                    <td className="p-3 border">
                      {item.uangMasuk
                        ? item.uangMasuk.toLocaleString("id-ID")
                        : ""}
                    </td>
                    <td className="p-3 border">
                      {item.uangKeluar
                        ? item.uangKeluar.toLocaleString("id-ID")
                        : ""}
                    </td>
                    <td className="p-3 border">
                      {saldoAkhir.toLocaleString("id-ID")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TotalSaldoPage;
