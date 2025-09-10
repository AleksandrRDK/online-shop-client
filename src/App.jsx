import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext/ToastContext';

import CatalogPage from './pages/CatalogPage/CatalogPage';
import CartPage from './pages/CartPage/CartPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import ProductPage from './pages/ProductPage/ProductPage';
import CartSuccessPage from './pages/CartSuccessPage/CartSuccessPage';

function App() {
    return (
        <Router>
            <ToastProvider>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<CatalogPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/product/:id" element={<ProductPage />} />
                        <Route
                            path="/cart/success/:orderId"
                            element={<CartSuccessPage />}
                        />
                    </Routes>
                </AuthProvider>
            </ToastProvider>
        </Router>
    );
}

export default App;
