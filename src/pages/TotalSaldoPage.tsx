import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../component/Navbar";
import logo from '../assets/logo-al-islah.png';

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
    <>
      <Navbar />
      <div className="min-h-screen w-screen bg-green-900 text-white p-6 print:bg-white">
        <h1 className="text-3xl font-bold print:hidden  mb-6 mt-10 print:text-black text-center">SALDO SAAT INI</h1>

        <div className="flex justify-end mb-4 no-print">
          <button
            onClick={() => window.print()}
            className="bg-white text-black px-4 py-2 border rounded shadow hover:bg-gray-200"
          >
            🖨 Cetak Laporan
          </button>
        </div>

        <div className="overflow-x-auto bg-white py-10 shadow-md rounded-lg print:shadow-none print:bg-white print:text-black">
          {loading ? (
            <p className="p-4 text-gray-600">Memuat data...</p>
          ) : (
            <div className="p-6 print:p-0">
              <div className="text-center mb-6 print:mb-4">
                <img
                  src={logo}
                  alt="Logo"
                  className="mx-auto mb-2 print:mb-2"
                  style={{ width: "100px", height: "100px" }} 
                />
                <h2 className="text-xl text-black font-bold">LAPORAN SALDO AL-ISHLAH</h2>
                <p className="text-sm">Jl. H. Jaili 03/01 Ciampea</p>
              </div>

              <table className="w-full text-sm border text-black border-gray-300 print:text-sm print:border-black">
                <thead className="bg-green-600 text-black print:bg-gray-200 print:text-black">
                  <tr>
                    <th className="p-2 border">Tanggal</th>
                    <th className="p-2 border">Keterangan</th>
                    <th className="p-2 border">Uang Masuk</th>
                    <th className="p-2 border">Uang Keluar</th>
                    <th className="p-2 border">Saldo Akhir</th>
                  </tr>
                </thead>
                <tbody>
                  {dataGabungan.map((item, index) => {
                    saldoAkhir += item.uangMasuk - item.uangKeluar;
                    return (
                      <tr key={index} className="even:bg-gray-50 print:even:bg-white">
                        <td className="p-2 border">{item.tanggal}</td>
                        <td className="p-2 border">{item.keterangan}</td>
                        <td className="p-2 border text-right">
                          {item.uangMasuk
                            ? `Rp ${item.uangMasuk.toLocaleString("id-ID")}`
                            : "-"}
                        </td>
                        <td className="p-2 border text-right">
                          {item.uangKeluar
                            ? `Rp ${item.uangKeluar.toLocaleString("id-ID")}`
                            : "-"}
                        </td>
                        <td className="p-2 border text-right font-bold">
                          Rp {saldoAkhir.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Tambahkan style print khusus */}
      <style>
        {`
          @media print {
            body {
              background: white !important;
              color: black !important;
            }
            .no-print {
              display: none !important;
            }
            .print\:text-black {
              color: black !important;
            }
            .print\:bg-white {
              background-color: white !important;
            }
            .print\:shadow-none {
              box-shadow: none !important;
            }
            .print\:p-0 {
              padding: 0 !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default TotalSaldoPage;
