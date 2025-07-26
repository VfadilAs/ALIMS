// src/pages/ApprovalPage.tsx
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
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const users = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<User, 'id'>),
      })) as User[];

      const filtered = users.filter((u) => u.isAdmin !== true);
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
      console.log(`User ${id} disetujui`);
      fetchUsers();
    } catch (err) {
      console.error('Gagal menyetujui:', err);
    }
  };

  const rejectUser = async (id: string, email: string) => {
  const confirmReject = window.confirm(`Tolak & hapus akun ${email}?`);
  if (!confirmReject) return;
  try {
    await deleteDoc(doc(db, 'users', id)); // hapus di Firestore
    fetchUsers(); // refresh UI
  } catch (err) {
    console.error('Gagal menghapus user:', err);
  }
};


  const deleteUser = async (id: string, email: string) => {
    const ok = window.confirm(`Yakin hapus akun ${email}?`);
    if (!ok) return;
    try {
      console.log(`Menghapus user ${id} dari Firestore...`);
      await deleteDoc(doc(db, 'users', id));
      fetchUsers();
    } catch (err) {
      console.error('Gagal menghapus user:', err);
    }
  };

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      navigate('/Dashboard');
    } else {
      fetchUsers();
    }
  }, [navigate]);

  return (
    <div className="min-h-screen w-screen bg-green-800 text-white py-10 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">Halaman Approval</h1>

      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 text-black">
        {loading ? (
          <p className="text-center text-green-800">Memuat data...</p>
        ) : userList.length === 0 ? (
          <p className="text-center text-green-800">Tidak ada pendaftar.</p>
        ) : (
          <div className="space-y-4">
            {userList.map((user) => (
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
                  {!user.approved ? (
                    <>
                      <Button
                        label="Setujui"
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                        onClick={() => approveUser(user.id)}
                      />
                      <Button
  label="Tolak"
  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
  onClick={() => rejectUser(user.id, user.email)}
/>

                    </>
                  ) : (
                    <Button
                      label="Hapus"
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
                      onClick={() => deleteUser(user.id, user.email)}
                    />
                  )}
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
