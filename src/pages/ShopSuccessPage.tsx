import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { BaseLayout } from '../Components/layout/BaseLayout';
import { CheckCircle2, XCircle } from 'lucide-react';
import { API_URL } from '../config/api';
import { useShop } from '../context/ShopContext';
import { ActivityIndicator } from '@/Components/ui/ActivityIndicator';

export function ShopSuccessPage() {
    const [searchParams] = useSearchParams();
    const reference = searchParams.get('reference');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [orderData, setOrderData] = useState<any>(null);
    const { clearCart } = useShop();

    useEffect(() => {
        const verifyOrder = async () => {
            if (!reference) {
                setStatus('error');
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/shop/verify-payment/${reference}`);
                const data = await response.json();

                if (data.status === 'completed') {
                    setStatus('success');
                    setOrderData(data.paymentDetails);
                    clearCart();
                } else {
                    setStatus('error');
                }
            } catch (error) {
                console.error('Verification error:', error);
                setStatus('error');
            }
        };

        verifyOrder();
    }, [reference, clearCart]);

    return (
        <BaseLayout>
            <div className="min-h-[70vh] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                    {status === 'loading' && (
                        <ActivityIndicator
                            message="Verifying your payment..."
                            className="py-10"
                            size={64}
                        />
                    )}

                    {status === 'success' && (
                        <div className="animate-in fade-in zoom-in duration-500">
                            <CheckCircle2 className="w-20 h-20 text-[#89D618] mx-auto mb-6" />
                            <h2 className="text-3xl font-black text-[#141E03] mb-2">THANK YOU!</h2>
                            <p className="text-xl text-gray-700 mb-6">Your order has been placed successfully.</p>

                            <div className="bg-[#FAFAFA] rounded-xl p-4 mb-8 text-left">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500 text-sm">Reference</span>
                                    <span className="text-[#141E03] font-mono font-medium">{reference}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-500 text-sm">Status</span>
                                    <span className="text-green-600 font-bold uppercase text-sm">Paid</span>
                                </div>
                                {orderData && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 text-sm">Amount</span>
                                        <span className="text-[#141E03] font-bold">₦{(orderData.amount / 100).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>

                            <Link
                                to="/shop"
                                className="inline-block w-full bg-[#141E03] text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    )}

                    {status === 'error' && (
                        <div>
                            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-[#141E03] mb-2">Something went wrong</h2>
                            <p className="text-gray-600 mb-8">
                                We couldn't verify your payment. If you've been debited, please contact support with your reference: <strong>{reference || 'N/A'}</strong>
                            </p>
                            <Link
                                to="/checkout"
                                className="inline-block w-full bg-[#141E03] text-white py-4 rounded-xl font-bold"
                            >
                                Try Again
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </BaseLayout>
    );
}
