import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'STUDENT'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(''); // ✅ เพิ่ม state สำหรับข้อความสำเร็จ
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await api.post('/api/auth/register', formData);
            
            // ✅ ไม่ใช้ alert แล้ว แต่โชว์ข้อความสีเขียวแทน
            setSuccess('🎉 สมัครสมาชิกสำเร็จ! กำลังพาไปหน้าเข้าสู่ระบบ...');
            
            // รอ 2 วินาทีแล้วค่อยย้ายหน้า
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err: any) {
            const errorMessage = err.response?.data || 'การสมัครสมาชิกไม่สำเร็จ';
            setError(typeof errorMessage === 'string' ? errorMessage : 'Registration failed');
            setLoading(false); // หยุดโหลดเฉพาะตอน Error (ถ้าสำเร็จให้หมุนต่อรอ Redirect)
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
            
            <Link to="/" className="absolute top-8 left-8 flex items-center text-gray-500 hover:text-indigo-600 transition duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                กลับหน้าหลัก
            </Link>

            <div className="max-w-md w-full space-y-6 p-10 bg-white rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <Link to="/" className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 hover:opacity-80 transition cursor-pointer block mb-2">
                        🎓 TutorMatch
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-900">
                        สมัครสมาชิกใหม่
                    </h2>
                </div>

                <form className="mt-5 space-y-4" onSubmit={handleRegister}>
                    
                    {/* 🔴 แสดง Error Message */}
                    {error && <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded animate-fade-in">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>}

                    {/* 🟢 แสดง Success Message (ใหม่) */}
                    {success && <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded animate-fade-in">
                        <p className="text-green-700 text-sm font-medium flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            {success}
                        </p>
                    </div>}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            name="username"
                            type="text"
                            required
                            className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition"
                            placeholder="ตั้งชื่อผู้ใช้"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={loading || !!success} // ล็อคช่องถ้ากำลังโหลดหรือสำเร็จแล้ว
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading || !!success}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="appearance-none block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition"
                            placeholder="ตั้งรหัสผ่าน"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading || !!success}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ฉันต้องการสมัครเป็น</label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className={`cursor-pointer border rounded-lg p-3 text-center transition ${formData.role === 'STUDENT' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold' : 'hover:bg-gray-50'}`}>
                                <input 
                                    type="radio" 
                                    name="role" 
                                    value="STUDENT" 
                                    checked={formData.role === 'STUDENT'} 
                                    onChange={handleChange} 
                                    className="hidden"
                                    disabled={loading || !!success}
                                />
                                🎓 นักเรียน
                            </label>
                            <label className={`cursor-pointer border rounded-lg p-3 text-center transition ${formData.role === 'TUTOR' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold' : 'hover:bg-gray-50'}`}>
                                <input 
                                    type="radio" 
                                    name="role" 
                                    value="TUTOR" 
                                    checked={formData.role === 'TUTOR'} 
                                    onChange={handleChange} 
                                    className="hidden"
                                    disabled={loading || !!success}
                                />
                                👨‍🏫 ติวเตอร์
                            </label>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading || !!success}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    กำลังประมวลผล...
                                </span>
                            ) : 'สมัครสมาชิก'}
                        </button>
                    </div>
                    
                    <div className="text-sm text-center">
                        <p className="text-gray-600">
                            มีบัญชีอยู่แล้ว?{' '}
                            <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500 hover:underline">
                                เข้าสู่ระบบ
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;