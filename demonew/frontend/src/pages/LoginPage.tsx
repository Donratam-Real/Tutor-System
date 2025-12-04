import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await api.post('/api/auth/login', { username, password });
            const { token, role, userId, username: returnedUsername } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('userId', userId);
            localStorage.setItem('username', returnedUsername);

            if (role === 'TUTOR') {
                navigate('/tutor-dashboard');
            } else {
                navigate('/student-home');
            }

        } catch (err: any) {
            const errorMessage = err.response?.data || 'Login failed';
            setError(typeof errorMessage === 'string' ? errorMessage : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
            
            {/* ปุ่มย้อนกลับ */}
            <Link to="/" className="absolute top-8 left-8 flex items-center text-gray-500 hover:text-indigo-600 transition duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                กลับหน้าหลัก
            </Link>

            {/* 🔥 ปรับ space-y-8 เป็น space-y-6 ให้แน่นขึ้น */}
            <div className="max-w-md w-full space-y-6 p-10 bg-white rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <Link to="/" className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 hover:opacity-80 transition cursor-pointer block mb-2">
                        🎓 TutorMatch
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-900">
                        เข้าสู่ระบบ
                    </h2>
                </div>

                {/* 🔥 ปรับ mt-8 เป็น mt-5 เพื่อดึง Input ขึ้นมา */}
                <form className="mt-5 space-y-5" onSubmit={handleLogin}>
                    {error && <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>}
                    
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition"
                                placeholder="กรอกชื่อผู้ใช้"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                        </button>
                    </div>
                    <div className="text-sm text-center">
                        <p className="text-gray-600">
                            ยังไม่มีบัญชี?{' '}
                            <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-500 hover:underline">
                                สมัครสมาชิก
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;