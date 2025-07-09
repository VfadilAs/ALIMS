// src/pages/DataPengeluaranPage.tsx
import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

interface Pengeluaran {
  id?: string;
  tanggal: string;
  keterangan: string;
  jumlah: string;
  admin: string;
}

const DataPengeluaranPage: React.FC = () => {
  const [pengeluaranList, setPengeluaranList] = useState<Pengeluaran[]>([]);
  const [formData, setFormData] = useState<Pengeluaran>({
    tanggal: "",
    keterangan: "",
    jumlah: "",
    admin: "",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const snapshot = await getDocs(collection(db, "pengeluaran"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Pengeluaran),
      }));
      setPengeluaranList(data);
    } catch (error) {
      console.error("Gagal mengambil data pengeluaran:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      tanggal: "",
      keterangan: "",
      jumlah: "",
      admin: "",
    });
    setEditingIndex(null);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "jumlah" ? Number(value) : value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const colRef = collection(db, "pengeluaran");
      if (editingIndex === null) {
        await addDoc(colRef, formData);
      } else {
        const id = pengeluaranList[editingIndex]?.id;
        if (!id) return;
        await updateDoc(doc(db, "pengeluaran", id), formData as any);
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
    }
  };

  const handleEdit = (index: number) => {
    const data = pengeluaranList[index];
    if (!data) return;
    setEditingIndex(index);
    setFormData({
      tanggal: data.tanggal || "",
      keterangan: data.keterangan || "",
      jumlah: data.jumlah ||  "",
      admin: data.admin || "",
    });
  };

  const handleDelete = async (index: number) => {
    const id = pengeluaranList[index]?.id;
    if (!id) return;
    try {
      await deleteDoc(doc(db, "pengeluaran", id));
      fetchData();
    } catch (error) {
      console.error("Gagal menghapus data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-green-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-6">
        INPUT DATA PENGELUARAN
      </h1>

      <form
        onSubmit={handleFormSubmit}
        className="bg-white p-6 rounded-lg mb-6 shadow-md"
      >
        <h2 className="text-2xl font-bold text-green-700 mb-4">
          
        </h2>
        <div className="grid gap-4 text-black">
          <input
            type="date"
            name="tanggal"
            value={formData.tanggal}
            onChange={handleFormChange}
            required
            className="border p-2 rounded"
          />
          <textarea
            name="keterangan"
            value={formData.keterangan}
            onChange={handleFormChange}
            placeholder="Masukan keterangan pengeluaran"
            required
            className="border p-2 rounded"
          />
          <input
            name="jumlah"
            value={formData.jumlah}
            onChange={handleFormChange}
            placeholder="Masukan jumlah uang keluar"
            required
            className="border p-2 rounded"
          />
          <input
            name="admin"
            value={formData.admin}
            onChange={handleFormChange}
            placeholder="Nama Admin"
            required
            className="border p-2 rounded"
          />
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 border rounded text-gray-600"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {editingIndex === null ? "Simpan Data" : "Update Data"}
          </button>
        </div>

        <p className="text-sm text-center mt-4 text-gray-500">
          
        </p>
      </form>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left border border-gray-200">
          <thead className="bg-green-600 text-white text-base">
            <tr>
              <th className="p-3 border">Tanggal</th>
              <th className="p-3 border">Keterangan</th>
              <th className="p-3 border">Jumlah Pengeluaran</th>
              <th className="p-3 border">Admin</th>
              <th className="p-3 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pengeluaranList.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  Belum ada data pengeluaran.
                </td>
              </tr>
            ) : (
              pengeluaranList.map((item, index) => (
                <tr key={index} className="hover:bg-green-50 text-black">
                  <td className="p-3 border">{item.tanggal}</td>
                  <td className="p-3 border">{item.keterangan}</td>
                  <td className="p-3 border">
                    {item.jumlah ? Number(item.jumlah).toLocaleString("id-ID") : ""}
                  </td>
                  <td className="p-3 border">{item.admin}</td>
                  <td className="p-3 border">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-600 underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600 underline"
                    >
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
  );
};

export default DataPengeluaranPage;
