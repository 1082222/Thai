import React from 'react';

export const GLO_LOGO_IMAGE = '/assets/aistudio/IMG_0029_60edeb6c.webp';

interface GovernmentLotteryHeaderProps {
  variant?: 'banner' | 'compact' | 'badge-only';
  subText?: string;
  className?: string;
  showPartnerBadge?: boolean;
}

export const GovernmentLotteryHeader: React.FC<GovernmentLotteryHeaderProps> = ({
  variant = 'banner',
  subText = 'WEEKLY RESULT',
  className = '',
  showPartnerBadge = true,
}) => {
  // Official Logo Emblem Component using the user-provided image asset
  const LogoEmblem = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
    const dimensions =
      size === 'sm'
        ? 'w-10 h-10'
        : size === 'lg'
        ? 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28'
        : 'w-14 h-14 sm:w-16 sm:h-16';

    return (
      <div className={`relative flex-shrink-0 ${dimensions} select-none transition-transform hover:scale-105`}>
        <div className="absolute inset-0 rounded-full bg-sky-400/30 blur-md pointer-events-none" />
        <img
          src={GLO_LOGO_IMAGE}
          alt="The Government Lottery Officer Emblem"
          className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(2,132,199,0.5)] relative z-10"
          loading="eager"
        />
      </div>
    );
  };

  // Official Verified Badge
  const OfficialOfficeBadge = ({ compact = false }: { compact?: boolean }) => {
    return (
      <div
        className={`bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 flex items-center gap-2 sm:gap-2.5 shadow-xl border-2 border-sky-300/80 select-none flex-shrink-0 ${
          compact ? 'scale-90 origin-right' : ''
        }`}
      >
        {/* Emblem Mini Stamp */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 relative flex items-center justify-center p-0.5">
          <img
            src={GLO_LOGO_IMAGE}
            alt="Emblem Seal"
            className="w-full h-full object-contain drop-shadow-xs"
          />
        </div>

        {/* Text Details */}
        <div className="flex flex-col justify-center text-left leading-tight pr-1 sm:pr-2">
          <span className="text-[8px] sm:text-[9.5px] font-black text-sky-950 tracking-wider uppercase">
            AUTHORIZED DRAW
          </span>
          <div className="w-full h-[1px] bg-sky-200 my-0.5" />
          <span className="text-[7.5px] sm:text-[9px] font-bold text-sky-800 tracking-tight uppercase">
            GOVERNMENT LOTTERY
          </span>
          <span className="text-[11px] sm:text-xs font-black text-sky-600 tracking-wider uppercase font-sans">
            OFFICER
          </span>
        </div>
      </div>
    );
  };

  if (variant === 'badge-only') {
    return <LogoEmblem size="md" />;
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
        <LogoEmblem size="sm" />
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 font-black text-sm sm:text-base leading-none">
            <span className="text-white">GOVERNMENT</span>
            <span className="text-amber-300">LOTTERY</span>
            <span className="text-[10px] text-sky-200 font-extrabold ml-1 px-1.5 py-0.5 bg-sky-900/80 rounded border border-sky-400">
              OFFICER
            </span>
          </div>
          <span className="text-[10px] font-extrabold text-sky-200 mt-0.5 tracking-wider uppercase">
            {subText}
          </span>
        </div>
      </div>
    );
  }

  // Full Hero Heading Banner in Sky Blue theme with real Logo
  return (
    <div
      className={`w-full relative overflow-hidden rounded-3xl shadow-2xl border-2 border-sky-400/50 bg-gradient-to-r from-[#032242] via-[#094d82] to-[#032242] text-white ${className}`}
    >
      {/* Background radial sky-blue luxury glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400/25 via-sky-600/10 to-transparent pointer-events-none" />
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-sky-300/25 rounded-full blur-2xl pointer-events-none" />

      {/* Main Banner Content Container */}
      <div className="px-3 sm:px-6 pt-4 sm:pt-5 pb-5 sm:pb-6 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Left Side: Real Logo + Titles */}
        <div className="flex items-center gap-3 sm:gap-4">
          <LogoEmblem size="lg" />

          {/* Center Branding Elements */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            {/* Top Main Line: THE GOVERNMENT LOTTERY */}
            <div className="flex flex-col items-center sm:items-start leading-none">
              <span className="text-xs sm:text-sm font-extrabold text-sky-200 uppercase tracking-[0.25em] drop-shadow-sm mb-1">
                THE OFFICIAL
              </span>
              <div className="flex flex-wrap items-baseline justify-center sm:justify-start gap-1.5 sm:gap-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-sans uppercase">
                  GOVERNMENT
                </h1>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-300 tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-sans uppercase">
                  LOTTERY
                </h1>
              </div>
            </div>

            {/* Sub-headline: OFFICER with Gold Star Dividers */}
            <div className="flex items-center gap-2 my-1">
              <div className="w-6 sm:w-12 h-[2px] bg-gradient-to-r from-transparent to-amber-400" />
              <span className="text-amber-300 text-xs sm:text-sm">★</span>
              <span className="text-xs sm:text-sm md:text-base font-black text-amber-300 tracking-[0.25em] uppercase font-sans drop-shadow-xs">
                OFFICER
              </span>
              <span className="text-amber-300 text-xs sm:text-sm">★</span>
              <div className="w-6 sm:w-12 h-[2px] bg-gradient-to-l from-transparent to-amber-400" />
            </div>

            {/* Ribbon Badge: WEEKLY RESULT */}
            <div className="mt-1">
              <div className="relative inline-flex items-center justify-center px-4 sm:px-6 py-1 bg-gradient-to-r from-sky-950 via-sky-600 to-sky-950 rounded-lg shadow-md border border-sky-300/40">
                <span className="text-xs sm:text-sm font-black text-white tracking-[0.2em] uppercase font-sans drop-shadow">
                  {subText}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Official Officer Thailand Badge */}
        {showPartnerBadge && (
          <div className="flex items-center justify-center sm:justify-end mt-1 sm:mt-0">
            <OfficialOfficeBadge />
          </div>
        )}
      </div>

      {/* Golden Arched Bottom Trim */}
      <div className="w-full h-2.5 sm:h-3 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500 shadow-inner" />
    </div>
  );
};

// Aliases for seamless backward compatibility across the app
export const Mega3UpHeader = GovernmentLotteryHeader;
export const GloHeader = GovernmentLotteryHeader;
