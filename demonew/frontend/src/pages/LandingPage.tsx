import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <span className="text-3xl font-extrabold text-indigo-600 tracking-tight">
                🎓 TutorMatch
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition px-3 py-2">
                เข้าสู่ระบบ
              </Link>
              <Link to="/register" className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5">
                สมัครสมาชิก
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gray-50 pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Text Content (ฝั่งซ้าย) */}
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left z-10">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
                <span className="block">ค้นหาติวเตอร์ที่ใช่</span>
                <span className="block text-indigo-600 mt-2">เพื่ออนาคตที่ดีกว่า</span>
              </h1>
              <p className="mt-6 text-lg text-gray-500 sm:text-xl md:max-w-3xl">
                แพลตฟอร์มการเรียนรู้ที่เชื่อมต่อคุณกับติวเตอร์คุณภาพ จองง่าย เรียนได้ทันที ไม่ว่าจะเป็นคณิตศาสตร์ ภาษาอังกฤษ หรือวิทยาศาสตร์
              </p>
              <div className="mt-10 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0 flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1">
                  เริ่มต้นใช้งานฟรี
                </Link>
                <Link to="/login" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-2 border-indigo-100 text-lg font-bold rounded-xl text-indigo-700 bg-white hover:bg-indigo-50 transition">
                  ดูรายชื่อติวเตอร์
                </Link>
              </div>
            </div>

            {/* Image Content (ฝั่งขวา - แก้ไขให้ใหญ่ขึ้น) */}
            <div className="mt-16 lg:mt-0 lg:col-span-6 relative">
               {/* วงกลมตกแต่ง background */}
               <div className="hidden lg:block absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-100 opacity-50 blur-3xl"></div>
               <div className="hidden lg:block absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-blue-100 opacity-50 blur-3xl"></div>

               <div className="relative mx-auto w-full rounded-2xl shadow-2xl lg:max-w-full overflow-hidden transform hover:scale-[1.02] transition duration-500 ease-in-out border-4 border-white">
                <img
                  className="w-full h-auto object-cover object-center"
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                  alt="Student learning group"
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-16">
            <h2 className="text-base text-indigo-600 font-bold tracking-wide uppercase">How it works</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              เริ่มต้นง่ายๆ ใน 3 ขั้นตอน
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
             {/* Card 1 */}
             <div className="text-center p-8 bg-white border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition hover:-translate-y-2">
                <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-100 text-indigo-600 mx-auto mb-6 text-3xl">
                  🔍
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">1. ค้นหาติวเตอร์</h3>
                <p className="text-gray-500">
                  เลือกดูโปรไฟล์ อ่านรีวิว และค้นหาติวเตอร์ที่ตรงใจคุณที่สุดจากฐานข้อมูลของเรา
                </p>
              </div>

              {/* Card 2 */}
              <div className="text-center p-8 bg-white border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition hover:-translate-y-2">
                <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-100 text-indigo-600 mx-auto mb-6 text-3xl">
                  📅
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">2. จองเวลาเรียน</h3>
                <p className="text-gray-500">
                  เช็คตารางว่างและกดจองเวลาเรียนที่คุณสะดวกได้ทันที ระบบยืนยันอัตโนมัติ
                </p>
              </div>

              {/* Card 3 */}
              <div className="text-center p-8 bg-white border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition hover:-translate-y-2">
                <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-100 text-indigo-600 mx-auto mb-6 text-3xl">
                  🎓
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">3. เริ่มเรียนรู้</h3>
                <p className="text-gray-500">
                  เข้าเรียนตามเวลาที่นัดหมาย พัฒนาทักษะและเกรดเฉลี่ยของคุณให้ดียิ่งขึ้น
                </p>
              </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">🎓 TutorMatch</h2>
          <p className="text-gray-400 mb-2">แพลตฟอร์มจองติวเตอร์ที่ดีที่สุดสำหรับคุณ</p>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;