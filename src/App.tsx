import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { CompareProvider } from "./contexts/CompareContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import NewsletterPopup from "./components/NewsletterPopup";
import ProductCompare from "./components/ProductCompare";
// CompareFloatingButton component removed as per user request
import useNewsletterPopup from "./hooks/useNewsletterPopup";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Account from "./pages/Account";
import About from "./pages/About";

export default function App() {
  const { isOpen, hidePopup } = useNewsletterPopup();

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <CompareProvider>
            <Router>
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Protected Routes */}
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="/account" element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                } />
                <Route path="/account/*" element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                } />
                
                {/* Catch all route */}
                <Route path="*" element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                      <p className="text-gray-600 mb-8">Página não encontrada</p>
                      <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">
                        Voltar ao início
                      </a>
                    </div>
                  </div>
                } />
              </Routes>
            </Layout>
            <Toaster position="top-right" richColors />
            <NewsletterPopup isOpen={isOpen} onClose={hidePopup} />
            <ProductCompare />
            {/* CompareFloatingButton removed as per user request */}
            </Router>
          </CompareProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}