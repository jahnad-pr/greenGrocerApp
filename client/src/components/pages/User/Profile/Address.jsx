import React, { useEffect, useState } from "react";
import home from "../../../../assets/images/Adress icons/home.png";
import work from "../../../../assets/images/Adress icons/bag.png";
import person from "../../../../assets/images/Adress icons/person.png";
import other from "../../../../assets/images/Adress icons/other.png";
import { useDeleteAddressMutation, useGetAdressesMutation } from "../../../../services/User/userApi";
import HoverKing from "../../../parts/buttons/HoverKing";
import { useLocation, useNavigate } from "react-router-dom";
import emptyStateImage from "../../../../assets/images/noCAtegory.png";
import DeletePopup from "../../../parts/popups/DeletePopup";
import { showToast } from "../../../parts/Toast/Tostify";


const EmptyState = () => {
  const navigate = useNavigate()
  return (
  <div className="w-full h-[60vh] flex items-center pr-20 justify-center mt-36 flex-col text-center gap-5 relative">
      <img className="h-[80%] filter-[brightness(0)]" src='/receipt.svg' alt="No categories" />
      <div className="flex flex-col gap-2">
        <h1 className="text-[30px] font-bold">No address addes yet!</h1>
        <p className="opacity-45 text-[18px]">
          Add your products to cart for buy the products,<br></br> You can buy many products in one order
        </p>
        {/* <p onClick={() => navigate("/user/products")} className="text-[20px] text-blue-600 font-medium"></p> */}
        <HoverKing  event={() => navigate('/user/profile/manageaddress')} styles={'fixed bottom-36 left-1/2 -translate-x-[65%] rounded-full border-0 font-medium text-[16px] bg-white'} Icon={<i className="ri-apps-2-add-line text-[30px] "></i>} >Let's add address</HoverKing>
      </div>
    </div>
)};


export default function Address({ userData }) {

  // mutation to update user
  const [getAdresses, { isLoading, error, data },] = useGetAdressesMutation();


  const [adressData, setaddressData] = useState()


  const navigate = useNavigate()
  const location = useLocation()

  useEffect(()=>{
    console.log(location.state);
    // alert('address added successfully')
    if(location?.state?.data){
      showToast(location?.state,'success')
    }
  },[location])
  // useEffect(() => {
  //   console.log('Location state:', location?.state);
  //   if(location?.state?.items && adressData?.length > 0){
  //     navigate('/user/ordersummery',{ state: location?.state })
  //   }
  // },[location,adressData]);

  // Custom content component for the toast

  // to show the error and success
  useEffect(() => {
    if (data) {
      setaddressData(data)
    }
  }, [data])
  useEffect(() => showToast(error?.data, 'error'), [error])
  getAdresses

  useEffect(() => { (async () => { if (userData) { await getAdresses(userData?._id) } })() }, [userData])

  return (userData &&
    <> 
      {/* <ToastContainer title="Error" position="bottom-left" /> */}
      <div className="w-[96%] h-full">
        {/* <div className="bg-[#5a52319c] mix-blend-screen absolute w-full h-full"></div> */}
        <div className="w-full h-full flex flex-col items-center gap-5 backdrop-blur-3xl">
          <span className="w-full h-full px-64 bg-[#ffffff81] relative  overflow-scroll pb-96">

          {adressData?.length > 0 &&
          <div className="mb-8 flex gap-4 ml-4 text-[16px] absolute bottom-0 right-20">
              <span className='flex gap-3 items-center'>
              <div className="h-4 w-4 bg-[#4e9c1a] rounded-full"></div>
              <p>Home</p>
              </span>
              <span className='flex gap-3 items-center'>
              <div className="h-4 w-4 bg-[#c13a3a] rounded-full"></div>
              <p>Work</p>
              </span>
              <span className='flex gap-3 items-center'>
              <div className="h-4 w-4 bg-[#2831b0] rounded-full"></div>
              <p>Person</p>
              </span>
              <span className='flex gap-3 items-center'>
              <div className="h-4 w-4 bg-[#9e9120] rounded-full"></div>
              <p>Other</p>
              </span>
            </div>}

            {adressData?.length > 0 && <HoverKing event={() => navigate('/user/profile/manageaddress')} styles={'fixed text-[18px] font-bold text-white/50 bottom-28 right-64 rounded-full'} Icon={<i className="ri-apps-2-add-line text-[30px] "></i>} >Add address</HoverKing>}

            {/* Head */}
            {adressData?.length > 0 &&<h1 className="text-[35px] font-bold my-16 mb-8">Manage Address</h1>}

            {adressData?.length > 0 ?

              // {/* address container */}
              <div className="w-full flex flex-wrap gap-12">

                {
                  adressData?.map((address, index) => {

                    return <span key={index} >
                      <AdressCard setaddressData={setaddressData} showToast={showToast} addressData={adressData} home={home} work={work} person={person} other={other} address={address} navigate={navigate} />
                    </span>

                  })
                }

              </div> : <EmptyState />



            }



          </span>
        </div>
      </div>
    </>
  );
}

function AdressCard({ home, work, person, other, address, phone, navigate, showToast, addressData, setaddressData }) {

  const [deleteAddress, { data },] = useDeleteAddressMutation();
  const [popup, showPopup] = useState(false);


  useEffect(() => {
    if (data) {
      showToast(data, 'success')
      setaddressData(addressData.filter((item) => item._id !== address._id))
    }
  }, [data])


  return (
    <> {popup && (
      <DeletePopup
        updater={deleteAddress}
        deleteData={{ id: address._id }}
        showPopup={showPopup}
        action="Delete Address"
        isUser={true}
      />
    )}
      <div onClick={() => navigate('/user/profile/manageaddress', { state: address })}
        className="w-[330px] h-[260px] hover:scale-105 duration-500 mt-5 pt-16 bg-gradient-to-b from-[#dcdcdc50] to-[#d9d9d930] rounded-[30px] rounded-tl-[120px] flex flex-col p-10 py-4 gap-5 relative group">

        <span className="flex  items-center gap-3">
          <img className={`w-20  group-hover:scale-125 duration-500 absolute -left-2 -top-5 ${address.locationType === 'Work' ? 'p-1' : ''}`} src={address.locationType === 'Home' ? '/home.svg' : address.locationType === 'Work' ? '/buildings.svg' : address.locationType === 'Person' ? '/user-tag.svg' : address.locationType === 'Other' ? '/location.svg' : ''} alt="" />
          <p className={`text-[50px] ${address.locationType === 'Work' ? 'text-[#ff0000]' : address.locationType === 'Home' ? 'text-[#1c7721]' : address.locationType === 'Person' ? 'text-[#0d32e9]' : address.locationType === 'Other' ? 'text-[#706e1b]' : ''} absolute font-bold mb-2 ml-14 top-0 right-5 group-hover:-translate-x-10 duration-500 opacity-25 group-hover:opacity-60`}>{address.locationType}</p>
      
        </span>


        <span className="text-[17px] leading-none opacity-65">
          <p className="">{address.FirstName} {address.LastName}</p>
            <p>{address.exactAddress}</p>
            <p>{address.streetAddress}</p>
            <p className="font-medium text-nowrap">{address.city.toUpperCase()}, {address.state.toUpperCase()} {address.pincode}</p>
        </span>

        <span>
          <p className="font-medium text-[18px] font-mono text-[#6c8073]"><span>+91</span> {address?.phone}</p>
        </span>

        <span className="flex absolute right-5 bottom-5 justify-end gap-5">
        {/* <i className="ri-eye-line text-[30px] opacity-45"></i> */}
        {/* <img className="w-[28px]" src="/edit.svg" alt="" /> */}
        <img
            onClick={(e) => { e.stopPropagation(); showPopup(true) }}  
            className="w-[32px] filter brightness-100 hover:scale-125 duration-500 saturate-100 hue-rotate-[0deg]" 
            src="/trash.svg" 
            alt="" 
          />
          {/* <i className="ri-delete-bin-6-line text-[28px] hover:scale-125 duration-500 text-red-500"></i> */}
        </span>

      </div>
    </>
  );
}
