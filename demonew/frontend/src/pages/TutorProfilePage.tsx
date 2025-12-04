import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function TutorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [tutor, setTutor] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profileRes = await axios.get(`http://localhost:8080/api/profiles/tutor/${id}`);
        setTutor(profileRes.data);

        try {
            const slotRes = await axios.get(`http://localhost:8080/api/tutor/${id}/availability`);
            setSlots(slotRes.data);
        } catch (slotErr) {
            console.warn("No availability data");
        }
      } catch (err) {
        setError('ไม่พบข้อมูลติวเตอร์คนนี้');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleBook = async (slotId: number) => {
    if (!token) {
        alert('กรุณาเข้าสู่ระบบก่อนจอง');
        navigate('/login');
        return;
    }
    if (!window.confirm('ยืนยันการจองเวลาเรียนนี้?')) return;

    try {
        await axios.post(
            `http://localhost:8080/api/student/book?slotId=${slotId}`,
            {}, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('🎉 จองสำเร็จ! ดูตารางเรียนได้ที่เมนู "ตารางเรียนของฉัน"');
        const slotRes = await axios.get(`http://localhost:8080/api/tutor/${id}/availability`);
        setSlots(slotRes.data);
    } catch (err) {
        alert('เกิดข้อผิดพลาดในการจอง');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-indigo-600 font-bold">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!tutor) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* 🟢 1. Cover & Header Section */}
      <div className="relative h-64 bg-gradient-to-r from-indigo-600 to-blue-500 shadow-md">
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full backdrop-blur-sm transition flex items-center gap-2">
          ← ย้อนกลับ
        </button>
        <div className="absolute -bottom-16 left-0 right-0 flex justify-center">
             {/* รูป Profile ใหญ่ๆ ตรงกลาง */}
            <div className="w-32 h-32 bg-white p-1 rounded-full shadow-xl">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-5xl">
                    {tutor.user?.username?.charAt(0).toUpperCase()}
                </div>
            </div>
        </div>
      </div>

      {/* 🟢 2. Main Content */}
      <div className="container mx-auto px-4 mt-20 max-w-5xl">
        
        {/* Info Header */}
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-800">{tutor.user?.username}</h1>
            <p className="text-indigo-600 font-medium text-lg mt-1">{tutor.headline}</p>
            
            <div className="flex justify-center items-center gap-4 mt-4 text-gray-600">
                <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm border">
                    <span>⭐</span> <span className="font-bold text-gray-800">4.9</span> <span className="text-xs text-gray-400">(120 รีวิว)</span>
                </div>
                <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm border">
                    <span>💰</span> <span className="font-bold text-gray-800">฿{tutor.hourlyRate}</span> <span className="text-xs text-gray-400">/ชม.</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
            {/* 🟢 ฝั่งซ้าย: About Me */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">📖 เกี่ยวกับผู้สอน</h2>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                        {tutor.description || "ติวเตอร์ยังไม่ได้ระบุข้อมูลเพิ่มเติม"}
                    </p>
                </div>

                {/* Reviews (Mockup) */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">💬 รีวิวล่าสุด</h2>
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <div className="flex justify-between items-start">
                                <span className="font-bold text-gray-700">น้องมายด์</span>
                                <span className="text-yellow-500 text-sm">★★★★★</span>
                            </div>
                            <p className="text-gray-600 text-sm mt-1">สอนเข้าใจง่ายมากค่ะ ใจดีสุดๆ</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <div className="flex justify-between items-start">
                                <span className="font-bold text-gray-700">Student A</span>
                                <span className="text-yellow-500 text-sm">★★★★☆</span>
                            </div>
                            <p className="text-gray-600 text-sm mt-1">เตรียมการสอนมาดีมากครับ</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🟢 ฝั่งขวา: Booking Panel */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-50 sticky top-24">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        📅 ตารางเรียนว่าง
                    </h2>

                    {slots.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed">
                            <p className="text-gray-500">ยังไม่มีคิวว่างเร็วๆ นี้</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                            {slots.map((slot) => (
                                <div 
                                    key={slot.id} 
                                    className={`p-4 rounded-xl border transition-all duration-200 relative group
                                        ${slot.booked 
                                            ? 'bg-gray-50 border-gray-200 opacity-60' 
                                            : 'bg-white border-indigo-100 hover:border-indigo-500 hover:shadow-md cursor-pointer'
                                        }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-gray-700 text-sm">
                                                {new Date(slot.startTime).toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric', month: 'short' })}
                                            </p>
                                            <p className="text-indigo-600 font-bold text-lg">
                                                {new Date(slot.startTime).toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})} 
                                                <span className="text-gray-400 text-sm font-normal mx-1">-</span>
                                                {new Date(slot.endTime).toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})}
                                            </p>
                                        </div>
                                        
                                        {!slot.booked && (
                                            <button 
                                                onClick={() => handleBook(slot.id)}
                                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md group-hover:bg-indigo-700 transition transform group-hover:scale-105"
                                            >
                                                จอง
                                            </button>
                                        )}
                                        {slot.booked && <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded">เต็ม</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}