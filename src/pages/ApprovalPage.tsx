import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import Button from '../component/Button';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  approved: boolean;
  isAdmin?: boolean;
}

const ApprovalPage: React.FC = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const users = querySnapshot.docs
        .map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        })) as User[];

      const filtered = users.filter(user => user.isAdmin !== true);
      setUserList(filtered);
    } catch (error) {
      console.error('Gagal memuat data pengguna:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (id: string) => {
    try {
      await updateDoc(doc(db, 'users', id), { approved: true });
      fetchUsers();
    } catch (err) {
      console.error('Gagal menyetujui:', err);
    }
  };

  const rejectUser = async (id: string) => {
    try {
      await updateDoc(doc(db, 'users', id), { approved: false });
      fetchUsers();
    } catch (err) {
      console.error('Gagal menolak:', err);
    }
  };

  const deleteUser = async (id: string) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus akun ini?");
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, 'users', id));
      fetchUsers();
    } catch (err) {
      console.error('Gagal menghapus:', err);
    }
  };

  const navigate = useNavigate();

useEffect(() => {
  const isAdmin = localStorage.getItem('isAdmin');
  if (isAdmin !== 'true') {
    navigate('/Dashboard');
  } else {
    fetchUsers();
  }
}, []);


  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen w-screen bg-green-800 text-white py-10 px-4 flex flex-col items-center">
      {/* Judul di luar kotak */}
      <h1 className="text-3xl font-bold mb-6 text-center">Halaman Approval</h1>

      {/* Isi data dalam kotak putih */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 text-black">
        {loading ? (
          <p className="text-center text-green-800">Memuat data...</p>
        ) : userList.length === 0 ? (
          <p className="text-center text-green-800">Tidak ada pendaftar.</p>
        ) : (
          <div className="space-y-4">
            {userList.map(user => (
              <div
                key={user.id}
                className="border-b border-gray-300 pb-4 flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div className="mb-2 md:mb-0">
                  <p className="font-semibold text-lg text-green-800">{user.email}</p>
                  <p className="text-sm text-gray-600">
                    {user.approved ? 'Telah disetujui' : 'Belum disetujui'}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!user.approved && (
                    <>
                      <Button
                        label="Setujui"
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                        onClick={() => approveUser(user.id)}
                      />
                      <Button
                        label="Tolak"
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded"
                        onClick={() => rejectUser(user.id)}
                      />
                    </>
                  )}
                  <Button
                    label="Hapus"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
                    onClick={() => deleteUser(user.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalPage;
