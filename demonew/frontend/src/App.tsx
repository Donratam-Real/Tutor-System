// frontend/src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentHome from './pages/StudentHome';
import TutorDashboard from './pages/TutorDashboard';
import StudentSchedule from './pages/StudentSchedule';
import LandingPage from './pages/LandingPage'; // <--- 1. Import มา
import TutorProfilePage from './pages/TutorProfilePage';

function App() {
  return (
    <div className="App">
      <main>
        <Routes>
           {/* 2. ตั้ง LandingPage เป็นหน้าแรก (path="/") */}
          <Route path="/" element={<LandingPage />} /> 

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/student-home" element={<StudentHome />} />
          <Route path="/tutor-dashboard" element={<TutorDashboard />} />
          <Route path="/student-schedule" element={<StudentSchedule />} />
          <Route path="/tutor/:id" element={<TutorProfilePage />} />
          {/* ส่วน Route อื่นๆ เก็บไว้เหมือนเดิม */}
        </Routes>
      </main>
    </div>
  );
}

export default App;