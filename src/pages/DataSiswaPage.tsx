import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import logo from '../assets/logo-al-islah.png';
import Navbar from "../component/Navbar";

interface Siswa {
  id?: string;
  nama: string;
  jenisKelamin: string;
  tanggalLahir: string;
  kelas: string;
  alamat: string;
  orangTua: string;
  kontak: string;
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
    const siswaCol = collection(db, "siswa");
    const snapshot = await getDocs(siswaCol);
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
      await addDoc(siswaCol, formData);
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

  const filteredSiswa = filterKelas
    ? siswaList.filter((s) => s.kelas === filterKelas)
    : siswaList;

  return (
    <>     <Navbar />
    <div className="min-h-screen pb-20 w-screen bg-green-900 p-8">
 
      <h1 className="text-3xl font-bold text-white mb-6 mt-10 print:hidden text-center">FORMULIR DATA SISWA</h1>

      {/* Formulir Input */}
      <form onSubmit={handleFormSubmit} className="bg-white shadow-md mr-30 ml-30 mt-10 rounded-lg p-6 mb-6 print:hidden">
        <div className="grid grid-cols-1 text-black md:grid-cols-2 gap-4">
          <input name="nama" value={formData.nama} onChange={handleFormChange} placeholder="Nama Lengkap" className="border p-2 rounded" required />
          <select name="jenisKelamin" value={formData.jenisKelamin} onChange={handleFormChange} className="border p-2 rounded" required>
            <option value="">Pilih Jenis Kelamin</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
          <input type="date" name="tanggalLahir" value={formData.tanggalLahir} onChange={handleFormChange} className="border p-2 rounded [&::-webkit-calendar-picker-indicator]:invert" required />
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
          <button type="button" onClick={resetForm} className="px-4 py-2 border rounded text-gray-600">
            Batal
          </button>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
            {editingIndex === null ? "Tambah" : "Simpan Perubahan"}
          </button>
        </div>
      </form>

      {/* Filter + Cetak */}
      <div className="flex gap-2 ml-30 items-center mb-4 print:hidden">
        <select
          value={filterKelas}
          onChange={(e) => setFilterKelas(e.target.value)}
          className="border p-2 bg-amber-50 text-black rounded"
        >
          <option value="">Semua Kelas</option>
          <option value="Kelas A">Kelas A</option>
          <option value="Kelas B">Kelas B</option>
          <option value="Kelas C">Kelas C</option>
        </select>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Cetak Data
        </button>
      </div>

      {/* Header Print */}
      <div className="hidden print:block w-screen text-center mb-4 text-black">
        <img src={logo} alt="Logo" className="h-30 mx-auto mb-2" />
        <h2 className="text-xl font-bold">Laporan Data Siswa</h2>
        {filterKelas && <p className="text-sm text-black">Kelas: {filterKelas}</p>}
      </div>

      {/* Tabel Data */}
      <div className="flex flex-col items-center mt-6">
      <div className="text-black w-full max-w-9xl px-0 justify-center flex self-center bg-white shadow-md">
  <table className="text-sm w-full text-center border border-black">
          <thead className="bg-green-600  text-black text-base">
            <tr>
              <th className="p-1 border">No</th>
              <th className="p-1 border">Nama</th>
              <th className="p-1 border">Jenis Kelamin</th>
              <th className="p-1 border">Tanggal Lahir</th>
              <th className="p-1 border">Kelas</th>
              <th className="p-1 border">Alamat</th>
              <th className="p-1 border">Orang Tua</th>
              <th className="p-1 border">Kontak</th>
              <th className="p-1 border print:hidden">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredSiswa.map((siswa, index) => (
              <tr key={index} className="hover:bg-green-50">
                <td className="p-1 border text-center">{index + 1}</td>
                <td className="p-1 border text-left">{siswa.nama}</td>
                <td className="p-1 border text-left">{siswa.jenisKelamin}</td>
                <td className="p-1 border text-left">{siswa.tanggalLahir}</td>
                <td className="p-1 border text-center">{siswa.kelas}</td>
                <td className="p-1 border text-left">{siswa.alamat}</td>
                <td className="p-1 border text-left">{siswa.orangTua}</td>
                <td className="p-3 border text-left">{siswa.kontak}</td>
                <td className="p-3 border whitespace-nowrap print:hidden">
                  <button onClick={() => handleEdit(index)} className="text-blue-600 underline mr-2">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(index)} className="text-red-600 underline">
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
     </div> </div>
    </div></>
  );
};

export default DataSiswaPage;
