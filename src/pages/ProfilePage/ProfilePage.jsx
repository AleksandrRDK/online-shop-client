import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

import Header from '@/components/Header/Header';
import AuthModal from '@/components/AuthModal/AuthModal';
import GlobalModal from '@/components/GlobalModal/GlobalModal';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import Profile from './components/Profile';
import ProfileModal from './components/ProfileModal';
import ProductModal from './components/ProductModal';
import OrdersModal from './components/OrdersModal/OrdersModal';
import UserProducts from './components/UserProducts/UserProducts';

import './ProfilePage.scss';
import '@/styles/product-form.scss';

function ProfilePage() {
    const { user, loading } = useAuth();
    const [products, setProducts] = useState([]);
    const [isOrdersOpen, setIsOrdersOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isProductOpen, setIsProductOpen] = useState(false);
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        password: '',
    });
    const [productData, setProductData] = useState({
        title: '',
        description: '',
        price: '',
        image: '',
        tags: '',
        characteristics: [],
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                password: '',
            });
        }
    }, [user]);

    const authOpen = !user;

    if (loading) {
        return (
            <>
                <Header />
                <div
                    className="container"
                    style={{ textAlign: 'center', padding: '2rem' }}
                >
                    <LoadingSpinner size={40} />
                </div>
            </>
        );
    }

    if (!user) {
        return (
            <>
                <Header />
                <div className="container">
                    <AuthModal isOpen={authOpen} />
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <section className="profile">
                <div className="container">
                    <div className="profile__container">
                        <Profile setIsOpen={setIsOpen} />

                        <div
                            className="profile__add-product"
                            onClick={() => setIsProductOpen(true)}
                        >
                            <span className="profile__plus">+</span>
                            <p>Добавить товар</p>
                        </div>

                        <div
                            className="profile__orders"
                            onClick={() => setIsOrdersOpen(true)}
                        >
                            <p>Показать заказы</p>
                        </div>
                    </div>
                    <hr />
                    <UserProducts
                        products={products}
                        setProducts={setProducts}
                    />
                </div>
                {isOpen && (
                    <GlobalModal
                        isOpen={isOpen}
                        onClose={() => {
                            setIsOpen(false);
                            setFormData({
                                username: user.username,
                                email: user.email,
                                password: '',
                            });
                        }}
                    >
                        <ProfileModal
                            formData={formData}
                            setFormData={setFormData}
                            setIsOpen={setIsOpen}
                        />
                    </GlobalModal>
                )}
                {isProductOpen && (
                    <GlobalModal
                        isOpen={isProductOpen}
                        onClose={() => {
                            setIsProductOpen(false);
                            setProductData({
                                title: '',
                                description: '',
                                price: '',
                                image: '',
                                tags: '',
                                characteristics: [],
                            });
                        }}
                    >
                        <ProductModal
                            productData={productData}
                            setProductData={setProductData}
                            setIsProductOpen={setIsProductOpen}
                            setProducts={setProducts}
                        />
                    </GlobalModal>
                )}
                {isOrdersOpen && (
                    <GlobalModal
                        isOpen={isOrdersOpen}
                        onClose={() => setIsOrdersOpen(false)}
                    >
                        <OrdersModal onClose={() => setIsOrdersOpen(false)} />
                    </GlobalModal>
                )}
            </section>
        </>
    );
}

export default ProfilePage;
