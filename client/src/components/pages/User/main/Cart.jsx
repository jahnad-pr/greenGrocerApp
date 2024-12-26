import React, { useEffect, useState } from "react";
import MianList from "../../../parts/Main/MianList";
import Carts from "../../../parts/Cards/Carts";
import { useGetCartItemsMutation } from "../../../../services/User/userApi";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import HoverKing from "../../../parts/buttons/HoverKing";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export default function Cart() {

  const [ getCartItems, { data } ] = useGetCartItemsMutation()
  const navigate = useNavigate()
  const [productsData,setProductData] = useState([])
  const [totelAmount,setTotelAmount] = useState([])

  useEffect(()=>{
    setTotelAmount(
      productsData.reduce((acc, item) => {
        return acc + item.product?.regularPrice * item.quantity/1000;
      }, 0)
    )
  },[productsData])

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


  useEffect(()=>{
    getCartItems()
  },[]) 


  useEffect(()=>{ if(data?.items){ setProductData(data?.items) } },[data])

  const EmptyState = () => (
    <div className="w-full  flex items-center md:pr-20 pb-24 justify-center flex-col text-center gap-5 relative">
      <img className="md:w-96 md:h-96 w-56 h-56 mb-6 filter-[brightness(0)]" src='/bag-cross.svg' alt="No categories" />
      <div className="flex flex-col gap-2">
        <h1 className="text-[30px] font-bold">Sorry, No Carts items</h1>
        <p className="opacity-45 text-[18px]">
          Add your products to cart for buy the products,<br></br> You can buy many products in one order
        </p>
        {/* <p onClick={() => navigate("/user/products")} className="text-[20px] text-blue-600 font-medium"></p> */}
        <HoverKing event={() => navigate("/user/products")} styles={'absolute md:bottom-0 md:left-1/2 bottom-0 left-1/2 md:-translate-x-[65%] -translate-x-[50%] rounded-full border-0 font-medium text-[16px] bg-white'} Icon={<i className="ri-arrow-drop-right-line text-[50px] text-white"></i>} >Let's add your product</HoverKing>
      </div>
    </div>
  );


  return (
    <>
    <ToastContainer title="Error" position="bottom-left" />
    <div className="md:w-[96%] w-full h-full bg-[#f2f2f2]">
      <div className="w-full h-full">
        <div className="w-full h-full  pt-16 overflow-y-scroll relative">
          {/* Main head */}
          {
          totelAmount > 0 &&
          <p className="absolute right-12 top-12 xl:right-48 text-[48px] xl:top-28 font-bold leading-none text-center font-mono"> ₹{totelAmount} <br /> <span className="text-[18px] relative top-[-20px] opacity-45">Totel amount</span> </p>
          }
          { productsData?.length > 0 && <h1 className="text-[35px] font-bold xl:px-40 md:px-16 px-12 ">Carts</h1>}
          { productsData?.length>0 && <p className="opacity-45 text-[20px] font-mono translate-y-[-5px] xl:px-40 md:px-16 px-12 ">{productsData?.length} totel items</p>}

          {/* the list of bookmarks */}
            { productsData?.length>0?
            <div className="w-full xl:px-40 md:px-16 px-12  0 mt-12 flex gap-8">

              {
                productsData?.map((item,index) => {
                  return <Carts showToast={showToast} index={index} setProductData={setProductData} data={item} />
                } )
              }

                {/* <Carts col={true} /> */}
            </div>:<EmptyState />
              
            }

            {/* <button className="absolute bottom-16 right-16 px-16 py-2 bg-[linear-gradient(to_left,#0bc175,#0f4586)] text-[20px] rounded-full text-white font-medium">Continue</button> */}
            { productsData.length>0 && <HoverKing event={()=>navigate("/user/ordersummery", { state: { items: [...productsData?.map( data=> data )], } })} styles={'fixed bg-[red] md:bottom-20 md:right-40  bottom-[75%] opacity-65 text-[20px]  md:22px -right-5 md:scale-100 scale-[.7] right-10 rounded-full font-medium '} Icon={<i className="ri-arrow-drop-right-line text-[50px]  text-white"></i>} >Continue</HoverKing>}

        </div>
      </div>
    </div>
    </>
  );
}
