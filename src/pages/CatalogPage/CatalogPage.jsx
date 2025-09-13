import { useEffect, useState } from 'react';
import { getProducts } from '@/api/products.js';
import { getCart } from '@/api/carts.js';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import './CatalogPage.scss';
import '@/styles/quantity.scss';
import Header from '@/components/Header/Header';
import FilterBar from './components/FilterBar';
import TagFilterModal from './components/TagFilterModal';
import ProductCard from './components/ProductCard';
import Pagination from '@/components/Pagination/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

const CatalogPage = () => {
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true); // отдельный loading
    const [tagModalOpen, setTagModalOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [updating, setUpdating] = useState({});
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState('all');
    const { user, accessToken } = useAuth();
    const { addToast } = useToast();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoadingProducts(true);
                const data = await getProducts(page, 48, filter, selectedTags);
                setProducts(data.products);
                setTotalPages(data.totalPages);
            } catch (err) {
                console.error(err);
                addToast('Ошибка при загрузке товаров', 'error');
            } finally {
                setLoadingProducts(false);
            }
        };
        fetchProducts();
    }, [page, filter, selectedTags]);

    useEffect(() => {
        const fetchCartData = async () => {
            if (!user?._id) return;
            try {
                const cart = await getCart(accessToken);
                const initialCart = {};
                cart.forEach((item) => {
                    initialCart[item.productId._id] = item.quantity;
                });
                setCartItems(initialCart);
            } catch (err) {
                console.error(err);
                addToast('Ошибка при загрузке корзины', 'error');
            }
        };
        fetchCartData();
    }, [user]);

    return (
        <>
            <Header />
            <div className="container">
                <div className="catalog">
                    <h1 className="catalog__title">Каталог товаров</h1>

                    <div className="catalog__controls">
                        <FilterBar
                            filter={filter}
                            setFilter={setFilter}
                            setPage={setPage}
                        />
                        <button
                            className="btn-tag-filter"
                            onClick={() => setTagModalOpen(true)}
                        >
                            Фильтры по тегам
                        </button>
                    </div>

                    <TagFilterModal
                        isOpen={tagModalOpen}
                        onClose={() => setTagModalOpen(false)}
                        selectedTags={selectedTags}
                        setSelectedTags={setSelectedTags}
                    />

                    {loadingProducts ? (
                        <LoadingSpinner
                            size={160}
                            color="var(--color-accent-primary)"
                        />
                    ) : (
                        <>
                            <div className="catalog__grid">
                                {products.map((product, index) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                        index={index}
                                        updating={updating}
                                        cartItems={cartItems}
                                        setCartItems={setCartItems}
                                        setUpdating={setUpdating}
                                    />
                                ))}
                            </div>
                            <Pagination
                                page={page}
                                setPage={setPage}
                                totalPages={totalPages}
                            />
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default CatalogPage;
