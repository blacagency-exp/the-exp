import React from 'react';

export const Newsletter: React.FC = () => {
  return (
    <section className="py-24 min-h-[50vh] bg-[#F8F8F8] flex flex-col items-center justify-center text-center">
      <h2 className="text-[32px] md:text-[48px] font-normal text-[#141E03] mb-4 px-4">
        Be First. Never Follow.
      </h2>
      <p className="text-[16px] md:text-[20px] font-medium text-[#6F706F] mb-12 px-4">
        Access the latest drops and insider exclusives.
      </p>

      <div className="flex w-[90%] md:w-full max-w-[481px] mx-auto bg-white rounded-[20px] p-2 items-center shadow-sm">
        <input
          type="email"
          placeholder="email@example.com"
          className="max-w-[calc(100%-120px)] md:max-w-[calc(100%-158px)] px-4 md:px-6 py-4 bg-transparent outline-none text-[16px] md:text-[20px] font-medium text-[#6F706F]"
        />
        <button
          className="bg-[#141E03] hover:bg-[#2a3a0d] text-[#EAEFE1] px-4 md:px-8 py-2 md:py-4 h-[45px] md:h-[57px] rounded-[8px] text-[16px] md:text-[20px] font-normal"
        >
          Subscribe
        </button>
      </div>
    </section>
  );
};
