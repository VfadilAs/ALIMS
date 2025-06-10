import React, { useState } from 'react';
import Input from '../component/Input';
import Button from '../component/Button';
import AlertMessage from '../component/AlertMessage';

// You would replace this with your actual logo path
import logo from '../assets/logo-al-islah.png'; // Assuming your logo is in src/assets

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>(''); // For registration
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>(''); // For registration success
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false); // State to switch between login/register

  const handleLogin = () => {
    setErrorMessage('');
    setSuccessMessage('');
    // Basic validation for demonstration purposes
    if (username === 'admin' && password === 'password') {
      alert('Login Berhasil!');
      // In a real application, you would typically redirect the user
    } else {
      setErrorMessage('Username atau Password salah. Silakan coba lagi !');
    }
  };

  const handleRegister = () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (username.length < 3) {
      setErrorMessage('Username minimal 3 karakter.');
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

    // In a real application, you would send this data to your backend for registration
    console.log('Registering user:', { username, password });
    setSuccessMessage('Registrasi berhasil! Silakan login dengan akun Anda.');
    // Optionally, clear fields after successful registration
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setIsRegisterMode(false); // Switch back to login mode after successful registration
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setErrorMessage(''); // Clear messages when switching modes
    setSuccessMessage('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-green-800 flex flex-col items-center justify-center p-4">
      {/* Logo Section */}
      <div className="mb-8">
        <img src={logo} alt="AL-ISHLAH Management System Logo" className="h-32 w-32 object-contain" />
      </div>

      {/* Title Section */}
      <h1 className="text-white text-5xl font-bold mb-2">ALIMS</h1>
      <p className="text-white md:text-2xl mb-12 text-sm">AL-ISHLAH MANAGEMENT SYSTEM</p>

      {/* Form Card */}
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {isRegisterMode ? 'REGISTER TPQ' : 'LOGIN TPQ'}
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

        <Input
          label="Username"
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Masukkan username Anda"
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

        <p className="text-center text-gray-600 text-sm font-semibold mt-4 justify-between flex-col ">
           {isRegisterMode ? 'Sudah Punya Akun?' : 'Belum Punya Akun?'}
          <p onClick={toggleMode}
            // Tambahkan kelas Tailwind untuk efek hover pada tombol switch mode
            className="text-green-600 hover:text-green-800 font-bold ml-1
                       hover:underline transition-all duration-200 ease-in-out focus:outline-none"
          >
            {isRegisterMode ? 'Login di sini' : 'Daftar sekarang'}
          </p>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;