import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { BaseLayout } from '../Components/layout/BaseLayout';
import { ProductGrid, Product as ProductType } from '@/Components/Shop/product-grid';
import { ShopFeatures } from '@/Components/Shop/shop-features';
import { ChevronRight, Share2, Minus, Plus } from 'lucide-react';
import Cart from '@/assets/cart.png'
import { useShop } from '@/context/ShopContext';
import { client, urlFor } from '@/sanity/lib/client';
import { ActivityIndicator } from '@/Components/ui/ActivityIndicator';
import toast from 'react-hot-toast';

export const ProductDetailPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const editState = location.state as { editItem?: boolean, originalSize?: string, originalColor?: string, quantity?: number } | null;

    const { cart, addToCart, removeFromCart, addToRecentlyViewed, recentlyViewed } = useShop();

    const [product, setProduct] = useState<(ProductType & { sizes?: string[], colors?: { name: string, hex: string }[] }) | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState(editState?.originalSize || 'M');
    const [selectedColor, setSelectedColor] = useState<{ name: string, hex: string } | null>(null);
    const [quantity, setQuantity] = useState(editState?.quantity || 1);
    const [activeImage, setActiveImage] = useState(0);
    const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                // Fetch by slug or ID
                const query = `*[_type == "product" && (slug.current == $id || _id == $id)][0]{
                    ...,
                    "sizes": sizes,
                    "colors": colors
                }`;
                const data = await client.fetch(query, { id: productId });

                if (data) {
                    setProduct(data);

                    // Only set defaults if not in edit mode or if defaults are missing in state
                    if (!editState?.originalSize && data.sizes && data.sizes.length > 0) {
                        setSelectedSize(data.sizes[0]);
                    }

                    if (data.colors && data.colors.length > 0) {
                        if (editState?.originalColor) {
                            const foundColor = data.colors.find((c: any) => c.name === editState.originalColor);
                            setSelectedColor(foundColor || data.colors[0]);
                        } else {
                            setSelectedColor(data.colors[0]);
                        }
                    }

                    // Add to recently viewed
                    addToRecentlyViewed({
                        id: data._id,
                        name: data.name,
                        price: data.price,
                        image: data.images && data.images[0] ? urlFor(data.images[0]).url() : undefined
                    });

                    // Fetch related/trending products
                    const relatedQuery = `*[_type == "product" && _id != $currentId][0...8]`;
                    const relatedData = await client.fetch(relatedQuery, { currentId: data._id });
                    setRelatedProducts(relatedData);
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleAddToCart = () => {
        if (!product) return;

        // If in edit mode, remove the original item first
        if (editState?.editItem && editState.originalSize && editState.originalColor) {
            removeFromCart(product._id, editState.originalSize, editState.originalColor);
        }

        addToCart({
            id: product._id,
            name: product.name,
            price: product.price.toString(),
            size: selectedSize,
            color: selectedColor?.name || 'Default',
            quantity: quantity,
            image: product.images && product.images[0] ? urlFor(product.images[0]).url() : undefined
        });

        if (editState?.editItem) {
            toast.success(`${product.name} updated in cart!`);
            navigate('/cart');
        } else {
            toast.success(`${product.name} added to cart!`);
        }
    };

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            toast.success('Link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            toast.error('Failed to copy link');
        });
    };

    if (loading) {
        return (
            <BaseLayout>
                <div className="min-h-[70vh] flex items-center justify-center">
                    <ActivityIndicator message="Loading product details..." />
                </div>
            </BaseLayout>
        );
    }

    if (!product) {
        return (
            <BaseLayout>
                <div className="min-h-screen flex flex-col items-center justify-center">
                    <h1 className="text-2xl mb-4">Product not found</h1>
                    <Link to="/shop" className="text-[#141E03] underline">Return to shop</Link>
                </div>
            </BaseLayout>
        );
    }

    return (
        <BaseLayout>
            <div className="flex flex-col bg-white overflow-x-hidden pt-6">
                <div>
                    {/* Breadcrumbs */}
                    <div className="px-4 md:px-[121px] flex flex-row justify-between items-center mb-8  w-full">
                        <div className="flex items-center gap-2 text-[16px] font-normal leading-[19px] text-[#141E03]">
                            <Link to="/shop" className="hover:underline">Shop</Link>
                            <ChevronRight size={18} />
                            <span className="font-normal">{product.name}</span>
                        </div>
                        <Link to="/cart" className="relative w-[64px] h-[64px] bg-[#EAEFE1] rounded-full flex items-center justify-center transition-transform hover:scale-105">
                            <img src={Cart} alt="Cart" className="w-6 h-6" />
                            <div className="absolute top-[-5px] right-[5px] w-[20px] h-[20px] bg-[#89D618] rounded-full flex items-center justify-center text-[12px] font-medium text-[#141E03]">
                                {cart.reduce((sum, item) => sum + item.quantity, 0)}
                            </div>
                        </Link>
                    </div>
                </div>


                {/* Main Product Section */}
                <section className="px-4 mx-auto md:px-[121px] pb-24 grid grid-cols-1 lg:grid-cols-[auto_1fr] md:gap-x-[49px] relative items-start">
                    {/* Left Side: Images */}
                    <div className="flex flex-col-reverse md:flex-row gap-2 md:gap-4">
                        {/* Thumbnails */}
                        <div className="flex justify-center items-center md:justify-start md:items-start md:flex-col gap-[15px]">
                            {product.images?.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImage(i)}
                                    className={`w-[88px] h-[108px] bg-[#EAEFE1] rounded-[9px] border box-border transition-colors flex items-center justify-center overflow-hidden
                    ${activeImage === i ? 'border-[#141E03]' : 'border-transparent'}`}
                                >
                                    <img src={urlFor(img).url()} alt={`Thumbnail ${i}`} className="w-full h-full object-contain" />
                                </button>
                            )) || (
                                    <div className="w-[88px] h-[108px] bg-[#EAEFE1] rounded-[9px] border border-transparent flex items-center justify-center">
                                        <div className="w-12 h-16 bg-[#141E03]/10 rounded-sm"></div>
                                    </div>
                                )}
                        </div>

                        {/* Main Product Image */}
                        <div className="w-full md:w-[445px] border border-[#EAEFE1] h-[548px] bg-[#EAEFE1] rounded-[13px] flex items-center justify-center relative overflow-hidden group p-4">
                            {product.images && product.images[activeImage] ? (
                                <img
                                    src={urlFor(product.images[activeImage]).url()}
                                    alt={product.name}
                                    className="w-full h-full object-contain"
                                />
                            ) : <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No image
                            </div>}

                        </div>
                    </div>

                    {/* Right Side: Product Info */}
                    <div className="flex flex-col lg:pl-[49px] mt-8 lg:mt-0">
                        <h1 className="text-[34px] font-medium leading-[40px] text-[#141E03] mb-[7px]">
                            {product.name}
                        </h1>
                        <p className="text-[24px] font-bold leading-[28px] text-[#55534D] mb-[21px]">
                            ₦{product.price}
                        </p>

                        {product.description && (
                            <p className="text-[16px] font-normal leading-relaxed text-[#55534D] mb-[26px] max-w-[500px]">
                                {product.description}
                            </p>
                        )}

                        {/* Colour Selector */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="mb-[15px]">
                                <h3 className="text-[16px] font-medium leading-[19px] text-[#141E03] mb-[10px]">Colour</h3>
                                <div className="flex flex-row items-center gap-[10px]">
                                    {product.colors.map((color) => (
                                        <div key={color.name} className="flex items-center gap-[5px]">
                                            <button
                                                onClick={() => setSelectedColor(color)}
                                                className={`w-[26px] h-[26px] rounded-full border transition-all ${selectedColor?.name === color.name ? 'border-[#141E03] ring-1 ring-[#141E03] ring-offset-2' : 'border-gray-300 hover:border-gray-400'}`}
                                                style={{ backgroundColor: color.hex }}
                                            />
                                            <span className={`text-[16px] leading-[19px] ${selectedColor?.name === color.name ? 'font-bold text-[#141E03]' : 'font-medium text-[#55534D]'}`}>{color.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selector */}
                        <div className="mb-[26px]">
                            <h3 className="text-[16px] font-medium leading-[19px] text-[#141E03] mb-[12px]">Size</h3>
                            <div className="flex flex-wrap gap-[9px]">
                                {product.sizes?.map((size: string) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`h-[34px] min-w-[34px] px-3 flex items-center justify-center rounded-[7px] border box-border text-[16px] font-normal leading-[19px] transition-all
                                        ${selectedSize === size
                                                ? 'border-[#141E03] bg-[#141E03] text-white'
                                                : 'border-[#EAEFE1] text-[#55534D]'}`}
                                    >
                                        {size}
                                    </button>
                                )) || ['S', 'M', 'L', 'XL'].map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`h-[34px] min-w-[34px] px-3 flex items-center justify-center rounded-[7px] border box-border text-[16px] font-normal leading-[19px] transition-all
                                        ${selectedSize === size
                                                ? 'border-[#141E03] text-[#141E03] bg-gray-50'
                                                : 'border-[#EAEFE1] text-[#55534D]'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity and Cart */}
                        <div className="flex flex-wrap items-center gap-[15px] mb-[29px]">
                            <div className="w-[152px] h-[50px] border border-[#141E03] rounded-[7px] flex items-center justify-between px-[11px] box-border">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-[#55534D] p-2 hover:text-[#141E03] transition-colors"><Minus size={16} /></button>
                                <span className="text-[16px] font-medium leading-[19px] text-[#141E03]">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="text-[#141E03] p-2 hover:opacity-70 transition-opacity"><Plus size={16} /></button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="w-full md:w-[232px] h-[50px] bg-[#141E03] text-white text-[14px] font-normal leading-[16px] rounded-[7px] hover:bg-[#141E03]/90 transition-colors flex items-center justify-center shadow-sm"
                            >
                                {editState?.editItem ? 'Update Cart' : 'Add to Cart'}
                            </button>
                        </div>

                        {/* Wishlist and Share */}
                        <div className="flex flex-wrap gap-[19px]">
                            <button
                                onClick={handleShare}
                                className="w-[110px] h-[62px] border border-[#141E03] rounded-[8px] flex items-center justify-center hover:bg-gray-50 transition-colors gap-[6px]"
                            >
                                <Share2 size={24} className="text-[#141E03]" />
                                <span className="text-[14px] font-normal text-[#141E03]">Share</span>
                            </button>
                        </div>
                    </div>
                </section>


                <ProductGrid
                    title={["Customers also viewed"]}
                    titleUnderline={false}
                    products={relatedProducts}
                />

                {/* Recently Viewed */}
                <div className="mb-16 lg:mb-20">
                    {recentlyViewed.length > 1 && (
                        <ProductGrid
                            title={["Recently Viewed"]}
                            titleUnderline={false}
                            products={recentlyViewed.filter(p => p.id !== product._id).map(p => ({
                                _id: p.id as string,
                                name: p.name,
                                price: p.price,
                                slug: { current: p.id as string }, // Fallback
                                images: p.image ? [p.image] : []
                            })) as any}
                        />
                    )}
                </div>

                {/* Shop Features */}
                <ShopFeatures />
            </div>
        </BaseLayout >
    );
};

export default ProductDetailPage;
