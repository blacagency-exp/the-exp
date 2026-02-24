import React from 'react';
import ShopHeroImage from "@/assets/shop-hero.png";

export const ShopHero: React.FC = () => {
  return (
    <section className="relative w-full h-[calc(100vh-64px)] lg:h-[calc(100vh-80px)] bg-[#141E03] flex flex-col items-center justify-end text-white">
      <div className="absolute inset-0 z-0 opacity-80">
        <img src={ShopHeroImage} alt="Shop Hero" className="w-full h-full object-cover" />
      </div>
      <div className="relative z-10 text-center mb-12 lg:mb-20">
        <h1 className="text-[48px] font-normal leading-[56px] mb-8">
          New Arrivals
        </h1>
        <button
          onClick={() => document.getElementById('shop-now')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-[#89D618] hover:bg-[#78bc15] text-[#141E03] px-10 py-3 rounded-lg text-[15px] font-normal"
        >
          SHOP NOW
        </button>
      </div>
    </section>
  );
};
