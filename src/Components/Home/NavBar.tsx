import React from 'react';
import { NavLogo } from './NavLogo';

export const NavBar: React.FC = () => {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          <div className="hidden md:flex md:items-center md:space-x-4 lg:space-x-8">
            <a href="/virtual-tour" className="text-xs sm:text-sm font-medium text-gray-900 hover:text-gray-600">
              Virtual Tour
            </a>
            <a href="/blogs" className="text-xs sm:text-sm font-medium text-gray-900 hover:text-gray-600">
              Blogs
            </a>
            <a href="/investments" className="text-xs sm:text-sm font-medium text-gray-900 hover:text-gray-600">
              Investments
            </a>
          </div>
          <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
            <NavLogo />
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4 lg:space-x-8">
            <a href="/travel-bookings" className="text-xs sm:text-sm font-medium text-gray-900 hover:text-gray-600">
              Travel bookings
            </a>
            <a href="/tour-guides" className="text-xs sm:text-sm font-medium text-gray-900 hover:text-gray-600">
              Tour Guides
            </a>
          </div>
          <button className="md:hidden text-gray-900 focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

