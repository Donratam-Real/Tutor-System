import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function StudentSchedule() {
  const [bookings, setBookings] = useState<any[]>([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;
    axios.get(`http://localhost:8080/api/bookings/student/${userId}`)
      .then(res => setBookings(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
        
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
             <button onClick={() => navigate('/student-home')} className="text-gray-500 hover:text-indigo-600 flex items-center gap-2 font-medium transition">
                ← กลับหน้าค้นหา
             </button>
             <h1 className="text-xl font-bold text-gray-800">ตารางเรียนของฉัน</h1>
             <div className="w-20"></div> {/* Spacer */}
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-6 mt-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            📅 Upcoming Classes
            <span className="text-sm font-normal bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                {bookings.length} คลาส
            </span>
        </h2>

        {bookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                <div className="text-6xl mb-4">😴</div>
                <h3 className="text-xl font-bold text-gray-700">ยังไม่มีตารางเรียน</h3>
                <p className="text-gray-500 mt-2">คุณยังไม่ได้จองคอร์สเรียนใดๆ ลองไปค้นหาติวเตอร์ดูสิ!</p>
                <button 
                    onClick={() => navigate('/student-home')}
                    className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                    ค้นหาติวเตอร์
                </button>
            </div>
        ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition duration-300 border border-gray-100 overflow-hidden flex flex-col sm:flex-row">
                  
                  {/* ส่วนวันที่ (ฝั่งซ้าย) */}
                  <div className="bg-indigo-50 sm:w-32 p-6 flex flex-col items-center justify-center text-center border-b sm:border-b-0 sm:border-r border-indigo-100">
                    <span className="text-indigo-600 font-bold text-xl">
                        {new Date(booking.slot?.startTime).getDate()}
                    </span>
                    <span className="text-indigo-400 text-sm uppercase font-bold">
                        {new Date(booking.slot?.startTime).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-gray-400 text-xs mt-1">
                        {new Date(booking.slot?.startTime).toLocaleDateString('en-US', { year: 'numeric' })}
                    </span>
                  </div>

                  {/* รายละเอียด (ฝั่งขวา) */}
                  <div className="p-6 flex-grow flex flex-col justify-center relative">
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                          ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {booking.status}
                        </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                       วิชา: {booking.slot?.tutor?.subjects?.[0]?.name || "General Subject"}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <span className="text-lg">👨‍🏫</span>
                        <span className="font-bold">ครู {booking.tutor?.username}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-1">
                            <span>⏰</span>
                            <span className="font-bold text-gray-700">
                                {new Date(booking.slot?.startTime).toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})}
                            </span>
                            <span>-</span>
                            <span className="font-bold text-gray-700">
                                {new Date(booking.slot?.endTime).toLocaleTimeString('th-TH', {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                             <span>📍</span>
                             <span>Online Class</span>
                        </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
        )}
      </div>
    </div>
  );
}