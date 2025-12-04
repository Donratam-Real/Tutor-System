import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function StudentHome() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All'); // เพิ่มตัวกรองวิชา
  const navigate = useNavigate();
  
  const username = localStorage.getItem('username') || 'นักเรียน';

  // รายชื่อวิชาสำหรับ Quick Filter
  const subjects = ['All', 'Mathematics', 'English', 'Physics', 'Chemistry', 'Biology'];

  useEffect(() => {
    axios.get('http://localhost:8080/api/profiles/tutor')
      .then(res => setTutors(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Logic การกรองข้อมูล
  const filteredTutors = tutors.filter(tutor => {
    const text = searchTerm.toLowerCase();
    const matchesSearch = 
      tutor.headline?.toLowerCase().includes(text) ||
      tutor.user?.username?.toLowerCase().includes(text) ||
      tutor.description?.toLowerCase().includes(text);

    const matchesSubject = selectedSubject === 'All' 
      ? true 
      : (tutor.headline?.toLowerCase().includes(selectedSubject.toLowerCase()) || 
         tutor.description?.toLowerCase().includes(selectedSubject.toLowerCase()));

    return matchesSearch && matchesSubject;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* 🟢 1. Modern Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
            <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              🎓 TutorMatch
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm text-gray-500">ยินดีต้อนรับ,</span>
              <span className="font-bold text-gray-800">{username}</span>
            </div>
            
            <button 
              onClick={() => navigate('/student-schedule')}
              className="flex items-center gap-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-full font-medium transition duration-200"
            >
              📅 <span className="hidden sm:inline">ตารางเรียนของฉัน</span>
            </button>

            <button 
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-500 font-medium px-2 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 🟢 2. Hero & Search Section */}
      {/* ปรับ pb-20 เป็น pb-12 เพื่อไม่ให้สีฟ้ากินพื้นที่ด้านล่างเยอะเกินไป */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 pb-12 pt-10 px-6 shadow-lg">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 drop-shadow-md">
            ค้นหาติวเตอร์ที่ใช่ เพื่ออนาคตที่ดีกว่า
          </h1>
          
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-gray-400 group-focus-within:text-indigo-500 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="ค้นหาชื่อวิชา, ชื่อครู, หรือทักษะ..." 
              className="w-full pl-12 pr-4 py-4 rounded-xl shadow-2xl border-none focus:ring-4 focus:ring-indigo-300 focus:outline-none text-lg placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 🟢 3. Quick Filters */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                  selectedSubject === sub 
                  ? 'bg-white text-indigo-600 border-white shadow-md transform scale-105' 
                  : 'bg-indigo-700/50 text-indigo-100 border-transparent hover:bg-indigo-600'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🟢 4. Main Content (Tutor Cards) */}
      {/* 🔥 แก้ตรงนี้: เปลี่ยน -mt-10 เป็น mt-10 เพื่อเพิ่มระยะห่าง */}
      <div className="container mx-auto px-6 mt-10 pb-12">
        
        <div className="flex justify-between items-end mb-6 px-2 border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                {selectedSubject === 'All' ? '🌟 ติวเตอร์แนะนำ' : `📚 ติวเตอร์วิชา ${selectedSubject}`}
            </h2>
        </div>

        {filteredTutors.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                    🧐
                </div>
                <h3 className="text-xl font-bold text-gray-700">ไม่พบติวเตอร์ที่คุณค้นหา</h3>
                <p className="text-gray-500 mt-2">ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นดูนะครับ</p>
                <button 
                    onClick={() => {setSearchTerm(''); setSelectedSubject('All');}}
                    className="mt-6 text-indigo-600 hover:underline font-medium"
                >
                    ล้างคำค้นหาทั้งหมด
                </button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutors.map((tutor) => (
                <div key={tutor.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col hover:-translate-y-1">
                
                <div className="p-6 flex-grow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-110 transition duration-300">
                                {tutor.user?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-indigo-600 transition">
                                    {tutor.user?.username}
                                </h3>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Professional Tutor</p>
                            </div>
                        </div>
                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                            <span className="text-yellow-500 text-sm">★</span>
                            <span className="text-xs font-bold text-yellow-700 ml-1">4.9</span>
                        </div>
                    </div>
                    
                    <h4 className="text-md font-semibold text-gray-800 mb-2 line-clamp-1">{tutor.headline}</h4>
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                        {tutor.description}
                    </p>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                    <div>
                        <span className="block text-xs text-gray-500">ค่าเรียน</span>
                        <span className="text-indigo-600 font-extrabold text-xl">฿{tutor.hourlyRate}</span>
                        <span className="text-xs text-gray-500"> / ชม.</span>
                    </div>
                    <button 
                        onClick={() => navigate(`/tutor/${tutor.id}`)}
                        className="bg-white text-indigo-600 border border-indigo-200 px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-600 hover:text-white hover:border-transparent transition-all duration-200 shadow-sm"
                    >
                        ดูโปรไฟล์
                    </button>
                </div>
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
    );
}