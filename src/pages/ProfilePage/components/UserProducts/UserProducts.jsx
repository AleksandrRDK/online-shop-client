import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { deleteProduct, getProductsByUser } from '@/api/products';

import GlobalModal from '@/components/GlobalModal/GlobalModal';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import Pagination from '@/components/Pagination/Pagination';
import ProductCardLayout from '@/components/ProductCardLayout/ProductCardLayout';
import EditProductModal from '../EditProductModal/EditProductModal';

import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';

import './UserProducts.scss';

function UserProducts({ products, setProducts }) {
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { addToast } = useToast();
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        if (authLoading) return;
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await getProductsByUser(page, 12);
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
                <LoadingSpinner size={160} />
            ) : (
                <div className="user-products__list">
                    {products.map((product, i) => (
                        <ProductCardLayout product={product} index={i}>
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
                        </ProductCardLayout>
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
