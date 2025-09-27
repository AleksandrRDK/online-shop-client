import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '@/styles/quantity.scss';
import './ProductCardSkeleton.scss';

const ProductCardSkeleton = () => {
    return (
        <div className="product-card skeleton-card">
            <Skeleton height={180} borderRadius="var(--radius)" />{' '}
            {/* изображение */}
            <Skeleton height={20} style={{ marginTop: '0.8rem' }} /> {/* имя */}
            <Skeleton
                height={15}
                width="80%"
                style={{ margin: '0.5rem auto' }}
            />{' '}
            {/* описание */}
            <Skeleton
                height={15}
                width="50%"
                style={{ margin: '0.5rem auto' }}
            />{' '}
            {/* продавец */}
            <Skeleton
                height={36}
                width="60%"
                style={{ margin: '0.8rem auto' }}
            />{' '}
            {/* кнопка */}
        </div>
    );
};

export default ProductCardSkeleton;
