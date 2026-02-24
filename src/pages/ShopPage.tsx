import { useEffect, useState } from "react";
import { BaseLayout } from "../Components/layout/BaseLayout";
import { ShopHero } from "@/Components/Shop/shop-hero";
import { ProductGrid, Product } from "@/Components/Shop/product-grid";
import { Newsletter } from "@/Components/Shop/newsletter";
import { ShopFeatures } from "@/Components/Shop/shop-features";
import { ActivityIndicator } from "@/Components/ui/ActivityIndicator";
import ShopNow1Image from "@/assets/shop-now-1.png";
import ShopNow2Image from "@/assets/shop-now-2.png";
import { client } from "@/sanity/lib/client";

export function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = `*[_type == "product"] | order(_createdAt desc)`;
        const data = await client.fetch(query);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const newArrivals = products.slice(0, 4);

  return (
    <BaseLayout>
      <div className="flex flex-col">
        {/* Hero Section */}
        <ShopHero />

        {loading ? (
          <ActivityIndicator message="Loading products..." />
        ) : (
          <div id='shop-now'>
            {/* New Arrivals Section */}
            <ProductGrid
              title={["New Arrivals"]}
              products={newArrivals}
            />

            {/* Categories Section */}
            <ProductGrid
              title={["t-shirt", "cap", "tote-bag"]}
              products={products}
            />
          </div>
        )}

        <section className="flex flex-col md:flex-row w-full bg-[#141E03] mt-16 lg:mt-20">
          <div onClick={() => document.getElementById('shop-now')?.scrollIntoView({ behavior: 'smooth' })} className="flex-1 flex flex-col items-center h-full justify-end relative cursor-pointer max-h-[85vh] overflow-hidden">
            <img src={ShopNow1Image} alt="Shop Now" className="w_full h-full object-cover" />
            <h3 className="text-[32px] text-white font-normal absolute bottom-8">Shop Now</h3>
          </div>
          <div onClick={() => document.getElementById('shop-now')?.scrollIntoView({ behavior: 'smooth' })} className="flex-1 flex flex-col items-center h-full justify-end relative cursor-pointer max-h-[85vh] overflow-hidden">
            <img src={ShopNow2Image} alt="Shop Now" className="w-full h-full object-cover" />
            <h3 className="text-[32px] text-white font-normal absolute bottom-8">Shop Now</h3>
          </div>
        </section>

        {/* Newsletter Section */}
        <Newsletter />

        {/* Features Section */}
        <ShopFeatures />
      </div>
    </BaseLayout>
  );
}

export default ShopPage;
