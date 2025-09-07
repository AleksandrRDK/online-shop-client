function FilterBar({ filter, setFilter, setPage }) {
    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setPage(1);
    };

    return (
        <>
            <div className="catalog__filter-bar">
                <button
                    className={filter === 'all' ? 'active' : ''}
                    onClick={() => handleFilterChange('all')}
                >
                    Все
                </button>
                <button
                    className={filter === 'new' ? 'active' : ''}
                    onClick={() => handleFilterChange('new')}
                >
                    Сначала новые
                </button>
            </div>
        </>
    );
}

export default FilterBar;
