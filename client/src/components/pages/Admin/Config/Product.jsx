import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetProductsMutation, useUpdateProductMutation } from "../../../../services/Admin/adminApi";
import { motion } from "framer-motion";
import DeletePopup from "../../../parts/popups/DeletePopup";
import Recents from "../../../parts/Main/Recents";
import { ToastContainer, toast } from "react-toastify";
import emptyStateImage from "../../../../assets/images/noCAtegory.png";
import "react-toastify/dist/ReactToastify.css";

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // API mutations
  const [getProducts, { data }] = useGetProductsMutation();
  const [updateProduct, { data: accessData }] = useUpdateProductMutation();

  // Local state
  const [popup, showPopup] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [togglor, setToggler] = useState({});
  const [productsData, setProductsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("ascending");

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // Filter and sort products
  const filteredProducts = productsData
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const order = sortOrder === "ascending" ? 1 : -1;
      switch (sortField) {
        case "name":
          return order * a.name.localeCompare(b.name);
        case "amount":
          return order * (a.regularPrice - b.regularPrice);
        case "latest":
          return order * (new Date(b.createdAt) - new Date(a.createdAt));
        default:
          return 0;
      }
    });

  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  // Show toast notification
  const showToast = (message, type = "success") => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  // ... (keep existing useEffect hooks)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const EmptyState = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[60vh] flex items-center justify-center flex-col text-center gap-5"
    >
      <img className="h-[70%]" src={emptyStateImage} alt="No categories" />
      <div className="flex flex-col gap-2">
        <h1 className="text-[30px] font-bold">No Products</h1>
        <p className="opacity-45">No user data found create a Products to continue</p>
        <p
          onClick={() => navigate("/admin/Products/manage", { state: { name: "" } })}
          className="font-bold opacity-100 text-blue-500 cursor-pointer hover:text-blue-600 transition-colors"
        >
          Let's go
        </p>
      </div>
    </motion.div>
  );

  return (
    <>
      <ToastContainer position="bottom-left" />
      {popup && (
        <DeletePopup 
          updater={updateProduct} 
          deleteData={deleteData} 
          showPopup={showPopup} 
        />
      )}

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container w-[75%] h-full pt-[60px] my-6"
      >
        <div className="w-full h-full bg-[radial-gradient(circle_at_10%_10%,_rgb(237,248,255)_0%,rgba(255,0,0,0)_100%);] rounded-tl-[65px] flex justify-center pb-60 overflow-hidden mb-20">
          <div className="w-full px-4 mt-5 pb-20">
            {/* Search and Filter Section */}
            <motion.div 
              variants={itemVariants}
              className="w-full h-16 flex items-center gap-4 mb-4"
            >
              <div className="bg-[#ffffff70] py-1 px-4 flex gap-4 rounded-full">
                <input
                  className="bg-transparent outline-none w-40"
                  type="text"
                  placeholder="Search here"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="ri-search-2-line text-[20px] text-[#1F7BAD]"></i>
              </div>

              <div className="bg-[#ffffff70] py-1 px-4 flex gap-4 rounded-full items-center">
                <i className="ri-align-left text-[20px] text-[#1F7BAD]"></i>
                <select 
                  className="bg-transparent outline-none custom-selecter"
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                >
                  <option value="name">Name</option>
                  <option value="amount">Amount</option>
                  <option value="latest">Latest</option>
                </select>
              </div>

              <div className="bg-[#ffffff70] py-1 px-4 flex gap-4 rounded-full items-center">
                <i className="ri-align-justify text-[20px] text-[#1F7BAD]"></i>
                <select 
                  className="bg-transparent outline-none custom-selecter"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                </select>
              </div>
            </motion.div>

            {/* Products Table */}
            <div className="overflow-scroll pb-96 px-20">
              {productsData?.length > 0 ? (
                <motion.table 
                  variants={containerVariants}
                  className="w-full border-collapse overflow-scroll"
                >
                  {/* ... (keep existing table header) */}
                  
                  <tbody className="overflow-scroll">
                    {currentItems.map((product, index) => (
                      <motion.tr 
                        key={product._id}
                        variants={itemVariants}
                        className="hover:bg-gray-50 font-['lufga'] transition-colors"
                      >
                        {/* ... (keep existing table row content) */}
                      </motion.tr>
                    ))}
                  </tbody>
                </motion.table>
              ) : (
                <EmptyState />
              )}
            </div>

            {/* Pagination */}
            {productsData.length > 0 && (
              <motion.div 
                variants={itemVariants}
                className="absolute bottom-8 right-[12%] flex gap-2"
              >
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded-full transition-colors disabled:opacity-50"
                >
                  <i className="ri-skip-left-line text-lg" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                    } font-bold py-2 px-4 rounded-full transition-colors`}
                  >
                    {String(page).padStart(2, '0')}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-3 rounded-full transition-colors disabled:opacity-50"
                >
                  <i className="ri-skip-right-line text-lg" />
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
      <Recents page="products" />
    </>
  );
};

export default Products;