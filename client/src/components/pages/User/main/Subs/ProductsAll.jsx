import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Product from '../../../../parts/Cards/Product';
import CollectionCard from '../../../../parts/Cards/Collection';

const ProductsAll = () => {
  const [productsData, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const productsPerPage = 20;

  useEffect(() => {
    setIsLoading(true);
    if (location?.state?.products) {
      setProducts(location.state.products);
      setIsLoading(false);
    }
  }, [location]);

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productsData?.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil((productsData?.length || 0) / productsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Smooth scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-100 bg-product">
      <div className="fixed inset-0 bg-[#ffffffaf] mix-blend-screen backdrop-blur-3xl" />
      
      <div className="relative min-h-screen px-4 md:px-40 pt-20 pb-10">
        <span className="flex items-start mb-20">
          <h1 
            style={{ whiteSpace: 'pre-line' }}
            className="text-4xl md:text-[120px] leading-none text-[#5a6a60d3] font-bold font-['lufga']"
          >
            {location?.state?.title?.replace(/ /g, '\n')}
          </h1>
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {currentProducts?.map((data, index) => (
            <div
              key={data.id || index}
              className="transform transition-all duration-500 hover:scale-105"
              style={{
                opacity: 0,
                animation: `fadeIn 0.5s ease-out forwards ${index * 0.1}s`
              }}
            >
              {location?.state?.action === 'collections' ? (
                <CollectionCard type="product" data={data} pos={index} />
              ) : (
                <Product type="product" data={data} pos={index} />
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-[#5a6a60d3] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === index + 1
                    ? 'bg-[#5a6a60d3] text-white'
                    : 'bg-white text-[#5a6a60d3]'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded bg-[#5a6a60d3] absolute top-0 left-0 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsAll;