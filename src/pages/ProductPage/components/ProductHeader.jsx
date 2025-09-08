import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import QuantityControls from './QuantityControls';
import defaultProduct from '@/assets/default-product.png';
import { validateAvatar } from '@/utils/validators';
import { useToast } from '@/hooks/useToast';
import Pica from 'pica';

function ProductHeader({ product, editing, previewImg, cart, user }) {
    const { id } = useParams();
    const { isEditing, editData, setEditData } = editing;
    const { preview: preview, setPreview } = previewImg;
    const { quantity, cartItems, setCartItems } = cart;
    const { addToast } = useToast();

    useEffect(() => {
        setPreview(
            editData.image instanceof File
                ? URL.createObjectURL(editData.image)
                : product.image || null
        );
    }, [editData.image, product.image]);

    const handleChange = (field, value) => {
        setEditData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // загрузка и сжатие картинки
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const error = validateAvatar(file);
        if (error) {
            addToast(error, 'error');
            return;
        }

        try {
            const pica = Pica();
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            await img.decode();

            const canvas = document.createElement('canvas');
            const maxDim = 512;
            const ratio = Math.min(maxDim / img.width, maxDim / img.height, 1);
            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;

            await pica.resize(img, canvas);

            const blob = await pica.toBlob(canvas, file.type);
            const compressedFile = new File([blob], file.name, {
                type: file.type,
            });

            setEditData((prev) => ({
                ...prev,
                image: compressedFile, // сохраняем файл в editData
            }));
            setPreview(URL.createObjectURL(compressedFile));
        } catch (err) {
            console.error('Ошибка обработки файла:', err);
            addToast('Не удалось обработать картинку', 'error');
        }
    };

    return (
        <div className="product-page__header">
            <img
                src={preview || product.image || defaultProduct}
                alt={product.title}
                onError={(e) => {
                    e.target.src = defaultProduct;
                }}
            />
            <div className="product-page__info">
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            value={editData.title}
                            onChange={(e) =>
                                handleChange('title', e.target.value)
                            }
                        />
                        <input
                            type="number"
                            value={editData.price}
                            onChange={(e) =>
                                handleChange('price', e.target.value)
                            }
                        />
                        <textarea
                            value={editData.description}
                            onChange={(e) =>
                                handleChange('description', e.target.value)
                            }
                        />

                        {/* загрузка картинки */}
                        <div className="product-form__image">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        <input
                            type="text"
                            value={editData.tags}
                            onChange={(e) =>
                                handleChange('tags', e.target.value)
                            }
                        />
                    </>
                ) : (
                    <>
                        <h1>{product.title}</h1>
                        <p className="price">{product.price} ₽</p>
                        <QuantityControls
                            quantity={quantity}
                            user={user}
                            cartItems={cartItems}
                            id={id}
                            setCartItems={setCartItems}
                        />
                        {product.tags && product.tags.length > 0 && (
                            <p className="tags">
                                Теги: {product.tags.join(', ')}
                            </p>
                        )}
                        <p className="desc">{product.description}</p>
                    </>
                )}
            </div>
        </div>
    );
}

export default ProductHeader;
