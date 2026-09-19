import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'

// Contexts / Providers
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'

// Layout
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/layout/CartDrawer'

// Route guard
import { ProtectedRoute } from '@/components/common/ProtectedRoute'

// Pages
import { HomePage } from '@/pages/HomePage'
import { ShopPage } from '@/pages/ShopPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { CartPage } from '@/pages/CartPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { OrdersPage, OrderDetailPage } from '@/pages/OrderPages'
import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage } from '@/pages/AuthPages'
import { CategoriesPage, CategoryPage } from '@/pages/CategoriesPage'
import { AccountPage } from '@/pages/AccountPage'
import { WishlistPage } from '@/pages/WishlistPage'

// Admin
import { AdminLayout } from '@/pages/admin/AdminLayout'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminProducts } from '@/pages/admin/AdminProducts'
import { AdminOrders } from '@/pages/admin/AdminOrders'
import { AdminCategories } from '@/pages/admin/AdminCategories'
import { AdminCustomers } from '@/pages/admin/AdminCustomers'
import { AdminCoupons } from '@/pages/admin/AdminCoupons'

/** Minimal shell that wraps pages with Navbar + Footer */
function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            {/* Global toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#1e1f35',
                  color: '#e2e8f0',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  fontSize: '14px',
                },
                success: { iconTheme: { primary: '#4f63ff', secondary: '#fff' } },
                error: { iconTheme: { primary: '#ec4899', secondary: '#fff' } },
              }}
            />

            <Routes>
              {/* ── Public store routes */}
              <Route path="/" element={<StoreLayout><HomePage /></StoreLayout>} />
              <Route path="/shop" element={<StoreLayout><ShopPage /></StoreLayout>} />
              <Route path="/products/:id" element={<StoreLayout><ProductDetailPage /></StoreLayout>} />
              <Route path="/cart" element={<StoreLayout><CartPage /></StoreLayout>} />

              {/* ── Categories routes — fix the 404 */}
              <Route path="/categories" element={<StoreLayout><CategoriesPage /></StoreLayout>} />
              <Route path="/categories/:slug" element={<StoreLayout><CategoryPage /></StoreLayout>} />

              {/* ── Auth routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* ── Protected customer routes */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <StoreLayout><CheckoutPage /></StoreLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <StoreLayout><OrdersPage /></StoreLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/:id"
                element={
                  <ProtectedRoute>
                    <StoreLayout><OrderDetailPage /></StoreLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <StoreLayout><AccountPage /></StoreLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <StoreLayout><WishlistPage /></StoreLayout>
                  </ProtectedRoute>
                }
              />

              {/* ── Admin routes (requireAdmin) */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="coupons" element={<AdminCoupons />} />
              </Route>

              {/* ── 404 fallback */}
              <Route
                path="*"
                element={
                  <StoreLayout>
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-16"
                    >
                      <p className="text-9xl font-black gradient-text mb-4 leading-none">404</p>
                      <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
                      <p className="text-slate-400 mb-8 max-w-md">
                        The page you're looking for doesn't exist or has been moved.
                      </p>
                      <div className="flex gap-3">
                        <Link
                          to="/"
                          className="px-6 py-3 bg-primary-500 hover:bg-primary-400 text-white rounded-xl font-semibold transition-colors"
                        >
                          Go Home
                        </Link>
                        <Link
                          to="/shop"
                          className="px-6 py-3 border border-white/20 hover:bg-white/10 text-white rounded-xl font-semibold transition-colors"
                        >
                          Browse Shop
                        </Link>
                      </div>
                    </motion.div>
                  </StoreLayout>
                }
              />
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
