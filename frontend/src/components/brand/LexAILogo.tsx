import React from 'react';
import { LEXAI_LOGO_URL } from '../../constants/brand';
import { Scale } from 'lucide-react';

export interface LexAILogoProps {
  className?: string;
  imgClassName?: string;
  fallbackIconSize?: string;
  alt?: string;
}

export const LexAILogo: React.FC<LexAILogoProps> = ({
  className = 'w-8 h-8 rounded-xl',
  imgClassName = '',
  fallbackIconSize = 'w-4 h-4',
  alt = 'LexAI India Logo',
}) => {
  return (
    <div
      className={`relative overflow-hidden border border-[#A855F7]/30 shadow-md shadow-purple-950/40 shrink-0 bg-[#100D18] ${className}`}
    >
      <img
        src={LEXAI_LOGO_URL}
        alt={alt}
        className={`w-full h-full object-cover ${imgClassName}`}
        onError={(e) => {
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#7C3AED] via-[#A855F7] to-[#C084FC] flex items-center justify-center">
        <Scale className={`${fallbackIconSize} text-white`} />
      </div>
    </div>
  );
};

export default LexAILogo;
