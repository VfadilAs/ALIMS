import React, { useState } from 'react';
import Input from '../component/Input';
import Button from '../component/Button';
import AlertMessage from '../component/AlertMessage';
import { useNavigate } from 'react-router-dom';

import { auth } from '../firebase/FirebaseConfig';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';

import { doc, setDoc, getDoc } from "firebase/firestore";

import { db } from '../firebase';

import logo from '../assets/logo-al-islah.png';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [showResetForm, setShowResetForm] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const user = userCredential.user;

      // Ambil data user dari Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      if (userData?.approved === false) {
  setErrorMessage('Akun Anda belum disetujui oleh admin.');
  return;
}

// Simpan isAdmin ke localStorage
localStorage.setItem('isAdmin', userData?.isAdmin ? 'true' : 'false');

navigate('/Dashboard');

      navigate('/Dashboard');
    } catch (error: any) {
      setErrorMessage('Login gagal: ' + error.message);
    }
  };

  const handleRegister = async () => {
  setErrorMessage('');
  setSuccessMessage('');

  if (username.length < 3) {
    setErrorMessage('Email minimal 3 karakter.');
    return;
  }
  if (password.length < 6) {
    setErrorMessage('Password minimal 6 karakter.');
    return;
  }
  if (password !== confirmPassword) {
    setErrorMessage('Konfirmasi Password tidak cocok.');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, username, password);
    const user = userCredential.user;

    // 💡 Email & password khusus admin
    const adminEmail = "fadil.affabani@gmail.com";
    const adminPassword = "ishikawa14"; // kamu bisa ubah sesuai keinginan

    // Jika cocok, langsung diapprove sebagai admin
    const isAdmin = username === adminEmail && password === adminPassword;

    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      approved: isAdmin ? true : false,
      isAdmin: isAdmin
    });

    setSuccessMessage(
      isAdmin
        ? 'Admin berhasil dibuat dan langsung aktif!'
        : 'Registrasi berhasil! Menunggu persetujuan admin.'
    );
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setIsRegisterMode(false);
  } catch (error: any) {
    setErrorMessage('Registrasi gagal: ' + error.message);
  }
};



  const handlePasswordReset = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    if (!resetEmail) {
      setErrorMessage('Masukkan email untuk reset password.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setSuccessMessage('Link reset password telah dikirim ke email Anda.');
      setResetEmail('');
      setShowResetForm(false);
    } catch (error: any) {
      setErrorMessage('Gagal mengirim email reset: ' + error.message);
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setErrorMessage('');
    setSuccessMessage('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen w-screen bg-green-800 flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <img src={logo} alt="Logo" className="h-32 w-32 object-contain" />
      </div>

      <h1 className="text-white text-5xl font-bold mb-2">ALIMS</h1>
      <p className="text-white md:text-2xl mb-12 text-sm">AL-ISHLAH MANAGEMENT SYSTEM</p>

      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {isRegisterMode ? 'REGISTER TPQ' : showResetForm ? 'RESET PASSWORD' : 'LOGIN TPQ'}
        </h2>

        {errorMessage && (
          <div className="mb-4">
            <AlertMessage message={errorMessage} type="error" />
          </div>
        )}
        {successMessage && (
          <div className="mb-4">
            <AlertMessage message={successMessage} type="success" />
          </div>
        )}

        {showResetForm ? (
          <>
            <Input
              label="Email"
              type="email"
              id="resetEmail"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="Masukkan email Anda"
            />
            <div className="flex justify-center mt-6">
              <Button label="Kirim Reset Password" onClick={handlePasswordReset} className="w-full" />
            </div>
            <p
              onClick={() => {
                setShowResetForm(false);
                setResetEmail('');
              }}
              className="text-center text-sm text-green-600 font-bold mt-4 hover:underline cursor-pointer"
            >
              Kembali ke Login
            </p>
          </>
        ) : (
          <>
            <Input
              label="Email"
              type="email"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan email Anda"
            />
            <Input
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password Anda"
            />

            {isRegisterMode && (
              <Input
                label="Konfirmasi Password"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Konfirmasi password Anda"
              />
            )}

            <div className="flex justify-center mt-6">
              <Button
                label={isRegisterMode ? 'Daftar' : 'Login'}
                onClick={isRegisterMode ? handleRegister : handleLogin}
                className="w-full"
              />
            </div>

            {!isRegisterMode && (
              <p
                onClick={() => {
                  setShowResetForm(true);
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="text-center text-sm text-blue-600 font-semibold mt-4 hover:underline cursor-pointer"
              >
                Lupa Password?
              </p>
            )}

            <p className="text-center text-gray-600 text-sm font-semibold mt-4">
              {isRegisterMode ? 'Sudah Punya Akun?' : 'Belum Punya Akun?'}
              <span
                onClick={toggleMode}
                className="text-green-600 hover:text-green-800 font-bold ml-1 cursor-pointer hover:underline"
              >
                {isRegisterMode ? 'Login di sini' : 'Daftar sekarang'}
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
