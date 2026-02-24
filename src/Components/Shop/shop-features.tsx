import React from 'react';
import Security from "@/assets/security.png"
import Boat from "@/assets/boat.png"
import Chat from "@/assets/chat-black.png"
import Basket from "@/assets/basket.png"

const features = [
  {
    icon: <img src={Security} alt="" width={34} height={34} />,
    title: "Secured Payment",
    description: "Enjoy peace of mind with our secured payment options"
  },
  {
    icon: <img src={Boat} alt="" width={34} height={34} />,
    title: "Shipping",
    description: "Get your order fast with our speedy shipping options"
  },
  {
    icon: <img src={Chat} alt="" width={34} height={34} />,
    title: "Live Chat",
    description: "Need help? Our live chat is here for instant support"
  },
  {
    icon: <img src={Basket} alt="" width={34} height={34} />,
    title: "Checkout",
    description: "Easy checkout - complete your order in seconds"
  }
];

export const ShopFeatures: React.FC = () => {
  return (
    <section className="py-24 px-4 md:px-[146px] bg-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-[35px]">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center max-w-[254px] mx-auto">
            <div className="text-[#141E03] mb-[35px]">
              {feature.icon}
            </div>
            <div className="flex flex-col gap-[15px]">
              <h3 className="text-[24px] font-medium text-[#141E03]">
                {feature.title}
              </h3>
              <p className="text-[18px] font-medium text-[#6F706F] leading-[21px]">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
