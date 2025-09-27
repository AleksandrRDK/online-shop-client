import { useEffect, useState } from 'react';
import { getAllTags } from '@/api/products';
import GlobalModal from '@/components/GlobalModal/GlobalModal';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

function TagFilterModal({ isOpen, onClose, selectedTags, setSelectedTags }) {
    const [tags, setTags] = useState([]);
    const [search, setSearch] = useState('');
    const [loadingTags, setLoadingTags] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const fetchTags = async () => {
            try {
                setLoadingTags(true);
                const allTags = await getAllTags();
                setTags(allTags);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingTags(false);
            }
        };
        fetchTags();
    }, [isOpen]);

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const filteredTags = tags.filter((t) =>
        t.tag.toLowerCase().includes(search.toLowerCase())
    );

    const resetFilters = () => {
        setSelectedTags([]);
        setSearch('');
    };

    return (
        <GlobalModal isOpen={isOpen} onClose={onClose}>
            <div className="tag-filter-modal-content">
                <h3>Фильтры по тегам</h3>
                <input
                    type="text"
                    placeholder="Поиск тегов..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {loadingTags ? (
                    <div className="tags-loading">
                        <LoadingSpinner size={40} />
                    </div>
                ) : (
                    <div className="tags-list">
                        {filteredTags.length > 0 ? (
                            filteredTags.map((t) => (
                                <button
                                    key={t.tag}
                                    className={
                                        selectedTags.includes(t.tag)
                                            ? 'active'
                                            : ''
                                    }
                                    onClick={() => toggleTag(t.tag)}
                                >
                                    {t.tag} ({t.count})
                                </button>
                            ))
                        ) : (
                            <p>Теги не найдены</p>
                        )}
                    </div>
                )}

                <div className="modal-actions">
                    <button className="btn-reset" onClick={resetFilters}>
                        Сбросить фильтры
                    </button>
                    <button onClick={onClose}>Закрыть</button>
                </div>
            </div>
        </GlobalModal>
    );
}

export default TagFilterModal;
