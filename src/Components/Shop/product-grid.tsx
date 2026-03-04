import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { urlFor } from '../../sanity/lib/client';

export interface Product {
  _id: string;
  name: string;
  price: string;
  slug: { current: string };
  images?: any[];
  category?: string;
  description?: string;
}

interface ProductGridProps {
  title: string[];
  products: Product[];
  titleUnderline?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ title, products, titleUnderline = true }) => {
  const [selectedCategory, setSelectedCategory] = useState(title[0]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Filter products if there are multiple titles (categories)
  const filteredProducts = title.length > 1
    ? products.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase())
    : products;

  return (
    <section className="py-16 lg:py-20 px-4 md:px-10 max-w-7xl w-full mx-auto">
      <div className="flex gap-5 flex-wrap justify-between items-end mb-8">
        <div className="flex gap-8 text-[24px] font-medium">
          {title.map((item) => (
            <button key={item} onClick={() => setSelectedCategory(item)} className={`${selectedCategory === item ? `text-[#141E03] decoration-2 underline-offset-8 ${titleUnderline ? "underline" : ""}` : "text-[#6F706F]"} capitalize`}><h2>{item}</h2></button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-[35px] h-[35px] flex items-center justify-center border border-[#6F706F] rounded-full bg-white hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={20} className="text-[#6F706F]" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-[35px] h-[35px] flex items-center justify-center border border-[#6F706F] rounded-full bg-white hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={20} className="text-[#6F706F]" />
            </button>
          </div>
          <button
            onClick={() => navigate('/shop/all')}
            className="border border-[#6F706F] rounded-[5px] px-4 h-[35px] text-[15px] text-[#141E03] hover:bg-gray-50 transition-colors"
          >
            View All
          </button>
        </div>
      </div>

      <div className='overflow-hidden w-full'>
        <div
          ref={scrollRef}
          className="w-full grid grid-flow-col auto-cols-[280px] gap-6 overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory hide-scrollbar"
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Link to={`/shop/${product.slug?.current || product._id}`} key={product._id} className="snap-start flex flex-col w-full group">
                <div
                  className="h-[332px] border border-[#EAEFE1] bg-[#EAEFE1] flex justify-center items-center rounded-[10px] mb-4 p-4 relative overflow-hidden">
                  {product.images && product.images[0] ? (
                    <>
                      <img
                        src={urlFor(product.images[0]).url()}
                        alt={product.name}
                        className={`w-full h-full rounded-[10px] object-contain transition-all duration-500 
                          ${product.images.length > 1 ? 'group-hover:opacity-0 group-hover:scale-105' : 'group-hover:scale-110'}`}
                      />
                      {product.images[1] && (
                        <img
                          src={urlFor(product.images[1]).url()}
                          alt={`${product.name} - variant`}
                          className="absolute inset-4 w-[calc(100%-32px)] h-[calc(100%-32px)] rounded-[10px] object-contain opacity-0 group-hover:opacity-100 transition-all duration-500 scale-105"
                        />
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <h3 className="text-[16px] font-normal text-[#141E03] mb-2 group-hover:underline">{product.name}</h3>
                <p className="text-[18px] font-bold text-[#141E03]">₦{product.price}</p>
              </Link>
            ))
          ) : (
            <div className="snap-start flex flex-col w-full h-[400px] items-center justify-center text-gray-500 italic">
              No products found in this category
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
