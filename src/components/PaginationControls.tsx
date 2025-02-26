import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Props {
  offset: number;
  totalCount: number;
  next: string | null;
  previous: string | null;
  setOffset: (offset: number) => void;
}

const PaginationControls = ({
  offset,
  totalCount,
  next,
  previous,
  setOffset,
}: Props) => {
  const currentPage = Math.floor(offset / 7) + 1;
  const totalPages = Math.ceil(totalCount / 7);

  const getPageNumbers = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between border-gray-200 bg-white px-4">
      <div className="flex flex-1 justify-between sm:hidden">
        <button className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Previous
        </button>
        <button className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Page <span className="font-bold">{currentPage}</span> of{" "}
            <span className="font-bold">{totalPages}</span>{" "}
            {`(${totalCount} Results)`}
          </p>
        </div>
        <div>
          <nav
            aria-label="Pagination"
            className="isolate inline-flex -space-x-px rounded-md shadow-xs"
          >
            <button
              onClick={() => setOffset(offset - 7)}
              disabled={!previous}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <FaChevronLeft aria-hidden="true" className="size-5" />
            </button>
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => setOffset((page - 1) * 7)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-gray-300 ring-inset focus:z-20 focus:outline-offset-0 ${
                  currentPage === page
                    ? "bg-emerald-600 text-white"
                    : "text-gray-900 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              disabled={!next}
              onClick={() => setOffset(offset + 7)}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Next</span>
              <FaChevronRight aria-hidden="true" className="size-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default PaginationControls;
