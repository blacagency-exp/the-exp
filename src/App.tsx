import { BlogPage } from "./pages/BlogPage"
import { HomePage } from "./pages/HomePage"
import { HotelPage } from "./pages/HotelPage"
import { OpportunityPage } from "./pages/OpportunityPage"
import { TourPage } from "./pages/TourPage"
import { TravelBookingPage } from "./pages/TravelBookingPage"
import { VirtualTourPage } from "./pages/VirtualTourPage"
import { CulturePage } from "./pages/CulturePage"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { BlogPostPage } from "./pages/BlogPostPage"
import { GalleryPage } from "./pages/GalleryPage"
import { ContactPage } from "./pages/ContactPage"
import { ScrollToTop } from "./Components/ScrollToTop"
import AdminBookingApprovalPage from "./pages/AdminBookingApprovalPage"
import AdminBookingRejectionPage from "./pages/AdminBookingRejectionPage"
import { BookingRequestPaymentPage } from "./pages/BookingRequestPaymentPage"
import { CreatorLeaderboardPage } from "./pages/CreatorLeaderboardPage"
import { ChristmasLeaderboardPage } from "./pages/ChristmasLeaderboardPage"
import { LeaderboardPage } from "./pages/LeaderboardPage"
import { ShopPage } from "./pages/ShopPage"
import { ProductDetailPage } from "./pages/ProductDetailPage"
import { CartPage } from "./pages/CartPage"
import { CheckoutPage } from "./pages/CheckoutPage"
import { AllProductsPage } from "./pages/AllProductsPage"
import { ShopSuccessPage } from "./pages/ShopSuccessPage"


import { ShopProvider } from "./context/ShopContext"

import { Toaster } from "react-hot-toast"

function App() {
  return (
    <ShopProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Virtual Tour Routes - Add the :tourId parameter route */}
          <Route path="/virtual-tour/*" element={<VirtualTourPage />} />
          <Route path="/virtual-tour/:tourId" element={<VirtualTourPage />} />

          <Route path="/travel-booking" element={<TravelBookingPage />} />


          <Route path="/travel-booking/payment/:id" element={<BookingRequestPaymentPage />} />
          <Route path="/admin/booking-requests/:id/approve" element={<AdminBookingApprovalPage />} />
          <Route path="/admin/booking-requests/:id/reject" element={<AdminBookingRejectionPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/creator-leaderboard" element={<CreatorLeaderboardPage />} />
          <Route path="/christmas-leaderboard" element={<ChristmasLeaderboardPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/opp" element={<OpportunityPage />} />
          <Route path="/hotel" element={<HotelPage />} />
          <Route path="/tour" element={<TourPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/culture" element={<CulturePage />} />
          <Route path="/blogpost" element={<BlogPostPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/count" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/all" element={<AllProductsPage />} />
          <Route path="/shop/:productId" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/shop/checkout/success" element={<ShopSuccessPage />} />
        </Routes>
      </Router>
    </ShopProvider>
  )
}

export default App

