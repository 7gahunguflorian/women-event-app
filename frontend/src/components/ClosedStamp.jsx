import React from 'react';
import { XCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ClosedStamp = () => {
  const { t } = useLanguage();

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
      {/* Overlay semi-transparent */}
      <div className="absolute inset-0 bg-white/40 dark:bg-gray-900/40 backdrop-blur-[2px]"></div>
      
      {/* Tampon rouge */}
      <div className="relative transform -rotate-12 animate-stamp">
        <div className="relative">
          {/* Bordure externe du tampon */}
          <div className="border-8 border-red-600 rounded-3xl p-8 bg-red-50/95 dark:bg-red-900/95 shadow-2xl">
            {/* Bordure interne */}
            <div className="border-4 border-red-600 rounded-2xl p-6 bg-white/80 dark:bg-gray-800/80">
              <div className="flex flex-col items-center gap-4">
                {/* Icône */}
                <XCircle className="w-16 h-16 sm:w-20 sm:h-20 text-red-600 animate-pulse" strokeWidth={3} />
                
                {/* Titre principal */}
                <h3 className="text-3xl sm:text-5xl font-black text-red-600 text-center tracking-wider uppercase" style={{ fontFamily: 'Impact, sans-serif' }}>
                  {t('closed.title')}
                </h3>
                
                {/* Message */}
                <p className="text-base sm:text-lg font-bold text-red-700 dark:text-red-500 text-center max-w-md">
                  {t('closed.message')}
                </p>
                
                {/* Remerciement */}
                <p className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 text-center italic">
                  {t('closed.thankYou')}
                </p>
              </div>
            </div>
          </div>
          
          {/* Effet d'ombre portée du tampon */}
          <div className="absolute inset-0 -z-10 bg-red-600/20 blur-xl rounded-3xl transform translate-y-2"></div>
        </div>
      </div>

      {/* Animation CSS */}
      <style jsx>{`
        @keyframes stamp {
          0% {
            transform: scale(0) rotate(-12deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) rotate(-12deg);
          }
          100% {
            transform: scale(1) rotate(-12deg);
            opacity: 1;
          }
        }
        
        .animate-stamp {
          animation: stamp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default ClosedStamp;
