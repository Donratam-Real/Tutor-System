import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function TutorDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [allSubjects, setAllSubjects] = useState<any[]>([]);
  const [mySubjectIds, setMySubjectIds] = useState<number[]>([]);
  const [profile, setProfile] = useState<any>({ headline: '', description: '', hourlyRate: 0 });
  const [loading, setLoading] = useState(true);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [slotForm, setSlotForm] = useState({ startTime: '', endTime: '' });

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  
  // ❌ ไม่ดึง token ตรงนี้แล้ว เพราะมันจะจำค่าเก่า
  // const token = localStorage.getItem('token'); 

  // ✅ 1. แก้ fetchData: ดึง Token ใหม่ข้างในฟังก์ชัน
  const fetchData = useCallback(async () => {
    const currentToken = localStorage.getItem('token'); // 🔥 ดึงสด
    if (!userId || !currentToken) return;

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${currentToken}` } };

      // ดึงรายการจอง
      try {
        const bookingRes = await axios.get(`http://localhost:8080/api/bookings/tutor/${userId}`, config);
        setBookings(bookingRes.data);
      } catch (e) { console.warn("Booking fetch error", e); }

      // ดึงวิชาทั้งหมด
      try {
        const subjectRes = await axios.get('http://localhost:8080/api/subjects', config);
        setAllSubjects(subjectRes.data);
      } catch (e) { console.warn("Subject fetch error", e); }

      // ดึงข้อมูลโปรไฟล์
      try {
        const profileRes = await axios.get(`http://localhost:8080/api/profiles/tutor/user/${userId}`, config);
        setProfile(profileRes.data);
        if (profileRes.data.subjects) {
            setMySubjectIds(profileRes.data.subjects.map((s: any) => s.id));
        }
      } catch (e) {
        console.warn("ยังไม่ได้สร้างโปรไฟล์ หรือ หาไม่เจอ");
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userId]); // เอา token ออกจาก dependency array เพราะเราดึงสดข้างในแล้ว

  useEffect(() => {
    if (!userId) return;
    fetchData();
  }, [userId, fetchData]);

  // ✅ 2. แก้ saveSubjects: ดึง Token ใหม่
  const saveSubjects = async () => {
    const currentToken = localStorage.getItem('token'); // 🔥 ดึงสด
    try {
        await axios.post('http://localhost:8080/api/profiles/tutor/subjects', mySubjectIds, {
            headers: { Authorization: `Bearer ${currentToken}` }
        });
        alert('✅ บันทึกรายวิชาสำเร็จ!');
    } catch (err) {
        console.error(err);
        alert('❌ บันทึกวิชาไม่สำเร็จ (กรุณา Login ใหม่)');
    }
  };

  // ✅ 3. แก้ saveProfile: ดึง Token ใหม่
  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentToken = localStorage.getItem('token'); // 🔥 ดึงสด
    try {
        await axios.post('http://localhost:8080/api/profiles/tutor', profile, {
            headers: { Authorization: `Bearer ${currentToken}` }
        });
        alert('✅ แก้ไขโปรไฟล์สำเร็จ!');
        setShowProfileModal(false);
        fetchData();
    } catch (err) {
        console.error(err);
        alert('❌ แก้ไขโปรไฟล์ไม่สำเร็จ');
    }
  };

  // ✅ 4. แก้ addSlot: ดึง Token ใหม่
  const addSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentToken = localStorage.getItem('token'); // 🔥 ดึงสด
    try {
        await axios.post('http://localhost:8080/api/tutor/availability', {
            startTime: slotForm.startTime,
            endTime: slotForm.endTime
        }, {
            headers: { Authorization: `Bearer ${currentToken}` }
        });
        alert('✅ เพิ่มเวลาว่างสำเร็จ!');
        setShowSlotModal(false);
        setSlotForm({ startTime: '', endTime: '' });
        fetchData(); // โหลดข้อมูลใหม่เพื่อให้เห็น Slot ที่เพิ่งเพิ่มทันที
    } catch (err) {
        console.error(err);
        alert('❌ เพิ่มเวลาไม่สำเร็จ (ตรวจสอบ Format เวลา)');
    }
  };

  const toggleSubject = (subjectId: number) => {
    if (mySubjectIds.includes(subjectId)) {
        setMySubjectIds(mySubjectIds.filter(id => id !== subjectId));
    } else {
        setMySubjectIds([...mySubjectIds, subjectId]);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-indigo-600 font-bold">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans relative">
      
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
            👨‍🏫 Tutor Dashboard
          </span>
          <div className="flex items-center gap-4">
             <span className="text-gray-600">สวัสดี, <b>{username}</b></span>
             <button onClick={handleLogout} className="text-red-500 hover:text-red-700 font-medium border border-red-100 bg-red-50 px-3 py-1 rounded-lg transition">
                Logout
             </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        
        <div className="lg:col-span-1 space-y-6">
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-3xl mx-auto mb-3">
                    {username?.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-lg font-bold text-gray-800">{profile.headline || "ยังไม่ได้ระบุหัวข้อ"}</h2>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{profile.description || "ยังไม่ได้ระบุรายละเอียด"}</p>
                <p className="text-indigo-600 font-bold text-xl mb-4">฿{profile.hourlyRate} <span className="text-xs text-gray-400">/ ชม.</span></p>
                
                <button 
                    onClick={() => setShowProfileModal(true)}
                    className="w-full bg-indigo-50 text-indigo-600 py-2 rounded-xl font-bold hover:bg-indigo-100 transition"
                >
                    ✏️ แก้ไขโปรไฟล์
                </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4">📚 วิชาที่เปิดสอน</h2>
                <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar">
                    {allSubjects.map((sub) => (
                        <label key={sub.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer transition">
                            <input 
                                type="checkbox" 
                                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                                checked={mySubjectIds.includes(sub.id)}
                                onChange={() => toggleSubject(sub.id)}
                            />
                            <span className="text-gray-700 text-sm">{sub.name}</span>
                        </label>
                    ))}
                </div>
                <button onClick={saveSubjects} className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-xl font-bold hover:bg-indigo-700 transition text-sm shadow-sm">
                    บันทึกวิชา
                </button>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-md text-white text-center">
                <h2 className="text-lg font-bold mb-2">📅 จัดการเวลาว่าง</h2>
                <p className="text-blue-100 text-xs mb-4">เพิ่มช่วงเวลาที่คุณสะดวกสอน</p>
                <button 
                    onClick={() => setShowSlotModal(true)}
                    className="w-full bg-white text-indigo-600 py-2 rounded-lg font-bold hover:bg-gray-100 transition shadow-sm"
                >
                    + เพิ่มเวลาว่าง
                </button>
            </div>
        </div>

        <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[600px]">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    📌 รายการจองล่าสุด <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm">{bookings.length}</span>
                </h2>

                {bookings.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                        <div className="text-6xl mb-4">📭</div>
                        <p className="text-gray-500">ยังไม่มีการจองเข้ามา</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="bg-white p-5 rounded-xl border border-gray-100 hover:shadow-md transition flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-4 w-full">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xl shadow-sm">
                                        {booking.student?.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">{booking.student?.username}</h3>
                                        <p className="text-sm text-gray-500">วิชา: {booking.slot?.tutor?.subjects?.[0]?.name || 'General'}</p>
                                    </div>
                                </div>
                                <div className="text-right w-full sm:w-auto">
                                    <p className="font-bold text-gray-700 whitespace-nowrap">
                                        {new Date(booking.slot?.startTime).toLocaleDateString('th-TH')}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(booking.slot?.startTime).toLocaleTimeString('th-TH', {hour:'2-digit', minute:'2-digit'})} - 
                                        {new Date(booking.slot?.endTime).toLocaleTimeString('th-TH', {hour:'2-digit', minute:'2-digit'})}
                                    </p>
                                </div>
                                <div className="w-full sm:w-auto text-right">
                                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold uppercase tracking-wide">
                                        {booking.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

      </div>

      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">✏️ แก้ไขข้อมูลส่วนตัว</h2>
                <form onSubmit={saveProfile} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">หัวข้อแนะนำตัว (Headline)</label>
                        <input 
                            type="text" 
                            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={profile.headline || ''}
                            onChange={(e) => setProfile({...profile, headline: e.target.value})}
                            placeholder="เช่น สอนคณิตเข้าใจง่าย ประสบการณ์ 5 ปี"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด (Bio)</label>
                        <textarea 
                            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none"
                            value={profile.description || ''}
                            onChange={(e) => setProfile({...profile, description: e.target.value})}
                            placeholder="แนะนำตัวเอง ประวัติการศึกษา สไตล์การสอน..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ค่าเรียนต่อชั่วโมง (บาท)</label>
                        <input 
                            type="number" 
                            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={profile.hourlyRate || 0}
                            onChange={(e) => setProfile({...profile, hourlyRate: parseFloat(e.target.value)})}
                        />
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button type="button" onClick={() => setShowProfileModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-200 transition">ยกเลิก</button>
                        <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md">บันทึก</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {showSlotModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">📅 เพิ่มช่วงเวลาว่าง</h2>
                <form onSubmit={addSlot} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">เวลาเริ่มต้น</label>
                        <input 
                            type="datetime-local" 
                            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={slotForm.startTime}
                            onChange={(e) => setSlotForm({...slotForm, startTime: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">เวลาสิ้นสุด</label>
                        <input 
                            type="datetime-local" 
                            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={slotForm.endTime}
                            onChange={(e) => setSlotForm({...slotForm, endTime: e.target.value})}
                            required
                        />
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button type="button" onClick={() => setShowSlotModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-200 transition">ยกเลิก</button>
                        <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition shadow-md">ยืนยัน</button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}