import React from 'react';

interface BelhomzLogoProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export const BelhomzLogo: React.FC<BelhomzLogoProps> = ({ 
  className = '', 
  width = '100%', 
  height = '100%' 
}) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 240 60" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Elegant Geometric Icon */}
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {/* Main Roof Peak */}
        <path d="M12 40 L28 16 L44 40" />
        {/* Subtle Door/Pillar Element */}
        <path d="M28 26 L28 48" strokeWidth="1.5" />
        <path d="M36 48 L36 32 L48 32 L48 48" strokeWidth="1.5" />
        {/* Luxury Gold/Accent Dot (can be styled via CSS if needed) */}
        <circle cx="28" cy="10" r="2" fill="currentColor" stroke="none" />
      </g>
      
      {/* Sophisticated Typography */}
      <text 
        x="65" 
        y="42" 
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
        fontSize="32" 
        fill="currentColor"
        letterSpacing="0.5"
        className=''
      >
        <tspan fontWeight="300">Bel</tspan><tspan fontWeight="700" className='text-primary'>Homz</tspan>
      </text>
    </svg>
  );
};

export default BelhomzLogo;