import React, { useEffect, useState } from 'react';
import { FiFilter } from 'react-icons/fi';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { RangeSlider } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import './Search.css';
import { useAddToBookmarkMutation, useAddtoCartMutation, useCheckItemIntheBookmarkMutation, useCheckPorductInCartMutation, useGetAllCollectionMutation, useGetAllProductMutation, useRemoveBookmarkItmeMutation } from '../../../../services/User/userApi';
import CollectionCard from '../../../parts/Cards/Collection';
import { ToastContainer, toast } from 'react-toastify';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const Search = ({userData}) => {


  const [getAllProduct, { isLoading, error, data },] = useGetAllProductMutation();
  const [getAllCollection, { data:collData },] = useGetAllCollectionMutation();
  const [addtoCart, { error: addError, data: addData }] = useAddtoCartMutation();


  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showFilters, setShowFilters] = useState(true);
  const [productData, setProductData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([10, 2500]);
  const [showProducts, setShowProducts] = useState(true);
  const [showCollections, setShowCollections] = useState(false);
  const [sortBy, setSortBy] = useState('name-asc');
  const [activeCategory, setActiveCategory] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState(productData);
  const [collections,setCollections] = useState([]);
  const [showInStock, setShowInStock] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);
  const [popularityData, setPopularityData] = useState({});

  // Categories limited to fruits and vegetables
  const categories = [
    'All Categories',
    'Vegetables',
    'Fruits'
  ];

  // const collections = [
  //   'All Collections',
  //   'Summer Specials',
  //   'Fresh Arrivals',
  //   'Seasonal Picks',
  //   'Local Farmers'
  // ];


  useEffect(() => { getAllProduct() }, [])
  useEffect(() => { getAllCollection() }, [])

 useEffect(() => {
  if (data?.productDetails) {
    setProductData(data?.productDetails)
    setFilteredProducts(data?.productDetails)
  }
  if (data?.pipeline) {
    // Create a map of product IDs to order counts
    const popularityMap = data.pipeline.reduce((acc, item) => {
      acc[item._id] = item.totalOrders;
      return acc;
    }, {});
    setPopularityData(popularityMap);
  }
}, [data])

  const handleSort = (sortType) => {
    let sorted = [...filteredProducts];
    switch (sortType) {
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        sorted.sort((a, b) => a.salePrice - b.salePrice);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.salePrice - a.salePrice);
        break;
      case 'date-asc':
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'date-desc':
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'popularity':
        sorted.sort((a, b) => {
          const ordersA = popularityData[a._id] || 0;
          const ordersB = popularityData[b._id] || 0;
          return ordersB - ordersA; // Sort by number of orders in descending order
        });
        break;
      default:
        break;
    }
    setFilteredProducts(sorted);
    setSortBy(sortType);
  };

  useEffect(() => {
    if (collData) {
      // console.log(collData);
      
      setCollections(collData)
    }
  }, [collData])


  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = productData?.filter(product =>
      (product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.name.toLowerCase().includes(query.toLowerCase())) &&
      (!showInStock || product.stock > 0) &&
      (!showFeatured || product.featured === true)
    );
    setFilteredProducts(filtered);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    const filtered = productData.filter(product =>
      product.salePrice >= newValue[0] && product.salePrice <= newValue[1]
    );
    setFilteredProducts(filtered)
  };

      // Custom content component for the toast
      const ToastContent = ({ title, message }) => (
        <div>
            <strong>{title}</strong>
            <div>{message}</div>
        </div>
    );
    

    // Show toast notification function
const showToast = (message, type = "success") => {
  if (type === "success" && message) {
      toast.success(
          type && <ToastContent title={"SUCCESS"} message={message} />,
          {
              icon: <FaCheckCircle className="text-[20px]" />,
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              className: "custom-toast-success",
              bodyClassName: "custom-toast-body-success",
              progressClassName: "custom-progress-bar-success",
          }
      );
  } else if (message) {
      toast.error(<ToastContent title={"ERROR"} message={message} />, {
          icon: <FaExclamationTriangle className="text-[20px]" />,
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          className: "custom-toast",
          bodyClassName: "custom-toast-body",
          progressClassName: "custom-progress-bar",
      });
  }
};

  

  return (
    <>
    <ToastContainer title="Error" position="bottom-left" />
    <div className="w-[96%] h-full bg-[#f2f2f2]">
      <div className=" mix-blend-screen absolute w-full h-full"></div>
      <div className="w-full h-full backdrop-blur-3xl pr-40">
        <div className="w-full h-full  overflow-y-scroll flex">
          {/* Filter Sidebar */}

          <div className="w-[400px] h-full pr-6 mr-6 bg-[#899a9015]">
            <div className="h-full bg-[#ffffff20] backdrop-blur-md  p-6 px-20 overflow-scroll pb-40">
              <h2 onClick={() => getAllCollection()} className="text-[30px] mt-8 font-bold mb-6">Filters</h2>

              {/* View Options */}
              <div className="mb-6">
                <h3 className="text-[20px] opacity-45 font-medium mb-4">View Options</h3>
                <div className="flex flex-col gap-3">
                  <label className="category-label">
                    <input
                      type="radio"
                      name="viewOption"
                      checked={showProducts}
                      onChange={() => {
                        setShowProducts(true);
                        setShowCollections(false);
                      }}
                      className="category-radio"
                    />
                    Show Products
                  </label>
                  <label className="category-label">
                    <input
                      type="radio"
                      name="viewOption"
                      checked={showCollections}
                      onChange={() => {
                        setShowProducts(false);
                        setShowCollections(true);
                      }}
                      className="category-radio"
                    />
                    Show Collections
                  </label>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-[20px] opacity-45 font-medium mb-4">Categories</h3>
                <div className="flex flex-wrap gap-4">{categories.map((category, index) => (
                    <label key={index} className="category-label">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="category-radio"
                      />
                      {category}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className={`mb-6 ${!showProducts ? 'opacity-35' : 'opacity-100'}`}>
                <h3 className="text-[20px] opacity-45 font-medium mb-8 mt-8">Price Range</h3>
                <div className="px-2">
                  <RangeSlider
                    value={priceRange}
                    onChange={value => handlePriceChange(null, value)}
                    min={10}
                    max={2500}
                    step={250}
                    disabled={!showProducts}
                    progress
                    className="py-4"
                    graduated
                    renderMark={mark => {
                      if ([10, 500, 1000, 1500, 2000, 2500].includes(mark)) {
                        return `₹${mark}`;
                      }
                      return null;
                    }}
                    tooltip={false}
                  />
                  <div className="flex justify-between mt-6">
                    <input 
                      type="number" 
                      value={priceRange[0]} 
                      disabled={!showProducts}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setPriceRange([0, priceRange[1]]);
                          return;
                        }
                        const newValue = parseInt(value);
                        if (newValue <= priceRange[1]) {
                          setPriceRange([newValue, priceRange[1]]);
                          handlePriceChange(null, [newValue, priceRange[1]]);
                        }
                      }}
                      className="w-24 px-4 py-2 rounded-[10px] bg-[#3f6b5130] text-black outline-none text-center"
                      min={10}
                      max={priceRange[1]}
                    />
                    <input 
                      type="number" 
                      value={priceRange[1]} 
                      disabled={!showProducts}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setPriceRange([priceRange[0], 0]);
                          return;
                        }
                        const newValue = parseInt(value);
                        if (newValue >= priceRange[0] && newValue <= 2500) {
                          setPriceRange([priceRange[0], newValue]);
                          handlePriceChange(null, [priceRange[0], newValue]);
                        }
                      }}
                      className="w-24 px-4 py-2 rounded-[10px] bg-[#3f6b5130] text-black outline-none text-center"
                      min={priceRange[0]}
                      max={2500}
                    />
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div className="mb-6">
                <h3 className="text-[20px] opacity-45 font-medium mb-8 mt-8">Sort by</h3>
                {  
                <span className={`${!showProducts ? 'opacity-35' : 'opacity-100'}`}>

                <label className="category-label flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    checked={showInStock}
                    disabled={!showProducts}
                    onChange={(e) => {
                      setShowInStock(e.target.checked);
                      const filtered = productData?.filter(product =>
                        (!e.target.checked || product.stock > 0) &&
                        (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        product.category.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      );
                      setFilteredProducts(filtered);
                    }}
                    className="category-checkbox"
                  />
                  Show In-Stock Only
                </label>

                <label className="category-label flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    checked={showFeatured}
                    disabled={!showProducts}
                    onChange={(e) => {
                      setShowFeatured(e.target.checked);
                      const filtered = productData?.filter(product =>
                        (!showInStock || product.stock > 0) &&
                        (!e.target.checked || product.featured === true) &&
                        (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        product.category.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      );
                      setFilteredProducts(filtered);
                    }}
                    className="category-checkbox"
                  />
                  Show Featured Only
                </label>
                </span>
                }
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  className="w-full px-4 py-2 bg-[#809e8c] custom-selectero text-white rounded-[10px] focus:outline-none"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                  <option value="date-asc">Date (Oldest First)</option>
                  <option value="date-desc">Date (Newest First)</option>
                  <option value="popularity">Popularity</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 pt-16">
            {/* Search input */}
            <div className="relative w-3/4 mb-10">
              <div className="search-container relative mb-6">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    const filtered = productData.filter(product =>
                      product.name.toLowerCase().includes(e.target.value.toLowerCase())
                    );
                    setFilteredProducts(filtered);
                  }}
                  className="search-input bg-white/10 border border-[#8aa595]rounded-lg py-3 px-5 w-full text-[#14532d] text-base transition-all duration-300 ease-in-out hover:bg-white/15 focus:bg-white/20 focus:border-[#52aa57] focus:shadow-lg outline-none placeholder:text-[#14532d]/60"
                />
                <FiSearch className="search-icon absolute right-5 top-1/2 transform -translate-y-1/2 text-[#8aa595] transition-all duration-300 ease-in-out hover:text-[#52aa57]"></FiSearch>
              </div>
            </div>

            {/* Products Grid */}
            {showProducts && (
              <div className="w-full h-auto flex my-5 gap-5 relative flex-wrap product-grid">
                {filteredProducts.map((product) => ((product?.category?.name.toLowerCase() === selectedCategory.toLowerCase() || selectedCategory === 'All Categories' || selectedCategory === 'all') &&
                  <div key={product._id} className="animate-card">
                    <ProductCard key={product._id} showToast={showToast} product={product} navigate={navigate} userData={userData} />
                  </div>
                ))}
              </div>
            )}

            {/* Collections Grid */}
            {showCollections && (
              <div className="w-full h-auto flex my-5 gap-8 relative flex-wrap product-grid">
                {collections.map((collection, index) => ( (collection?.category?.name.toLowerCase() === selectedCategory.toLowerCase() || selectedCategory === 'All Categories' || selectedCategory === 'all') &&
                  <div key={index} className="animate-card">
                    <CollectionCard type={'collection'} data={collection} pos={index} />
                  </div>
                ))}
              </div>
            )}

              {!showProducts && filteredProducts.length !== 0 &&
              <div className="mb-8 flex gap-4 ml-4 text-[18px] absolute bottom-0 right-20">
                <span className='flex gap-3 items-center'>
                  <div className="h-4 w-4 bg-[#89a494] rounded-full"></div>
                  <p>In stocking</p>
                </span>
                <span className='flex gap-3 items-center'>
                  <div className="h-4 w-4 bg-[#d27876] rounded-full"></div>
                  <p>Out of stock</p>
                </span>
                <span className='flex gap-3 items-center'>
                  <div className="h-4 w-4 bg-[#cda686] rounded-full"></div>
                  <p>Featured</p>
                </span>
            
              </div>}

            {/* No Results Message */}
              {showProducts && filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="flex flex-col gap-2">
                  <img className="w-[30%] mx-auto filter-[brightness(0)]" src='/bag-cross-1.svg' alt="No categories" />
                    <h1 className="text-[30px] font-bold">Sorry no products!</h1>
                    <p className="opacity-45 text-[18px]">
                      We cant find the product,check internet or <br />
                      make sure you typed the product name correctly
                      <br/>and try again, if you think this is a mistake
                    </p>

                  </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};


function ProductCard({ navigate, product, userData, showToast }) {

  const [addtoCart, { error: addError, data: addData }] = useAddtoCartMutation()
  const [checkPorductInCart, { data: checkData }] = useCheckPorductInCartMutation();
  const [gotoCart, setGoToCart] = useState(false);
  const [addToBookmark, { data: addToBookmarkData }] = useAddToBookmarkMutation();
  const [checkItemIntheBookmark, { data: bookMarkData }] = useCheckItemIntheBookmarkMutation();
  const [removeBookmarkItme, { data: removeData }] = useRemoveBookmarkItmeMutation();



    // const [dPopup,setDPopup] = useState(false);
    const [isMared,setMarked] = useState(false);
    const [isUnmarked,setUnMarked] = useState(false);
  
    useEffect(()=>{ checkItemIntheBookmark(product._id) },[])
    useEffect(()=>{ if(addToBookmarkData){ setMarked(true) } },[addToBookmarkData])
    useEffect(()=>{ if(bookMarkData){ setMarked(true)  } },[bookMarkData])
    useEffect(()=>{ if(removeData){ setMarked(false)  } },[removeData])

  useEffect(() => {
    if (addData) {
        setGoToCart(true)
        showToast(addData, 'success')
    }
}, [addData])

// useEffect(()=>{
//   console.log(checkData)
// },[checkData])


  useEffect(() => {
    if (product&&userData?._id) {
      // alert('jh')
        checkPorductInCart(product?._id)
    };
}, [product]);

  const addToCartItem = (id) => {

    const userId = userData._id
    const cartData = {
        quantity: product?.quantity>1000?1000:500,
        product: id,
    }
    addtoCart({ cartData, userId })
  }

  const handleAddToCart = (e) => {
   e.stopPropagation()
  //  console.log(checkData)
   if(checkData||gotoCart){
     navigate('/user/Cart')
    }else{
     addToCartItem(product._id)
   }
  }

  const bookmarkHandler = (e,id,action) => {
    e.stopPropagation()
    if(action==='remove'){

      removeBookmarkItme(id)

    }else if(action==='add'){

      const userId = userData._id

      const bookmarkData = {
          user: userData._id,
          product: id,
      }
      addToBookmark({ bookmarkData, userId })
    }

  }
  
  return (
    <div onClick={()=> navigate('/user/productPage',{ state:{ id:product._id } })} className="h-80 min-w-56 max-w-56 flex flex-col justify-center items-center rounded-[40px] relative group cursor-pointer">
      { userData?._id &&
        <i onClick={(e)=> isMared?bookmarkHandler(e,product._id,'remove'):bookmarkHandler(e,product._id,'add')} className={` ri-bookmark-${isMared?'fill':'line'} absolute top-28 right-0 rounded-full p-5 text-[30px] hover:scale-125 duration-500 `}></i>
      }
    <img className="max-w-[120px] h-[120px] w-[120px] object-cover max-h-[120px] oscillater mix-blend-darken drop-shadow-2xl z-20" src={product.pics.one} alt={product.name} />
    <img className="px-0 max-w-[80px] shadowed opacity-20 absolute" src={product.pic} alt="" />
    <span className="w-full h-auto bg-[linear-gradient(#ffffff40,#ffffff70)] flex flex-col px-10 rounded-t-[30px] rounded-bl-[30px] rounded-br-[120px] pt-10 flex-1 justify- gap-2 pb-10">
      <span className="mt-2">
        <h1 className="text-[28px] font-medium">{product.name}</h1>
        <span className="flex flex-col">
          <s>
            <p className="opacity-30">₹ {product.regularPrice}</p>
          </s>
          <p className={`opacity-60 text-[25px]  font-bold ${product?.stock>0?'text-[#14532d]':'text-red-600'}`}>
            ₹ {product.salePrice}
          </p>
          <p className={`${product?.stock>0?'text-[#14532d]':'text-red-900'} font-medium text-[17px] opacity-55`}>{product?.stock>0?(product.stock/1000).toFixed(0):'Out of Stock'}{product?.stock>1000?" Kg left":product?.stock>0?" g":""}</p>
        
        </span>
      </span>
      { userData?._id && product?.stock>0 ?
      <button onClick={handleAddToCart} className={`flex justify-start items-center font-bold rounded-full text-white absolute bottom-0 right-3 ${product?.featured&&product?.stock>0?'bg-[linear-gradient(#f8982f,#789985)]':product?.stock>0?'bg-[linear-gradient(#b4c2ba,#789985)]':'bg-[linear-gradient(45deg,#e07373,#ad867c)]'} overflow-hidden w-[70px] h-[70px] group-hover:scale-125 duration-500`}>
        <i className="ri-shopping-bag-line font-thin rounded-full min-w-[70px] text-[25px] group-hover:-translate-x-full duration-500"></i>
        { !product?.stock>0?
          <i className="ri-arrow-right-line rounded-full min-w-[70px] text-[25px] group-hover:-translate-x-full duration-500"></i>:
          <i className="ri-shopping-cart-line rounded-full min-w-[70px] text-[25px] group-hover:-translate-x-full duration-500"></i>
        }
      </button>:
      <button className={`flex justify-start items-center font-bold rounded-full text-white absolute bottom-0 right-3 ${product?.featured&&product?.stock<=0?'bg-[linear-gradient(#f8982f,#d47875)]':product?.stock>0?'bg-[linear-gradient(#b4c2ba,#789985)]':'bg-[linear-gradient(45deg,#e07373,#ad867c)]'} overflow-hidden w-[70px] h-[70px] group-hover:scale-125 duration-500`}>
      <i className="ri-shopping-bag-line font-thin rounded-full min-w-[70px] text-[25px] group-hover:-translate-x-full duration-500"></i>
      <i className="ri-arrow-right-line rounded-full min-w-[70px] text-[25px] group-hover:-translate-x-full duration-500"></i>
    </button>
      }
    </span>
    
  </div>);
}

export default Search;