import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textColor?: string;
  customText?: string;
}

export default function Logo({ className = "", size = 40, showText = false, textColor = "text-primary", customText }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Network Pattern */}
        <g opacity="0.4">
          <circle cx="20" cy="30" r="1.5" fill="currentColor" className="text-accent" />
          <circle cx="35" cy="25" r="1.5" fill="currentColor" className="text-accent" />
          <circle cx="25" cy="45" r="1.5" fill="currentColor" className="text-accent" />
          <circle cx="40" cy="50" r="1.5" fill="currentColor" className="text-accent" />
          <circle cx="30" cy="65" r="1.5" fill="currentColor" className="text-accent" />
          <circle cx="15" cy="60" r="1.5" fill="currentColor" className="text-accent" />
          
          <line x1="20" y1="30" x2="35" y2="25" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
          <line x1="20" y1="30" x2="25" y2="45" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
          <line x1="35" y1="25" x2="25" y2="45" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
          <line x1="25" y1="45" x2="40" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
          <line x1="40" y1="50" x2="30" y2="65" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
          <line x1="30" y1="65" x2="15" y2="60" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
          <line x1="15" y1="60" x2="25" y2="45" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
        </g>

        {/* The "S" Shape */}
        <path
          d="M75 25H45C40 25 38 28 38 32C38 36 40 39 45 39H65C75 39 80 45 80 55C80 65 75 75 60 75H35"
          stroke="url(#logo-gradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        <defs>
          <linearGradient id="logo-gradient" x1="35" y1="25" x2="80" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="white" />
            <stop offset="0.6" stopColor="white" />
            <stop offset="1" stopColor="#F27D26" />
          </linearGradient>
        </defs>
      </svg>
      
      {showText && (
        <span className={`font-display font-bold text-xl tracking-tight ${textColor}`}>
          {customText ? (
            customText
          ) : (
            <>Skil<span className="text-accent">labs</span></>
          )}
        </span>
      )}
    </div>
  );
}
