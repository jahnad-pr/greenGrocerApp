import React, { useEffect, useState } from 'react'
import List from '../../../../parts/Main/List'
import { useLocation, useParams } from 'react-router-dom';
import Product from '../../../../parts/Cards/Product';
import { useGetCollectionProductsMutation } from '../../../../../services/User/userApi';
import CollectionCard from '../../../../parts/Cards/Collection';

export default function ProductsAll() {

  const [productsData,setProducts] = useState()
  const location = useLocation()

  useEffect(()=>{
    console.log(location?.state);
    
      if(location?.state?.products){
        setProducts(location?.state?.products)
      }
  },[location])

  
  return (
    <div className='w-[96%] h-full bg-gray-100 bg-product'>
      <div className="bg-[#ffffff20] mix-blend-scree absolute w-full h-full backdrop-blur-3xl"></div>
        <div className="w-full h-full backdrop-blur-3xl px-40">
            <div className="w-full h-fullpt- 0 overflow-y-scroll">

                {/* fruit collection */}
                <span className='flex'>
           <h1 style={{whiteSpace:'pre-line'}} className={`text-[120px] mb-20 leading-none font-bold mt-20 font-['lufga']`}>
            {location?.state?.title?.replace(/ /g,'\n')}
          </h1>
          {/* <span className='flex-1'></span> */}
          {/* <img className='max-h-[300px] object-cover mr-40 py-5 drop-shadow-2xl' src={location?.state?.img} alt="" /> */}
                </span>
          <div className="w-full h-auto flex my-5 mt-8 gap-5 flex-wrap">
            {productsData?.map((data, index) => {
                if(true&&location?.state?.action==='collections'){
                  return <CollectionCard type={'product'} data={data} pos={index} />;
                }else{
                  return <Product type={'product'} data={data} pos={index} />;

                }
            })}
          </div>
            

            </div>
        </div>
    </div>
  )
}
