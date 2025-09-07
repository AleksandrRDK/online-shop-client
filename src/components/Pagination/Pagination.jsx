import './Pagination.scss';

function Pagination({ page, setPage, totalPages }) {
    const getVisiblePages = () => {
        const pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (page > 4) pages.push('...');
            const start = Math.max(2, page - 2);
            const end = Math.min(totalPages - 1, page + 2);
            for (let i = start; i <= end; i++) pages.push(i);
            if (page < totalPages - 3) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                ← Назад
            </button>

            {visiblePages.map((p, idx) =>
                p === '...' ? (
                    <span key={idx} className="dots">
                        ...
                    </span>
                ) : (
                    <button
                        key={p}
                        className={page === p ? 'active' : ''}
                        onClick={() => setPage(p)}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
            >
                Вперёд →
            </button>
        </div>
    );
}

export default Pagination;
