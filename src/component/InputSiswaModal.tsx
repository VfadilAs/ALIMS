import React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  formData: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: () => void;
}

const InputSiswaModal: React.FC<Props> = ({ isOpen, onClose, formData, onChange, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative text-black">
        <button onClick={onClose} className="absolute top-2 right-4 text-xl font-bold">✕</button>
        <h2 className="text-xl font-bold mb-4 text-center text-green-700">INPUT DATA SISWA</h2>

        {/* Form */}
        <div className="space-y-3">
          <input className="w-full border rounded p-2" placeholder="Nama Lengkap" name="nama" value={formData.nama} onChange={onChange} />
          <div className="flex justify-between gap-2">
            <button onClick={() => onChange({ target: { name: "jenisKelamin", value: "Laki-laki" } } as any)} className={`flex-1 p-2 rounded border ${formData.jenisKelamin === "Laki-laki" ? "bg-gray-300" : ""}`}>Laki-laki</button>
            <button onClick={() => onChange({ target: { name: "jenisKelamin", value: "Perempuan" } } as any)} className={`flex-1 p-2 rounded border ${formData.jenisKelamin === "Perempuan" ? "bg-gray-300" : ""}`}>Perempuan</button>
          </div>
          <input className="w-full border rounded p-2" type="date" name="tanggalLahir" value={formData.tanggalLahir} onChange={onChange} />
          <select className="w-full border rounded p-2" name="kelas" value={formData.kelas} onChange={onChange}>
            <option value="">Pilih Kelas</option>
            <option value="A">Kelas A</option>
            <option value="B">Kelas B</option>
            <option value="C">Kelas C</option>
          </select>
          <input className="w-full border rounded p-2" name="alamat" placeholder="Alamat" value={formData.alamat} onChange={onChange} />
          <input className="w-full border rounded p-2" name="orangTua" placeholder="Nama Orang Tua" value={formData.orangTua} onChange={onChange} />
          <input className="w-full border rounded p-2" name="kontak" placeholder="Nomor Kontak" value={formData.kontak} onChange={onChange} />
          <button onClick={onSubmit} className="w-full bg-green-500 text-white py-2 rounded mt-2">Simpan Data</button>
        </div>
      </div>
    </div>
  );
};

export default InputSiswaModal;
