import React, { useEffect, useState } from "react";
import MianList from "../../../parts/Main/MianList";
import Carts from "../../../parts/Cards/Carts";
import { useGetCartItemsMutation } from "../../../../services/User/userApi";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import HoverKing from "../../../parts/buttons/HoverKing";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export default function Cart() {
  const [getCartItems, { data, isLoading }] = useGetCartItemsMutation();
  const navigate = useNavigate();
  const [productsData, setProductData] = useState([]);
  const [totelAmount, setTotelAmount] = useState([]);

  // Previous code remains the same until the return statement

  const LoadingAnimation = () => (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-24 h-24">
          <div className="absolute w-full h-full border-8 border-gray-200 rounded-full"></div>
          <div className="absolute w-full h-full border-8 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
        <p className="text-lg font-medium text-gray-600">Loading your cart...</p>
      </div>
    </div>
  );

  return (
    <>
      <ToastContainer title="Error" position="bottom-left" />
      <div className="md:w-[96%] w-full h-full bg-[#f2f2f2]">
        {isLoading ? (
          <LoadingAnimation />
        ) : (
          <div className="w-full h-full">
            <div className="w-full h-full pt-16 overflow-y-scroll relative">
              {totelAmount > 0 && (
                <p className="absolute right-12 top-12 xl:right-48 text-[48px] xl:top-28 font-bold leading-none text-center font-mono">
                  ₹{totelAmount} <br />
                  <span className="text-[18px] relative top-[-20px] opacity-45">Total amount</span>
                </p>
              )}
              {productsData?.length > 0 && <h1 className="text-[35px] font-bold xl:px-40 md:px-16 px-12">Carts</h1>}
              {productsData?.length > 0 && (
                <p className="opacity-45 text-[20px] font-mono translate-y-[-5px] xl:px-40 md:px-16 px-12">
                  {productsData?.length} total items
                </p>
              )}
              {productsData?.length > 0 ? (
                <div className="w-full xl:px-40 md:px-16 px-12 mt-12 flex gap-8">
                  {productsData?.map((item, index) => (
                    <Carts showToast={showToast} key={index} index={index} setProductData={setProductData} data={item} />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )}
              {productsData.length > 0 && (
                <HoverKing
                  event={() =>
                    navigate("/user/ordersummery", {
                      state: { items: [...productsData?.map((data) => data)] },
                    })
                  }
                  styles="fixed bg-[red] md:bottom-20 md:right-40 bottom-[75%] opacity-65 text-[20px] md:22px -right-5 md:scale-100 scale-[.7] right-10 rounded-full font-medium"
                  Icon={<i className="ri-arrow-drop-right-line text-[50px] text-white"></i>}
                >
                  Continue
                </HoverKing>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}