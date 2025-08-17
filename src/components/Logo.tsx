import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <svg 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Nafs Hub Logo"
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22d3ee" />
          <stop offset="1" stopColor="#d946ef" />
        </linearGradient>
      </defs>
      <path 
        d="M32 58C46.3594 58 58 46.3594 58 32C58 17.6406 46.3594 6 32 6C17.6406 6 6 17.6406 6 32C6 46.3594 17.6406 58 32 58Z" 
        stroke="url(#logo-gradient)" 
        strokeWidth="3" 
        strokeMiterlimit="10" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M26 23C26 23 29 17 35 21C41 25 38 34 32.5 37C27 40 24 35 24 35M24 35C24 35 23 31 29 29C35 27 38 31 38 31M24 35C24 35 20 42 27 45C34 48 38 41 38 41" 
        stroke="url(#logo-gradient)" 
        strokeWidth="3" 
        strokeMiterlimit="10" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};
