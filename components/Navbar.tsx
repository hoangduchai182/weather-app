'use client';

import { useApp } from '@/contexts/AppContext';

export default function Navbar() {
  const { language, toggleLanguage, t } = useApp();

  // Html của Navbar
  return (
    <nav className="fixed top-4 left-4 right-4 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="backdrop-blur-2xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                N
              </div>
              <h2 className="text-white font-bold text-xl hidden sm:block">
                Trần Duy Trường
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleLanguage}
                className="backdrop-blur-xl bg-white/10 hover:bg-white/20
                           px-4 py-2 rounded-xl border border-white/20
                           text-white font-semibold transition-all duration-200
                           hover:scale-105 cursor-pointer flex items-center gap-2
                           focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Change language"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span className="hidden sm:inline">{language}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
