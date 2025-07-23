import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import logo from '../assets/logo-al-islah.png';
import { serverTimestamp } from "firebase/firestore";

interface Siswa {
  id?: string;
  nama: string;
  jenisKelamin: string;
  tanggalLahir: string;
  kelas: string;
  alamat: string;
  orangTua: string;
  kontak: string;
  createdAt?: any;
}

const DataSiswaPage: React.FC = () => {
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [filterKelas, setFilterKelas] = useState<string>("");
  const [formData, setFormData] = useState<Siswa>({
    nama: "",
    jenisKelamin: "",
    tanggalLahir: "",
    kelas: "",
    alamat: "",
    orangTua: "",
    kontak: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const q = query(collection(db, "siswa"), orderBy("createdAt", "asc"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Siswa),
    }));
    setSiswaList(data);
  };

  const resetForm = () => {
    setFormData({
      nama: "",
      jenisKelamin: "",
      tanggalLahir: "",
      kelas: "",
      alamat: "",
      orangTua: "",
      kontak: "",
    });
    setEditingIndex(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const siswaCol = collection(db, "siswa");

    if (editingIndex === null) {
      await addDoc(siswaCol, {
        ...formData,
        createdAt: serverTimestamp(),
      });
    } else {
      const id = siswaList[editingIndex].id;
      if (!id) return;
      await updateDoc(doc(db, "siswa", id), formData as any);
    }

    resetForm();
    fetchData();
  };

  const handleEdit = (index: number) => {
    setFormData(siswaList[index]);
    setEditingIndex(index);
  };

  const handleDelete = async (index: number) => {
    const siswa = siswaList[index];
    const konfirmasi = window.confirm(`Apakah Anda yakin ingin menghapus data siswa "${siswa.nama}"?`);
    if (!konfirmasi) return;

    const id = siswa.id;
    if (!id) return;
    await deleteDoc(doc(db, "siswa", id));
    fetchData();
  };

  const filteredSiswa = filterKelas ? siswaList.filter((s) => s.kelas === filterKelas) : siswaList;

  return (
    <>
      <div className="min-h-screen pb-20 w-screen bg-green-900 p-4 md:p-8 text-white print:bg-white print:text-black print:px-0">
        <h1 className="text-3xl font-bold print:hidden mb-6 mt-10 text-center">FORMULIR DATA SISWA</h1>

        <form onSubmit={handleFormSubmit} className="bg-white text-black shadow-md rounded-lg p-4 md:p-6 mb-6 print:hidden max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="nama" value={formData.nama} onChange={handleFormChange} placeholder="Nama Lengkap" className="border p-2 rounded bg-white text-black" required />
            <select name="jenisKelamin" value={formData.jenisKelamin} onChange={handleFormChange} className="border p-2 rounded bg-white text-black" required>
              <option value="">Pilih Jenis Kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
            <input type="date" name="tanggalLahir" value={formData.tanggalLahir} onChange={handleFormChange} className="border p-2 rounded bg-white text-black [&::-webkit-calendar-picker-indicator]:invert" required />
            <select name="kelas" value={formData.kelas} onChange={handleFormChange} className="border p-2 rounded" required>
              <option value="">Pilih Kelas</option>
              <option value="Kelas A">Kelas A</option>
              <option value="Kelas B">Kelas B</option>
              <option value="Kelas C">Kelas C</option>
            </select>
            <input name="alamat" value={formData.alamat} onChange={handleFormChange} placeholder="Alamat" className="border p-2 rounded" required />
            <input name="orangTua" value={formData.orangTua} onChange={handleFormChange} placeholder="Nama Orang Tua" className="border p-2 rounded" required />
            <input name="kontak" value={formData.kontak} onChange={handleFormChange} placeholder="Kontak" className="border p-2 rounded" required />
          </div>
          <div className="flex justify-end mt-4 gap-2">
            <button type="button" onClick={resetForm} className="px-4 py-2 border rounded text-gray-600">Batal</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
              {editingIndex === null ? "Tambah" : "Simpan Perubahan"}
            </button>
          </div>
        </form>

        <div className="flex flex-wrap sm:flex-row justify-end items-center gap-2 mb-4 print:hidden max-w-6xl mx-auto">
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="border p-2 bg-amber-50 text-black rounded w-full sm:w-auto"
          >
            <option value="">Semua Kelas</option>
            <option value="Kelas A">Kelas A</option>
            <option value="Kelas B">Kelas B</option>
            <option value="Kelas C">Kelas C</option>
          </select>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 text-white rounded w-full sm:w-auto"
          >
            Cetak Data
          </button>
        </div>

        <div className="hidden print:block w-screen text-center mb-4 text-black">
          <img src={logo} alt="Logo" className="h-24 mx-auto mb-2" />
          <h2 className="text-xl font-bold">Laporan Data Siswa</h2>
          {filterKelas && <p className="text-sm text-black">Kelas: {filterKelas}</p>}
        </div>

        <div className="flex flex-col items-center mt-6">
          <div className="text-black w-full max-w-6xl bg-white shadow-md rounded-xl overflow-x-auto print:shadow-none print:bg-white print:w-full print:overflow-visible">
            <table className="min-w-full text-sm text-center border border-black">
              <thead className="bg-green-600 text-black text-base print:bg-gray-200">
                <tr>
                  <th className="p-2 border">No</th>
                  <th className="p-2 border">Nama</th>
                  <th className="p-2 border">Jenis Kelamin</th>
                  <th className="p-2 border">Tanggal Lahir</th>
                  <th className="p-2 border">Kelas</th>
                  <th className="p-2 border">Alamat</th>
                  <th className="p-2 border">Orang Tua</th>
                  <th className="p-2 border">Kontak</th>
                  <th className="p-2 border print:hidden">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredSiswa.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-4 text-center text-gray-500">Belum ada data siswa.</td>
                  </tr>
                ) : (
                  filteredSiswa.map((siswa, index) => (
                    <tr key={index} className="hover:bg-green-50 print:hover:bg-white">
                      <td className="p-2 border">{index + 1}</td>
                      <td className="p-2 border text-left">{siswa.nama}</td>
                      <td className="p-2 border text-left">{siswa.jenisKelamin}</td>
                      <td className="p-2 border text-left">{siswa.tanggalLahir}</td>
                      <td className="p-2 border text-center">{siswa.kelas}</td>
                      <td className="p-2 border text-left">{siswa.alamat}</td>
                      <td className="p-2 border text-left">{siswa.orangTua}</td>
                      <td className="p-2 border text-left">{siswa.kontak}</td>
                      <td className="p-2 border print:hidden">
                        <button onClick={() => handleEdit(index)} className="text-blue-600 underline mr-2 hover:text-blue-800">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(index)} className="text-red-600 underline hover:text-red-800">
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Custom style khusus untuk mode cetak */}
      <style>
        {`
          @media print {
            body {
              background: white !important;
              color: black !important;
            }
            .print\\:hidden {
              display: none !important;
            }
            .print\\:block {
              display: block !important;
            }
            .print\\:bg-white {
              background-color: white !important;
            }
            .print\\:text-black {
              color: black !important;
            }
            .print\\:shadow-none {
              box-shadow: none !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default DataSiswaPage;
