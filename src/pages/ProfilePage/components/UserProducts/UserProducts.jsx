import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProductsByUser, deleteProduct } from '@/api/products';
import GlobalModal from '@/components/GlobalModal/GlobalModal';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import Pagination from '@/components/Pagination/Pagination';
import EditProductModal from '../EditProductModal/EditProductModal';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';

import { motion as Motion } from 'framer-motion';
import './UserProducts.scss';
import defaultProduct from '@/assets/default-product.png';

function UserProducts({ products, setProducts }) {
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { addToast } = useToast();
    const { user, accessToken } = useAuth();

    useEffect(() => {
        if (!user?._id) return;
        setPage(1);
    }, [user?._id]);

    useEffect(() => {
        if (!user?._id) return;
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await getProductsByUser(page, 12, accessToken);
                setProducts(data.products);
                setTotalPages(data.totalPages);
            } catch (err) {
                console.error(err);
                addToast('Ошибка при загрузке товаров пользователя', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [user?._id, page, setProducts]);

    const handleDelete = async (id) => {
        if (!window.confirm('Удалить этот товар?')) return;
        try {
            await deleteProduct(id);
            setProducts((prev) => prev.filter((p) => p._id !== id));
            addToast('Товар удалён!', 'success');
        } catch (err) {
            console.error(err);
            addToast('Ошибка при удалении товара!', 'error');
        }
    };

    const handleUpdate = (updatedProduct) => {
        setProducts(
            products.map((p) =>
                p._id === updatedProduct._id ? updatedProduct : p
            )
        );
    };

    return (
        <div className="user-products">
            <h2>ВАШИ ТОВАРЫ</h2>
            {loading ? (
                <LoadingSpinner size={160} color="#3aaed8" />
            ) : (
                <div className="user-products__list">
                    {products.map((product, i) => (
                        <Motion.div
                            key={product._id}
                            className="product-card"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2, duration: 0.6 }}
                        >
                            <img
                                className="catalog__image"
                                src={product.image || defaultProduct}
                                alt={product.title}
                                onError={(e) => {
                                    e.target.src = defaultProduct;
                                }}
                            />
                            <h3>{product.title}</h3>
                            <p>Цена: {product.price}</p>
                            <div className="user-products__actions">
                                <button
                                    onClick={() => setEditingProduct(product)}
                                >
                                    Изменить
                                </button>
                                <button
                                    onClick={() => handleDelete(product._id)}
                                >
                                    Удалить
                                </button>
                            </div>
                            <Link
                                to={`/product/${product._id}`}
                                className="product-info-circle"
                            >
                                !
                            </Link>
                        </Motion.div>
                    ))}
                </div>
            )}

            <Pagination page={page} setPage={setPage} totalPages={totalPages} />

            {editingProduct && (
                <GlobalModal
                    isOpen={!!editingProduct}
                    onClose={() => setEditingProduct(null)}
                >
                    <EditProductModal
                        product={editingProduct}
                        onClose={() => setEditingProduct(null)}
                        onUpdate={handleUpdate}
                    />
                </GlobalModal>
            )}
        </div>
    );
}

export default UserProducts;
