import { useState, useEffect } from 'react';
import { BaseLayout } from '../Components/layout/BaseLayout';
import { client, urlFor } from '@/sanity/lib/client';
import { Product as ProductType } from '@/Components/Shop/product-grid';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ActivityIndicator } from '@/Components/ui/ActivityIndicator';

export function AllProductsPage() {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showFilters, setShowFilters] = useState(false);

    const categories = ['All', 't-shirt', 'cap', 'tote-bag'];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const query = `*[_type == "product"] | order(_createdAt desc)`;
                const data = await client.fetch(query);
                setProducts(data);
                setFilteredProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        let result = products;

        if (searchQuery) {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        if (selectedCategory !== 'All') {
            result = result.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
        }

        setFilteredProducts(result);
    }, [searchQuery, selectedCategory, products]);

    return (
        <BaseLayout>
            <div className="min-h-screen bg-white py-12 px-4 md:px-[121px]">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-[36px] font-normal text-[#141E03] mb-8">All Products</h1>

                    {/* Filters & Search */}
                    <div className="flex flex-col md:flex-row gap-4 mb-12 items-center justify-between">
                        <div className="relative w-full md:w-[400px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#707070]" size={20} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-[50px] border border-[#DEDEDE] rounded-[8px] pl-12 pr-4 text-[16px] focus:outline-none focus:border-[#141E03]"
                            />
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 border border-[#DEDEDE] rounded-[8px] px-6 h-[50px] text-[16px] hover:bg-gray-50 transition-colors"
                            >
                                <SlidersHorizontal size={20} />
                                Filters
                                {selectedCategory !== 'All' && (
                                    <span className="bg-[#141E03] text-white text-[12px] rounded-full w-5 h-5 flex items-center justify-center">
                                        1
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Filter Modal/Dropdown (Simplified) */}
                    {showFilters && (
                        <div className="bg-[#F8F8F8] p-6 rounded-[12px] mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-medium">Category</h3>
                                <button onClick={() => setShowFilters(false)}><X size={20} /></button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-4 py-2 rounded-full text-[14px] transition-colors
                                            ${selectedCategory === cat
                                                ? 'bg-[#141E03] text-white'
                                                : 'bg-white text-[#141E03] border border-[#DEDEDE] hover:border-[#141E03]'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <ActivityIndicator message="Loading products..." />
                    ) : filteredProducts.length === 0 ? (
                        <div className="py-20 text-center flex flex-col items-center">
                            <p className="text-[#707070] text-lg mb-4">No products found matching your criteria.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                                className="text-[#141E03] underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                            {filteredProducts.map((product) => (
                                <Link to={`/shop/${product.slug?.current || product._id}`} key={product._id} className="flex flex-col group">
                                    <div className="bg-[#EAEFE1] border border-[#EAEFE1] h-[332px] rounded-[10px] mb-4 relative overflow-hidden">
                                        {product.images && product.images[0] ? (
                                            <img
                                                src={urlFor(product.images[0]).url()}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.1]"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                No image
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-[16px] font-normal text-[#141E03] mb-2 group-hover:underline">{product.name}</h3>
                                    <p className="text-[18px] font-bold text-[#141E03]">{product.price}</p>
                                    {product.category && (
                                        <span className="text-[12px] text-[#707070] mt-1 capitalize">{product.category}</span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </BaseLayout>
    );
}
