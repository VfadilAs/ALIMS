// src/pages/DataPemasukanPage.tsx
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy, // ✅ Tambahkan baris ini
} from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../component/Navbar";

interface Pemasukan {
  id?: string;
  tanggal: string;
  jumlah: number;
  sumber: "Iuran" | "Lainnya";
  kelas?: string;
  nama?: string;
  keterangan?: string;
  bulan?: string;
  admin: string;
}

interface Siswa {
  id?: string;
  nama: string;
  kelas: string;
}

const bulanList = [
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
];

const DataPemasukanPage: React.FC = () => {
  const [pemasukanList, setPemasukanList] = useState<Pemasukan[]>([]);
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [formData, setFormData] = useState<Pemasukan>({
    tanggal: "",
    jumlah: 0,
    sumber: "Iuran",
    kelas: "",
    nama: "",
    keterangan: "",
    bulan: "",
    admin: "",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showRekap, setShowRekap] = useState(false);
  const [selectedRekapKelas, setSelectedRekapKelas] = useState<string>("");

  useEffect(() => {
    fetchData();
    fetchSiswa();
  }, []);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, nama: "" }));
  }, [formData.kelas]);

  const fetchData = async () => {
  const q = query(collection(db, "pemasukan"), orderBy("tanggal", "desc")); // ⬅️ descending
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Pemasukan),
  }));
  setPemasukanList(data);
}; 


  const fetchSiswa = async () => {
    const snapshot = await getDocs(collection(db, "siswa"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Siswa) }));
    setSiswaList(data);
  };

  const resetForm = () => {
    setFormData({
      tanggal: "",
      jumlah: 0,
      sumber: "Iuran",
      kelas: "",
      nama: "",
      keterangan: "",
      bulan: "",
      admin: "",
    });
    setEditingIndex(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "jumlah" ? Number(value) : value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const colRef = collection(db, "pemasukan");
      const finalData = {
        ...formData,
        keterangan: formData.sumber === "Iuran" ? "Iuran" : formData.keterangan,
      };
      if (editingIndex === null) {
        await addDoc(colRef, finalData);
      } else {
        const id = pemasukanList[editingIndex]?.id;
        if (!id) return;
        await updateDoc(doc(db, "pemasukan", id), finalData);
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
    setFormData({ ...data });
  };

  const handleDelete = async (index: number) => {
    const pemasukan = pemasukanList[index];
    const konfirmasi = window.confirm(`Yakin hapus data tanggal ${pemasukan.tanggal}?`);
    if (!konfirmasi) return;
    const id = pemasukan.id;
    if (!id) return;
    await deleteDoc(doc(db, "pemasukan", id));
    fetchData();
  };

  const isIuran = formData.sumber === "Iuran";

  const filteredSiswa = siswaList.filter((s) => s.kelas === `Kelas ${formData.kelas}`);

  const siswaByRekap = siswaList.filter((s) => s.kelas === `Kelas ${selectedRekapKelas}`);

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-screen p-8 bg-green-900">
        <h1 className="text-3xl font-bold mt-5 text-white mb-6 text-center">INPUT DATA PEMASUKAN</h1>

        <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-lg shadow mb-6 text-black">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="date" name="tanggal" value={formData.tanggal} onChange={handleFormChange} required className="border p-2 rounded text-black [&::-webkit-calendar-picker-indicator]:invert" />
            <input
  type="number"
  name="jumlah"
  value={formData.jumlah || ""}
  onChange={handleFormChange}
  placeholder="Jumlah"
  min="0"
  required
  className="border p-2 rounded text-black [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
/>


            <label className="flex items-center">
              <input type="radio" name="sumber" value="Iuran" checked={isIuran} onChange={handleFormChange} className="mr-2" /> Iuran
            </label>
            <label className="flex items-center">
              <input type="radio" name="sumber" value="Lainnya" checked={!isIuran} onChange={handleFormChange} className="mr-2" /> Lainnya
            </label>

            {isIuran ? (
              <>
                <select name="kelas" value={formData.kelas} onChange={handleFormChange} required className="border p-2 rounded text-black">
                  <option value="">Kelas</option>
                  <option value="A">Kelas A</option>
                  <option value="B">Kelas B</option>
                  <option value="C">Kelas C</option>
                </select>

                <select name="nama" value={formData.nama} onChange={handleFormChange} required disabled={!formData.kelas} className="border p-2 rounded text-black">
                  <option value="">Nama Siswa</option>
                  {filteredSiswa.map((s, i) => (
                    <option key={i} value={s.nama}>{s.nama}</option>
                  ))}
                </select>

                <select name="bulan" value={formData.bulan} onChange={handleFormChange} required className="border p-2 rounded text-black">
                  <option value="">Pilih Bulan</option>
                  {bulanList.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </>
            ) : (
              <input name="keterangan" value={formData.keterangan} onChange={handleFormChange} placeholder="Keterangan lainnya" required className="border p-2 rounded text-black" />
            )}

            <input name="admin" value={formData.admin} onChange={handleFormChange} placeholder="Nama Admin" required className="border p-2 rounded text-black" />
          </div>

          <div className="flex justify-end mt-4 gap-2">
            <button type="button" onClick={resetForm} className="px-4 py-2 border rounded">Batal</button>
            {showRekap ? (
  <button type="button" onClick={() => setShowRekap(false)} className="px-4 py-2 bg-gray-600 text-white rounded">
    Tabel Pemasukan
  </button>
) : (
  <button type="button" onClick={() => setShowRekap(true)} className="px-4 py-2 bg-blue-600 text-white rounded">
    Rekap Iuran
  </button>
)}

            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">{editingIndex === null ? "Simpan Data" : "Update Data"}</button>
          </div>
        </form>

        {showRekap ? (
          <div className="bg-white p-4 rounded shadow text-black">
            <select value={selectedRekapKelas} onChange={(e) => setSelectedRekapKelas(e.target.value)} className="mb-4 border p-2 rounded text-black">
              <option value="">Pilih Kelas</option>
              <option value="A">Kelas A</option>
              <option value="B">Kelas B</option>
              <option value="C">Kelas C</option>
            </select>

            {selectedRekapKelas && (
              <table className="w-full border-collapse border border-gray-200">
                <thead className="bg-green-600 text-white">
                  <tr>
                    <th className="p-2 border">No</th>
                    <th className="p-2 border">Nama</th>
                    {bulanList.map((b) => (
                      <th key={b} className="p-2 border">{b}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {siswaByRekap.map((s, i) => {
                    const pembayaran = pemasukanList.filter((p) => p.kelas === selectedRekapKelas && p.nama === s.nama && p.keterangan === "Iuran");
                    return (
                      <tr key={i}>
                        <td className="p-2 border text-center">{i + 1}</td>
                        <td className="p-2 border">{s.nama}</td>
                        {bulanList.map((b) => (
                          <td key={b} className="p-2 border text-center">
                            <input type="checkbox" checked={pembayaran.some((p) => p.bulan === b)} readOnly />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg text-black">
            <table className="w-full border-collapse border border-gray-200">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="p-3 border">Tanggal</th>
                  <th className="p-3 border">Jumlah</th>
                  <th className="p-3 border">Kelas</th>
                  <th className="p-3 border">Nama</th>
                  <th className="p-3 border">Keterangan</th>
                  <th className="p-3 border">Admin</th>
                  <th className="p-3 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {pemasukanList.length === 0 ? (
                  <tr><td colSpan={7} className="p-4 text-center">Belum ada data pemasukan.</td></tr>
                ) : (
                  pemasukanList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-green-50">
                      <td className="p-3 border">{item.tanggal}</td>
                      <td className="p-3 border">{item.jumlah.toLocaleString("id-ID")}</td>
                      <td className="p-3 border">{item.kelas || "-"}</td>
                      <td className="p-3 border">{item.nama || "-"}</td>
                      <td className="p-3 border">{item.keterangan || "-"}</td>
                      <td className="p-3 border">{item.admin}</td>
                      <td className="p-3 border">
                        <button onClick={() => handleEdit(idx)} className="text-blue-600 underline mr-2">Edit</button>
                        <button onClick={() => handleDelete(idx)} className="text-red-600 underline">Hapus</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default DataPemasukanPage;
