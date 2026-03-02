import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { BaseLayout } from '@/Components/layout/BaseLayout';
import { API_URL } from '@/config/api';
import { ActivityIndicator } from '@/Components/ui/ActivityIndicator';
import toast from 'react-hot-toast';


const NIGERIAN_STATES = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Rivers", "Sokoto", "Plateau", "Taraba", "Yobe", "Zamfara"
].sort();

export function CheckoutPage() {
    const { cart } = useShop();
    const [loading, setLoading] = useState(false);

    // User contact state
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [discountCode, setDiscountCode] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [isJos, setIsJos] = useState(false);
    const [deliveryAddress, setDeliveryAddress] = useState('');

    const subtotal = cart.reduce((sum, item) => {
        const priceValue = parseFloat(item.price);
        return sum + (priceValue * item.quantity);
    }, 0);

    // Delivery Price Logic
    let deliveryFee = 0;
    if (selectedState) {
        if (isJos) {
            deliveryFee = 1500;
        } else if (selectedState === "Plateau") {
            deliveryFee = 3000;
        } else {
            deliveryFee = 5000;
        }
    }

    // Discount code validation: 2 letters + 3 numbers (e.g. AB123)
    const isDiscountValid = /^[a-zA-Z]{2}\d{3}$/.test(discountCode);
    const discountAmount = isDiscountValid ? subtotal * 0.1 : 0;
    const total = subtotal - discountAmount + deliveryFee;

    const handlePayNow = async () => {
        if (!email || !firstName || !lastName || !phone || !selectedState || !deliveryAddress) {
            toast.error('Please fill in all contact and delivery information');
            return;
        }

        setLoading(true);

        try {
            // STEP 1: Initialize payment on the backend (Phase A: The Handshake)
            const response = await fetch(`${API_URL}/api/shop/initialize-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    firstName,
                    lastName,
                    phone,
                    items: cart.map(item => ({
                        id: item.id,
                        quantity: item.quantity,
                        size: item.size,
                        color: item.color
                    })),
                    deliveryAddress: `${deliveryAddress}, ${isJos ? 'Jos, ' : ''}${selectedState} State, Nigeria`,
                    selectedState,
                    isJos,
                    deliveryFee,
                    discountCode: discountCode,
                    callbackUrl: `${window.location.origin}/shop/checkout/success`
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to initialize payment');
            }

            // STEP 2: Redirect to Paystack secure checkout
            if (data.data && data.data.authorization_url) {
                window.location.href = data.data.authorization_url;
            } else {
                throw new Error('No payment URL received');
            }

        } catch (error: any) {
            console.error('Checkout error:', error);
            toast.error('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-normal mb-4 text-[#141E03]">Your cart is empty</h1>
                <Link to="/shop" className="text-[#141E03] underline">Return to shop</Link>
            </div>
        );
    }

    return (
        <BaseLayout>

            <div className="min-h-screen bg-white">
                {/* Header */}
                <div className="max-w-[1440px] mx-auto flex flex-col-reverse lg:flex-row min-h-[calc(100vh-88px)]">
                    {/* Left Side - Forms */}
                    <div className="flex-1 px-4 py-8 md:px-[121px] md:py-12 lg:max-w-[850px]">
                        <div className="max-w-[477px] mx-auto lg:ml-0">
                            {/* Contact Section */}
                            <section className="mb-10">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-[20px] text-[#141E03] font-normal">Contact</h2>
                                </div>
                                <div className="relative mb-4">
                                    <input
                                        type="email"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-[48px] border border-black rounded-[5px] px-4 text-[13px] focus:outline-none"
                                        required
                                    />
                                </div>
                                <div className="relative mb-4">
                                    <input
                                        type="tel"
                                        placeholder="Phone number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full h-[48px] border border-black rounded-[5px] px-4 text-[13px] focus:outline-none"
                                        required
                                    />
                                </div>
                                <div className="flex gap-3 mb-4">
                                    <input
                                        type="text"
                                        placeholder="First name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-1/2 h-[48px] border border-[#DEDEDE] rounded-[8px] px-4 text-[13px]"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Last name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-1/2 h-[48px] border border-[#DEDEDE] rounded-[8px] px-4 text-[13px]"
                                        required
                                    />
                                </div>
                            </section>

                            {/* Delivery Section */}
                            <section className="mb-10">
                                <h2 className="text-[20px] text-[#141E03] font-normal mb-4">Delivery Details</h2>
                                <div className="flex flex-col gap-4 mb-4">
                                    <select
                                        value={selectedState}
                                        onChange={(e) => {
                                            setSelectedState(e.target.value);
                                            if (e.target.value !== 'Plateau') setIsJos(false);
                                        }}
                                        className="w-full h-[48px] border border-black rounded-[5px] px-4 text-[13px] focus:outline-none bg-white font-medium"
                                        required
                                    >
                                        <option value="" disabled>Select State</option>
                                        {NIGERIAN_STATES.map(state => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>

                                    {selectedState === 'Plateau' && (
                                        <div className="flex items-center gap-2 p-3 bg-[#f8f8f8] rounded-[5px] border border-gray-200">
                                            <input
                                                type="checkbox"
                                                id="isJos"
                                                checked={isJos}
                                                onChange={(e) => setIsJos(e.target.checked)}
                                                className="w-4 h-4 accent-[#141E03]"
                                            />
                                            <label htmlFor="isJos" className="text-[13px] text-[#141E03] cursor-pointer">
                                                My delivery address is within Jos city
                                            </label>
                                        </div>
                                    )}
                                </div>

                                <div className="relative">
                                    <textarea
                                        placeholder="Street address, Apartment, Suite, etc."
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        className="w-full h-[100px] border border-black rounded-[5px] px-4 py-3 text-[13px] focus:outline-none resize-none"
                                        required
                                    />
                                </div>
                            </section>

                            {/* Payment Message */}
                            <section className="mb-10">
                                <p className="text-[13px] text-[#707070] mb-4">All transactions are secure and encrypted</p>
                                <div className="border border-[#DEDEDE] rounded-t-[8px] p-4 flex items-center gap-3">
                                    <div className="w-[18px] h-[18px] rounded-full bg-[#141E03] flex items-center justify-center">
                                        <div className="w-[8px] h-[8px] rounded-full bg-[#F6F6F6]" />
                                    </div>
                                    <span className="text-[13px] text-[#141E03]">Paystack</span>
                                </div>
                                <div className="border-x border-b border-[#DEDEDE] bg-[#F6F6F6] p-8 text-center">
                                    <p className="text-[14px] text-[#141E03] max-w-[303px] mx-auto">
                                        You’ll be redirected to Paystack to complete your purchase.
                                    </p>
                                </div>
                            </section>

                            <button
                                onClick={handlePayNow}
                                disabled={loading}
                                className={`w-full h-[48px] bg-[#141E03] text-white rounded-[8px] text-[15px] font-normal hover:bg-black transition-all flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <>
                                        <ActivityIndicator size={20} className="py-0" showMessage={false} color="white" />
                                        <span>Initializing Secure Payment...</span>
                                    </>
                                ) : 'Pay now'}
                            </button>
                        </div>
                    </div>

                    {/* Right Side - Summary */}
                    <div className="w-full lg:w-[686px] bg-[#FAFAFA] border-l border-gray-100 px-4 py-8 md:px-[60px] md:py-12">
                        <div className="max-w-[460px] mx-auto lg:ml-0">
                            {/* Cart Items */}
                            <div className="flex flex-col gap-6 mb-8">
                                {cart.map((item) => (
                                    <div key={`${item.id}-${item.size}`} className="flex items-center gap-4">
                                        <div className="relative w-[62px] h-[62px] bg-white rounded-[11px] shadow-sm flex items-center justify-center border border-gray-100">
                                            <div className="w-[58px] h-[58px] bg-[#EAEFE1] rounded-[10px] overflow-hidden flex items-center justify-center">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-8 h-10 bg-[#1a1a1a] rounded-t-sm shadow-sm relative translate-y-2">
                                                        <div className="absolute top-2 right-2 text-[#89D618] font-black text-[3px]">GWOTE</div>
                                                    </div>
                                                )}
                                            </div>
                                            <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#707070] text-white text-[12px] flex items-center justify-center rounded-full">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-[14px] font-medium text-[#141E03]">{item.name}</h3>
                                            <p className="text-[12px] text-[#707070]">{item.size} / {item.color}</p>
                                        </div>
                                        <span className="text-[14px] font-medium text-[#141E03]">
                                            ₦ {item?.price?.toLocaleString()}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Discount Code */}
                            <div className="flex gap-2 mb-8">
                                <input
                                    type="text"
                                    placeholder="Discount code"
                                    value={discountCode}
                                    onChange={(e) => setDiscountCode(e.target.value)}
                                    className={`flex-1 h-[49px] border rounded-[9px] px-4 text-[14px] focus:outline-none transition-colors ${discountCode && !isDiscountValid ? 'border-red-300' : 'border-[#DEDEDE]'}`}
                                />
                                <div className={`w-[80px] h-[49px] rounded-[9px] text-[14px] flex items-center justify-center border ${isDiscountValid ? 'bg-[#EAEFE1] border-[#141E03] text-[#141E03] font-medium' : 'bg-[#F6F6F6] border-[#DEDEDE] text-[#707070]'}`}>
                                    {isDiscountValid ? 'Applied' : 'Apply'}
                                </div>
                            </div>

                            {/* Totals */}
                            <div className="flex flex-col gap-4 text-[14px] text-[#141E03]">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₦{subtotal.toLocaleString()}</span>
                                </div>

                                {deliveryFee > 0 && (
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>₦{deliveryFee.toLocaleString()}</span>
                                    </div>
                                )}

                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-[#89D618]">
                                        <span>Discount (10%)</span>
                                        <span>-₦{discountAmount.toLocaleString()}</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100">
                                    <span className="text-[16px] font-semibold">Total</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[12px] text-[#707070]">NGN</span>
                                        <span className="text-[18px] font-bold">₦{total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BaseLayout>
    );
}

export default CheckoutPage;
