import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SiteProvider } from './context/SiteContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

// Customer Components & Pages
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import Offers from './pages/Offers';
import About from './pages/About';
import Contact from './pages/Contact';

// Admin Components & Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCollections from './pages/admin/AdminCollections';
import AdminSizes from './pages/admin/AdminSizes';
import AdminColors from './pages/admin/AdminColors';
import AdminOffers from './pages/admin/AdminOffers';
import AdminHeroSlider from './pages/admin/AdminHeroSlider';
import AdminThemeCustomizer from './pages/admin/AdminThemeCustomizer';
import AdminMediaLibrary from './pages/admin/AdminMediaLibrary';
import AdminHomepageCMS from './pages/admin/AdminHomepageCMS';
import AdminPagesCMS from './pages/admin/AdminPagesCMS';
import AdminNavigation from './pages/admin/AdminNavigation';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminSettings from './pages/admin/AdminSettings';
import AdminProfile from './pages/admin/AdminProfile';

// SEO Admin Pages
import AdminSEODashboard from './pages/admin/AdminSEODashboard';
import AdminProductSEO from './pages/admin/AdminProductSEO';
import AdminCategorySEO from './pages/admin/AdminCategorySEO';
import AdminPageSEO from './pages/admin/AdminPageSEO';
import AdminGlobalSEO from './pages/admin/AdminGlobalSEO';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Customer Layout Wrapper
const StorefrontLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-background)', color: 'var(--color-text)' }}>
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
};

// Protected Admin Route Guard
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0B0F19',
        color: '#818CF8',
        fontFamily: 'var(--font-heading)',
        fontSize: '1.25rem',
      }}>
        Verifying Session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SiteProvider>
          <ToastProvider>
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                {/* Customer Storefront Routes */}
                <Route path="/" element={<StorefrontLayout><Home /></StorefrontLayout>} />
                <Route path="/products" element={<StorefrontLayout><Products /></StorefrontLayout>} />
                <Route path="/products/:slug" element={<StorefrontLayout><ProductDetail /></StorefrontLayout>} />
                <Route path="/categories" element={<StorefrontLayout><Categories /></StorefrontLayout>} />
                <Route path="/offers" element={<StorefrontLayout><Offers /></StorefrontLayout>} />
                <Route path="/about" element={<StorefrontLayout><About /></StorefrontLayout>} />
                <Route path="/contact" element={<StorefrontLayout><Contact /></StorefrontLayout>} />

                {/* Admin Authentication Route */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedAdminRoute>
                      <AdminLayout />
                    </ProtectedAdminRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  
                  {/* Catalog */}
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/new" element={<AdminProductForm />} />
                  <Route path="products/:id/edit" element={<AdminProductForm />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="collections" element={<AdminCollections />} />
                  <Route path="sizes" element={<AdminSizes />} />
                  <Route path="colors" element={<AdminColors />} />

                  {/* Sales & Marketing */}
                  <Route path="offers" element={<AdminOffers />} />
                  <Route path="hero-slider" element={<AdminHeroSlider />} />

                  {/* Content */}
                  <Route path="homepage-cms" element={<AdminHomepageCMS />} />
                  <Route path="pages-cms" element={<AdminPagesCMS />} />
                  <Route path="navigation" element={<AdminNavigation />} />
                  <Route path="media" element={<AdminMediaLibrary />} />
                  <Route path="inquiries" element={<AdminInquiries />} />

                  {/* SEO Management */}
                  <Route path="seo-dashboard" element={<AdminSEODashboard />} />
                  <Route path="seo-products" element={<AdminProductSEO />} />
                  <Route path="seo-categories" element={<AdminCategorySEO />} />
                  <Route path="seo-pages" element={<AdminPageSEO />} />
                  <Route path="seo-settings" element={<AdminGlobalSEO />} />

                  {/* Appearance */}
                  <Route path="theme" element={<AdminThemeCustomizer />} />

                  {/* Settings */}
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="profile" element={<AdminProfile />} />
                </Route>

                {/* Catch-all Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </SiteProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
