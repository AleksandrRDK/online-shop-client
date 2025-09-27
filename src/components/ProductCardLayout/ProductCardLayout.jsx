import defaultProduct from '@/assets/default-product.png';
import { Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import './ProductCardLayout.scss';

function ProductCardLayout({ product, index, children }) {
    return (
        <Motion.div
            key={product._id}
            className="product-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5 }}
        >
            <img
                className="product-card__image"
                src={product.image || defaultProduct}
                alt={product.title}
                onError={(e) => {
                    e.target.src = defaultProduct;
                }}
            />

            {children}

            <Link
                to={`/product/${product._id}`}
                className="product-info-circle"
            >
                !
            </Link>
        </Motion.div>
    );
}

export default ProductCardLayout;
