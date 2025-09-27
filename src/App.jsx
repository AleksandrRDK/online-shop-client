import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext/ToastContext';

// 🔥 Lazy-импорт страниц
const CatalogPage = lazy(() => import('./pages/CatalogPage/CatalogPage'));
const CartPage = lazy(() => import('./pages/CartPage/CartPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage/ProfilePage'));
const ProductPage = lazy(() => import('./pages/ProductPage/ProductPage'));
const CartSuccessPage = lazy(() =>
    import('./pages/CartSuccessPage/CartSuccessPage')
);

// 🔥 Фолбек (пока догружается страница)
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
// или можешь сделать Skeleton для страницы

function App() {
    return (
        <Router>
            <ToastProvider>
                <AuthProvider>
                    {/* Suspense оборачивает Routes */}
                    <Suspense fallback={<LoadingSpinner />}>
                        <Routes>
                            <Route path="/" element={<CatalogPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route
                                path="/product/:id"
                                element={<ProductPage />}
                            />
                            <Route
                                path="/cart/success/:orderId"
                                element={<CartSuccessPage />}
                            />
                        </Routes>
                    </Suspense>
                </AuthProvider>
            </ToastProvider>
        </Router>
    );
}

export default App;
