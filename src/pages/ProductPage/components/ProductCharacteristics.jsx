function ProductCharacteristics({
    characteristics,
    isEditing,
    editData,
    setEditData,
}) {
    const handleCharacteristicChange = (key, value) => {
        setEditData((prev) => ({
            ...prev,
            characteristics: {
                ...prev.characteristics,
                [key]: value,
            },
        }));
    };

    return (
        <>
            {Object.keys(characteristics || {}).length > 0 && (
                <div className="product-page__characteristics">
                    <h2>Характеристики</h2>
                    <table>
                        <tbody>
                            {Object.entries(
                                isEditing
                                    ? editData.characteristics
                                    : characteristics
                            ).map(([key, value]) => (
                                <tr key={key}>
                                    <td>{key}</td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={value}
                                                onChange={(e) =>
                                                    handleCharacteristicChange(
                                                        key,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        ) : (
                                            value
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

export default ProductCharacteristics;
