// src/pages/DataPemasukanPage.tsx
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

interface Pemasukan {
  id?: string;
  tanggal: string;
  jumlah: number;
  sumber: "Iuran" | "Lainnya";
  kelas?: string;
  nama?: string;
  keterangan?: string;
  admin: string;
}

const DataPemasukanPage: React.FC = () => {
  const [pemasukanList, setPemasukanList] = useState<Pemasukan[]>([]);
  const [formData, setFormData] = useState<Pemasukan>({
    tanggal: "",
    jumlah: 0,
    sumber: "Iuran",
    kelas: "",
    nama: "",
    keterangan: "",
    admin: "",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    console.log("Mengambil data pemasukan...");
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const snapshot = await getDocs(collection(db, "pemasukan"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Pemasukan),
      }));
      setPemasukanList(data);
    } catch (error) {
      console.error("Gagal mengambil data pemasukan:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      tanggal: "",
      jumlah: 0,
      sumber: "Iuran",
      kelas: "",
      nama: "",
      keterangan: "",
      admin: "",
    });
    setEditingIndex(null);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
      const colRef = collection(db, "pemasukan");
      if (editingIndex === null) {
        await addDoc(colRef, formData);
      } else {
        const id = pemasukanList[editingIndex]?.id;
        if (!id) return;
        await updateDoc(doc(db, "pemasukan", id), formData as any);
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
    }
  };

  const handleEdit = (index: number) => {
    const data = pemasukanList[index];
    if (!data) return;
    setEditingIndex(index);
    setFormData({
      tanggal: data.tanggal || "",
      jumlah: data.jumlah || 0,
      sumber: data.sumber || "Iuran",
      kelas: data.kelas || "",
      nama: data.nama || "",
      keterangan: data.keterangan || "",
      admin: data.admin || "",
    });
  };

  const handleDelete = async (index: number) => {
    const id = pemasukanList[index]?.id;
    if (!id) return;
    try {
      await deleteDoc(doc(db, "pemasukan", id));
      fetchData();
    } catch (error) {
      console.error("Gagal menghapus data:", error);
    }
  };

  const isIuran = formData.sumber === "Iuran";

  return (
    <div className="min-h-screen w-screen bg-green-900 p-8">
      <h1 className="text-3xl font-bold text-white mb-6">
        INPUT DATA PEMASUKAN
      </h1>

      <form
        onSubmit={handleFormSubmit}
        className="bg-white p-6 justify-center flex flex-col rounded-lg mb-6 shadow"
      >
        <div className="grid grid-cols-1 text-black md:grid-cols-2 gap-4">
          <input
            type="date"
            name="tanggal"
            value={formData.tanggal}
            onChange={handleFormChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="jumlah"
            placeholder="Jumlah"
            value={formData.jumlah}
            onChange={handleFormChange}
            required
            className="border p-2 rounded"
          />

          <label className="flex items-center">
            <input
              type="radio"
              name="sumber"
              value="Iuran"
              checked={isIuran}
              onChange={handleFormChange}
              className="mr-2"
            />
            Iuran
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="sumber"
              value="Lainnya"
              checked={!isIuran}
              onChange={handleFormChange}
              className="mr-2"
            />
            Lainnya
          </label>

          {isIuran ? (
            <>
              <select
                name="kelas"
                value={formData.kelas}
                onChange={handleFormChange}
                required
                className="border p-2 rounded"
              >
                <option value="">Kelas</option>
                <option value="A">Kelas A</option>
                <option value="B">Kelas B</option>
              </select>
              <select
                name="nama"
                value={formData.nama}
                onChange={handleFormChange}
                required
                className="border p-2 rounded"
              >
                <option value="">Nama Siswa</option>
                <option value="Yuki Ishikawa">Yuki Ishikawa</option>
                <option value="Masahiro Sekita">Masahiro Sekita</option>
              </select>
            </>
          ) : (
            <input
              name="keterangan"
              value={formData.keterangan}
              onChange={handleFormChange}
              placeholder="Keterangan lainnya"
              required
              className="border p-2 rounded"
            />
          )}

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
      </form>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-3 border">Tanggal</th>
              <th className="p-3 border">Jumlah</th>
              <th className="p-3 border">Sumber</th>
              <th className="p-3 border">Kelas</th>
              <th className="p-3 border">Nama</th>
              <th className="p-3 border">Keterangan</th>
              <th className="p-3 border">Admin</th>
              <th className="p-3 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pemasukanList.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">
                  Memuat data atau belum ada pemasukan.
                </td>
              </tr>
            ) : (
              pemasukanList.map((item, idx) => (
                <tr key={idx} className="hover:bg-green-50 text-black">
                  <td className="p-3 border">{item.tanggal || "-"}</td>
                  <td className="p-3 border">
                    {item.jumlah?.toLocaleString("id-ID") || "0"}
                  </td>
                  <td className="p-3 border ">{item.sumber || "-"}</td>
                  <td className="p-3 border">{item.kelas || "-"}</td>
                  <td className="p-3 border">{item.nama || "-"}</td>
                  <td className="p-3 border">{item.keterangan || "-"}</td>
                  <td className="p-3 border">{item.admin || "-"}</td>
                  <td className="p-3 border">
                    <button
                      onClick={() => handleEdit(idx)}
                      className="text-blue-600 underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(idx)}
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

export default DataPemasukanPage;