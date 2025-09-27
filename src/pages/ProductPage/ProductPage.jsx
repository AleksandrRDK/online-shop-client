import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '@/api/products';
import { getCart } from '@/api/carts';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import Header from '@/components/Header/Header';
import ProductHeader from './components/ProductHeader';
import ProductCharacteristics from './components/ProductCharacteristics';
import ProductOwner from './components/ProductOwner';
import ProductDate from './components/ProductDate';
import ProductActions from './components/ProductActions';

import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import './ProductPage.scss';
import '@/styles/quantity.scss';
import '@/styles/back-btn.scss';

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToast } = useToast();

    const [product, setProduct] = useState(null);
    const [loadingPr, setLoadingPr] = useState(true);
    const [error, setError] = useState(null);

    const [cartItems, setCartItems] = useState({});

    const [isEditing, setIsEditing] = useState(false);
    const [preview, setPreview] = useState(null);
    const [editData, setEditData] = useState({
        title: '',
        price: '',
        description: '',
        tags: '',
        characteristics: {},
        image: '',
        owner: null,
    });

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                setLoadingPr(true);
                const product = await getProductById(id);
                setProduct(product);
                setEditData({
                    title: product.title,
                    price: product.price,
                    description: product.description,
                    tags: (product.tags || []).join(', '),
                    characteristics: product.characteristics || {},
                    image: product.image,
                    owner: product.owner?._id || product.owner,
                });

                if (user?._id) {
                    const cart = await getCart();
                    const initialCart = {};
                    cart.forEach((item) => {
                        initialCart[item.productId._id] = item.quantity;
                    });
                    setCartItems(initialCart);
                }
            } catch (error) {
                setError(`Ошибка при загрузке товара: ${error.message}`);
                addToast('Ошибка при загрузке товара', 'error');
            } finally {
                setLoadingPr(false);
            }
        };
        fetchData();
    }, [id, user]);

    if (loadingPr) return <LoadingSpinner size={160} />;
    if (error) return <p className="status error">{error}</p>;
    if (!product) return <p className="status">Товар не найден</p>;

    const formattedDate = product.createdAt
        ? new Date(product.createdAt).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
          })
        : null;

    const quantity = cartItems[id] || 0;
    const isOwner =
        user &&
        product.owner &&
        (product.owner._id === user._id || product.owner === user._id);

    return (
        <>
            <Header />
            <div className="container">
                <div className="product-page">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        ← Назад
                    </button>
                    <ProductHeader
                        product={product}
                        editing={{ isEditing, editData, setEditData }}
                        previewImg={{ preview, setPreview }}
                        cart={{ quantity, cartItems, setCartItems }}
                        user={user}
                    />
                    <ProductCharacteristics
                        characteristics={product.characteristics}
                        isEditing={isEditing}
                        editData={editData}
                        setEditData={setEditData}
                    />
                    {product.owner && <ProductOwner owner={product.owner} />}

                    {formattedDate && (
                        <ProductDate formattedDate={formattedDate} />
                    )}

                    {isOwner && (
                        <ProductActions
                            isEditing={isEditing}
                            setIsEditing={setIsEditing}
                            editData={editData}
                            setEditData={setEditData}
                            setPreview={setPreview}
                            product={product}
                            setProduct={setProduct}
                            setLoading={setLoadingPr}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default ProductPage;
