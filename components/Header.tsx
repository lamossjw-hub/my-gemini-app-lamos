
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
          <i className="fa-solid fa-camera-retro text-white text-2xl"></i>
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Gemini AI <span className="text-indigo-600">Studio</span>
          </h1>
          <p className="text-slate-500 text-sm">Chỉnh sửa ảnh chuyên nghiệp bằng AI</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
