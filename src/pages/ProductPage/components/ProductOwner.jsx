function ProductOwner({ owner }) {
    return (
        <div className="product-page__owner">
            <h2>Продавец</h2>
            <p>
                {owner.username} ({owner.email})
            </p>
        </div>
    );
}

export default ProductOwner;
