// Unified Paystack global type declaration
// This file should replace all other Paystack global declarations

export interface PaystackPopInterface {
  setup(options: {
    key: string
    email: string
    amount: number
    metadata: {
      [key: string]: any // Completely flexible - allows any metadata structure
      custom_fields: Array<{
        display_name: string
        variable_name: string
        value: string
      }>
    }
    ref: string
    onClose: () => void
    callback: (response: { reference: string }) => void
  }): { openIframe: () => void }
}

declare global {
  interface Window {
    PaystackPop: PaystackPopInterface
  }
}
