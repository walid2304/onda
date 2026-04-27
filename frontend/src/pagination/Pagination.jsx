const Pagination = ({ page, setPage, totalItems, limit }) => {
    const totalPages = Math.ceil(totalItems / limit);

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-end gap-2 mt-4">
            <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                Précédent
            </button>

            <span className="px-3 py-1 text-sm text-gray-600 flex items-center">
                Page {page} / {totalPages}
            </span>

            <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                Suivant
            </button>
        </div>
    );
};

export default Pagination;