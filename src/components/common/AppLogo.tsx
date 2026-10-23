import React from 'react';
import { GovernmentLotteryHeader, GLO_LOGO_IMAGE } from './Mega3UpHeader';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  if (size === 'xl') {
    return (
      <GovernmentLotteryHeader
        variant="banner"
        subText="OFFICIAL WEEKLY RESULT"
        className={className}
      />
    );
  }

  if (size === 'sm') {
    return (
      <GovernmentLotteryHeader
        variant="compact"
        subText="WEEKLY RESULT"
        className={className}
      />
    );
  }

  // Medium / Large standard logo
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Emblem Logo */}
      <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 relative transition-transform hover:scale-105">
        <div className="absolute inset-0 rounded-full bg-sky-400/20 blur-sm pointer-events-none" />
        <img
          src={GLO_LOGO_IMAGE}
          alt="Government Lottery Officer Logo"
          className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(2,132,199,0.4)] relative z-10"
        />
      </div>

      <div className="flex flex-col text-left">
        <div className="flex items-baseline gap-1.5 font-black text-lg sm:text-xl leading-none">
          <span className="text-white">GOVERNMENT</span>
          <span className="text-amber-300">LOTTERY</span>
          <span className="text-[10px] px-2 py-0.5 bg-sky-600 text-white font-black rounded-md ml-1 shadow-xs border border-sky-400">
            OFFICER
          </span>
        </div>
        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[10px] font-black text-sky-200 tracking-wider uppercase">
              OFFICIAL WEEKLY DRAW
            </span>
            <span className="text-sky-300/50 text-[10px]">•</span>
            <span className="text-[10px] font-bold text-amber-300">
              500X Multiplier
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
