import { Link, useNavigate } from 'react-router-dom';
import { BaseLayout } from '../Components/layout/BaseLayout';
import { useShop, CartItem } from '../context/ShopContext';
import { Minus, Plus } from 'lucide-react';

export function CartPage() {
    const { cart, removeFromCart, updateQuantity } = useShop();
    const navigate = useNavigate();

    const subtotal = cart.reduce((sum: number, item: CartItem) => {
        const priceValue = parseFloat(item.price);
        return sum + (priceValue * item.quantity);
    }, 0);

    const handleCheckout = () => {
        navigate('/checkout');
    };

    return (
        <BaseLayout>
            <div className="bg-white min-h-screen">
                <div className="max-w-7xl mx-auto px-4 md:px-[121px] py-12 md:py-20">
                    <div className="flex justify-between items-center mb-12">
                        <h1 className="text-[36px] font-normal text-[#141E03]">Your cart</h1>
                        <Link to="/shop" className="text-[16px] text-[#141E03] hover:underline">
                            Continue shopping
                        </Link>
                    </div>

                    {cart.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="text-xl text-gray-500 mb-8">Your cart is currently empty.</p>
                            <Link to="/shop" className="inline-block bg-[#141E03] text-white px-8 py-3 rounded-lg">
                                Return to Shop
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8">
                            {/* Cart Items List */}
                            <div className="flex flex-col border-t border-b border-gray-100 py-8 gap-10">
                                {cart.map((item) => (
                                    <div key={`${item.id}-${item.size}-${item.color}`} className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                                        <div className="w-[142px] h-[99px] bg-[#EAEFE1] rounded-[19px] overflow-hidden flex items-center justify-center">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-16 h-20 bg-[#1a1a1a] rounded-t-lg shadow-lg relative translate-y-2">
                                                    <div className="absolute top-4 right-4 text-[#89D618] font-black text-[6px]">GWOTE</div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 flex flex-col gap-2">
                                            <h3 className="text-[20px] font-normal text-[#141E03]">{item.name}</h3>
                                            <div className="flex gap-4 text-[14px]">
                                                <span className="text-[#55534D]">Size: {item.size} / Color: {item.color}</span>
                                                <div className="flex gap-4">
                                                    <button
                                                        onClick={() => navigate(`/shop/${item.id}`, {
                                                            state: {
                                                                editItem: true,
                                                                originalSize: item.size,
                                                                originalColor: item.color,
                                                                quantity: item.quantity
                                                            }
                                                        })}
                                                        className="text-[#141E03] hover:underline"
                                                    >
                                                        Edit details
                                                    </button>
                                                    <button
                                                        onClick={() => removeFromCart(item.id, item.size, item.color)}
                                                        className="text-[#141E03] hover:underline"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-12">
                                            <div className="w-[115px] h-[50px] border border-[#55534D] rounded-[7px] flex items-center justify-between px-3">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                                                    className="text-[#55534D]"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="text-[16px] font-medium text-black">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                                                    className="text-black"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>

                                            <div className="text-[24px] font-bold text-[#55534D] w-[120px] text-right">
                                                ₦ {item?.price?.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Summary Section */}
                            <div className="bg-[#F8F8F8] p-8 md:p-12 rounded-[19px] mt-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-[32px] md:text-[40px] font-normal text-[#141E03]">Subtotal</h2>
                                    <span className="text-[24px] font-bold text-[#55534D]">₦ {subtotal.toLocaleString()}</span>
                                </div>
                                <p className="text-[13px] text-[#55534D] mb-10">
                                    Taxes, discounts and shipping calculated at checkout.
                                </p>

                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={handleCheckout}
                                        className="w-full h-[55px] bg-[#141E03] text-white text-[16px] rounded-[8px] hover:bg-black transition-colors"
                                    >
                                        Checkout
                                    </button>
                                    <Link
                                        to="/shop"
                                        className="w-full h-[55px] border border-[#55534D] text-[#141E03] text-[16px] flex items-center justify-center rounded-[8px] hover:bg-gray-50 transition-colors"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </BaseLayout>
    );
}

export default CartPage;
