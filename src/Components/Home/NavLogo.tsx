import React from 'react';

export const NavLogo: React.FC = () => {
  return (
    <a href="/" className="flex items-center gap-2">
      <div className="relative h-6 w-6 sm:h-8 sm:w-8">
        <img
          src="/placeholder.svg"
          alt="Experience Plateau Logo" 
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex flex-col sm:flex-row sm:gap-1">
        <span className="text-xs sm:text-sm font-medium leading-none">Experience</span>
        <span className="text-xs sm:text-sm font-medium leading-none">Plateau</span>
      </div>
    </a>
  );
};

