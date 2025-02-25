import type { PaystackPopInterface } from "../components/Travel-bookings/PaystackButton"

declare global {
  interface Window {
    PaystackPop: {
      new (): PaystackPopInterface
    }
  }
}

