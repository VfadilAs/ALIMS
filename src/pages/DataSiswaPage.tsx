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
    const id = siswaList[index].id;
    if (!id) return;
    await deleteDoc(doc(db, "siswa", id));
    fetchData();
  };

  return (
    <div className="min-h-screen bg-green-900 justify-items-center w-screen p-8">
      <h1 className="text-3xl font-bold text-white mb-6">Formulir Data Siswa</h1>

      {/* Formulir Input */}
      <form onSubmit={handleFormSubmit} className="bg-white w-200 shadow-md rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 text-black md:grid-cols-2 gap-4">
          <input name="nama" value={formData.nama} onChange={handleFormChange} placeholder="Nama Lengkap" className="border p-2 rounded" required />
          <select name="jenisKelamin" value={formData.jenisKelamin} onChange={handleFormChange} className="border p-2 rounded" required>
            <option value="">Pilih Jenis Kelamin</option>
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </select>
          <input type="date" name="tanggalLahir" value={formData.tanggalLahir} onChange={handleFormChange} className="border p-2 rounded" required />
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

      {/* Tabel Data */}
      <div className="overflow-x-auto text-black bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left border border-gray-200">
          <thead className="bg-green-600 text-white text-base">
            <tr>
              <th className="p-3 border">No</th>
              <th className="p-3 border">Nama</th>
              <th className="p-3 border">Jenis Kelamin</th>
              <th className="p-3 border">Tanggal Lahir</th>
              <th className="p-3 border">Kelas</th>
              <th className="p-3 border">Alamat</th>
              <th className="p-3 border">Orang Tua</th>
              <th className="p-3 border">Kontak</th>
              <th className="p-3 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {siswaList.map((siswa, index) => (
              <tr key={index} className="hover:bg-green-50">
                <td className="p-3 border text-center">{index + 1}</td>
                <td className="p-3 border">{siswa.nama}</td>
                <td className="p-3 border">{siswa.jenisKelamin}</td>
                <td className="p-3 border">{siswa.tanggalLahir}</td>
                <td className="p-3 border text-center">{siswa.kelas}</td>
                <td className="p-3 border">{siswa.alamat}</td>
                <td className="p-3 border">{siswa.orangTua}</td>
                <td className="p-3 border">{siswa.kontak}</td>
                <td className="p-3 border whitespace-nowrap">
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
      </div>
    </div>
  );
};

export default DataSiswaPage;
