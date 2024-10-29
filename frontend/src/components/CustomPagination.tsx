import React from "react";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers: JSX.Element[] = [];
    const maxDisplayedPages = 5;

    let startPage: number, endPage: number;

    if (totalPages <= maxDisplayedPages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = maxDisplayedPages;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - maxDisplayedPages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`mx-1 px-4 py-2 border rounded ${
            currentPage === i ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }

    if (startPage > 1) {
      pageNumbers.unshift(
        <button
          key="start-ellipsis"
          className="mx-1 px-4 py-2 border rounded bg-gray-200 cursor-not-allowed"
        >
          ...
        </button>
      );
    }
    if (endPage < totalPages) {
      pageNumbers.push(
        <button
          key="end-ellipsis"
          className="mx-1 px-4 py-2 border rounded bg-gray-200 cursor-not-allowed"
        >
          ...
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center mt-4">
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className={`mx-1 px-4 py-2 border rounded ${
          currentPage === 1
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 text-white"
        }`}
      >
        Previous
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`mx-1 px-4 py-2 border rounded ${
          currentPage === totalPages
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 text-white"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default CustomPagination;
