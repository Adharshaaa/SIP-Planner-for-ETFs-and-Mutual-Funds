import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
}) => {
  const sizeDimensions = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Brand Emblem Matching the User's Image */}
      <div
        className={`${sizeDimensions[size]} relative flex items-center justify-center shrink-0 drop-shadow-xs transition-transform hover:scale-105`}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Diamond Rhombus Outer Frame */}
          <polygon
            points="50,7.5 92.5,50 50,92.5 7.5,50"
            fill="#ffffff"
            stroke="#00a4e4"
            strokeWidth="8"
            strokeLinejoin="round"
          />

          {/* 3 Rising Growth Bars Rotated 45 Degrees */}
          <g transform="rotate(45 50 50)">
            {/* Bar 1: Short Cyan Blue */}
            <rect
              x="29.5"
              y="53"
              width="9"
              height="13.5"
              rx="1.5"
              fill="#00a4e4"
            />

            {/* Bar 2: Medium Golden Amber */}
            <rect
              x="41.5"
              y="40"
              width="9"
              height="26.5"
              rx="1.5"
              fill="#e5a900"
            />

            {/* Bar 3: Tall Fresh Lime Green */}
            <rect
              x="53.5"
              y="25"
              width="9"
              height="41.5"
              rx="1.5"
              fill="#8bc34a"
            />
          </g>
        </svg>
      </div>

      {showText && (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-950 dark:text-white leading-none">
              Cautilya
            </span>
            <span className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-slate-700 dark:text-slate-300 leading-none">
              Capital
            </span>
          </div>
          <div className="text-[9.5px] uppercase tracking-[0.2em] font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Wealth & Asset Management
          </div>
        </div>
      )}
    </div>
  );
};
