import React, { useEffect, useState } from "react";
import BookmarkCard from "../../../parts/Cards/Bookmarks";
import { useAddtoCartMutation, useCheckPorductInCartMutation, useGetBookmarkItemsMutation } from "../../../../services/User/userApi";
import EmptyState from "../../../parts/Main/EmptySatate";
import { useNavigate } from "react-router-dom";
import ImageUploadPopup from "../../../parts/popups/ImageUploadPopup";
import HoverKing from "../../../parts/buttons/HoverKing";

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
      <p className="text-lg font-medium text-gray-600">Loading your orders...</p>
    </div>
  </div>
);


export default function Bookmark({userData}) {

  const [ getBookmarkItems,{ data,isLoading } ] =  useGetBookmarkItemsMutation()

  const [bookData,setBookData] = useState([])


  const navigate = useNavigate()


  if(isLoading){ return <LoadingAnimation /> }

  useEffect(()=>{
    if(data){
      setBookData(data?.items)
    }
  },[data])

  useEffect(() => {
    (async () => {
      await getBookmarkItems().unwrap();
    })(); 
  },[])

  if (isLoading) return <LoadingAnimation />;


  return (
    <>
    <div className="w-[96%] h-full bg-[#f2f2f2]">
      <div className=" mix-blend-screen absolute w-full h-full"></div>
      <div className="w-full h-full px-0 backdrop-blur-3xl">
        <div className="w-full h-full pt-16 overflow-y-scroll px-40">
          {/* Main head */}
          { bookData?.length > 0 && <h1 className="text-[35px] font-bold">Favorites</h1>}
          {bookData?.length?<p className="opacity-45 translate-y-[-9px] text-[20px] font-mono">{bookData?.length} totel items</p>:''}

          {/* menu navigator */}
          { bookData?.length > 0?
          <>
          <div className="flex gap-8 text-[20px] my-10 mb-5 font-[500] relative py-3 items-center">
            <p className="mt-3">All</p>
            <p className="opacity-45">Fruits</p>
            <p className="opacity-45">Vegetables</p>
            <p className="opacity-45">Collections</p>
            <div className="w-8 h-1 bg-black absolute bottom-0"></div>
          </div>

            {/* the list of bookmarks */}
            <div className="w-full mt-10 h-full flex flex-wrap gap-6">
              {
                bookData?.map((item, index) => {
                  return <BookmarkCard userData={userData} setBookData={setBookData} data={item} key={index} col={true} />;
                })
              }
            </div>
          </>
            :
            

              <div className="w-full h-[60vh] flex items-center mt-20 pr-20 justify-center flex-col text-center gap-5 relative">
                <img className="h-[80%] filter-[brightness(0)]" src='/heart-remove.svg' alt="No categories" />
                <div className="flex flex-col gap-2">
                  <h1 className="text-[30px] font-bold">Sorry, No Favorites</h1>
                  <p className="opacity-45 text-[18px]">
                    Add your favorite to  products,<br></br> You can quickly aceess the products
                  </p>
                  {/* <p onClick={() => navigate("/user/products")} className="text-[20px] text-blue-600 font-medium"></p> */}
                  <HoverKing event={() => navigate("/user/products")} styles={'fixed bottom-36 left-1/2 -translate-x-[65%] rounded-full border-0 font-medium text-[16px] bg-white'} Icon={<i className="ri-arrow-drop-right-line text-[50px] text-white"></i>} >Let's add your product</HoverKing>
                </div>
              </div>

          }

        </div>
      </div>
    </div>
    </>
  );
}
