import type React from "react"
import { usePaystackPayment } from "react-paystack"

interface PaystackButtonProps {
  amount: number
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
}

export const PaystackButton: React.FC<PaystackButtonProps> = ({ amount, email, firstName, lastName, phoneNumber }) => {
  const config = {
    reference: new Date().getTime().toString(),
    email: email,
    amount: amount * 100, // Paystack expects amount in kobo
    publicKey: "YOUR_PAYSTACK_PUBLIC_KEY",
    firstname: firstName,
    lastname: lastName,
    phone: phoneNumber,
  }

  const initializePayment = usePaystackPayment(config)

  const onSuccess = (reference: { reference: string }) => {
    // Implementation for whatever you want to do with reference and after success call.
    console.log(reference)
    alert("Payment successful! Reference: " + reference.reference)
  }

  const onClose = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    alert("Payment cancelled")
  }

  return (
    <button
      type="submit"
      onClick={() => {
        initializePayment({ onSuccess, onClose })
      }}
      className="px-8 py-2 bg-[#5A8E00] text-white rounded-md hover:bg-[#4A7500] transition-colors"
    >
      Pay Now
    </button>
  )
}

