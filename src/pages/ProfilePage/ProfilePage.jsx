import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

import Header from '@/components/Header/Header';
import AuthModal from '@/components/AuthModal/AuthModal';
import Profile from './components/Profile';
import ProfileModal from './components/ProfileModal';
import ProductModal from './components/ProductModal';
import UserProducts from './components/UserProducts/UserProducts';
import GlobalModal from '@/components/GlobalModal/GlobalModal';

import './ProfilePage.scss';
import '@/styles/product-form.scss';

function ProfilePage() {
    const { user, setUser } = useAuth();
    const [products, setProducts] = useState([]);
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

    const authOpen = !user;

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
                        <Profile user={user} setIsOpen={setIsOpen} />
                        <div
                            className="profile__add-product"
                            onClick={() => setIsProductOpen(true)}
                        >
                            <span className="profile__plus">+</span>
                            <p>Добавить товар</p>
                        </div>
                    </div>
                    <hr />
                    <UserProducts
                        user={user}
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
                            setUser={setUser}
                            user={user}
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
                            user={user}
                            setProducts={setProducts}
                        />
                    </GlobalModal>
                )}
            </section>
        </>
    );
}

export default ProfilePage;
