import { Order } from './../../../parts/Cards/Order';
import React, { useEffect, useState } from "react";
import { useDeleteAddressMutation, useGetOdersMutation } from "../../../../services/User/userApi";
import emptyStateImage from "../../../../assets/images/noCAtegory.png";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import HoverKing from '../../../parts/buttons/HoverKing';

const OrderList = ({userData}) => {
  const [ getOders, { isLoading, error, data }, ] = useGetOdersMutation();
  const [orders,setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(()=>{ if(userData){ getOders(userData._id) } },[userData]);

  useEffect(()=>{ 
    if(data){ 
      setOrders( datas =>
        [...data].sort((a, b) => {
          const dateA = new Date(a.time);
          const dateB = new Date(b.time);
          return dateB - dateA;
        })
      )  
    }
  },[data]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case "PROCESSED":
        return "bg-[linear-gradient(45deg,#7082b4_30%,#738c7c)]";
        case "SHIPPED":
        return "bg-[linear-gradient(45deg,#ebaf8a,#738c7c)]";
      case "PENDING":
        return "bg-[linear-gradient(45deg,#ebe88a,#738c7c)]";
      case "DELIVERED":
        return "bg-[linear-gradient(45deg,#99eb8a,#738c7c)]";
      case "CANCELLED":
        return "bg-[linear-gradient(45deg,#eb8ab9,#738c7c)]";
      default:
        return "bg-gray-50";
    }
  };

  const getStatusTextColor = (status) => {
    switch (status.toUpperCase()) {
      case "PROCESSED":
        return "text-blue-900";
      case "SHIPPED":
        return "text-orange-700";
      case "DELIVERED":
        return "text-green-700";
      case "CANCELLED":
        return "text-red-700";
      default:
        return "text-yellow-900";
    }
  };

  const EmptyState = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[90vh] flex items-center justify-center flex-col text-center gap-5"
    >
      <motion.img salu
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 100,
          damping: 10
        }}
        className="h-[50%]" 
        src={'/box-remove.svg'} 
        alt="No categories" 
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col gap-2"
      >
        <motion.h1 
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="text-[30px] font-bold"
        >
          No Orders
        </motion.h1>
        <motion.p 
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1 }}
          className="opacity-45 text-[18px]"
        >
          Now your order list empty, to make the order buy products<br/>
          and make your life healthy and natural with us
        </motion.p>
        <HoverKing event={() => navigate("/user/products")} styles={'fixed bottom-36 left-1/2 -translate-x-[45%] rounded-full border-0 font-medium text-[16px] bg-white'} Icon={<i className="ri-arrow-drop-right-line text-[50px] text-white"></i>} >Let's add your product</HoverKing>

      </motion.div>
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full w-full max-w-[96%] flex bg-[#f2f2f2]"
    >
      <motion.div 
        initial={{ backdropFilter: "blur(0px)" }}
        animate={{ backdropFilter: "blur(8px)" }}
        transition={{ duration: 0.5 }}
        className="w-full h-full px-40 backdrop-blur-3xl overflow-hidden"
      >
        {orders.length > 0 ? (
          <motion.main 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="pt-8 h-full overflow-y-auto pb-20"
          >
            <motion.h1 
              variants={headerVariants}
              className="text-[42px] font-bold top-0 backdrop-blur-md p-4 z-10 font-[lufga]"
            >
              Manage your orders
            </motion.h1>
            <p className='pr-96 text-[18px] mb-8 ml-5 opacity-55'>Effortlessly track and manage your orders in one place.
              Stay updated with real-time order status and notifications.
              Access your order history and easily reorder items.
              Enjoy a seamless shopping experience with Green Grocer!</p>

            <div className="mb-8 flex gap-4 ml-4 text-[16px] absolute bottom-0 right-20">
              <span className='flex gap-3 items-center'>
              <div className="h-4 w-4 bg-[#c9ce86] rounded-full"></div>
              <p>Pending</p>
              </span>
              <span className='flex gap-3 items-center'>
              <div className="h-4 w-4 bg-[#7082b4] rounded-full"></div>
              <p>Processed</p>
              </span>
              <span className='flex gap-3 items-center'>
              <div className="h-4 w-4 bg-[#cda686] rounded-full"></div>
              <p>Shipped</p>
              </span>
              <span className='flex gap-3 items-center'>
              <div className="h-4 w-4 bg-[#8ecf86] rounded-full"></div>
              <p>Delivered</p>
              </span>
              <span className='flex gap-3 items-center'>
              <div className="h-4 w-4 bg-[#cc8ba9] rounded-full"></div>
              <p>Cancelled</p>
              </span>
            </div>

            <motion.div 
              variants={containerVariants}
              className="flex flex-wrap gap-3"
            >
              <AnimatePresence>
                {orders?.map((order, index) => (
                  <motion.div
                    key={order.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Order 
                      order={order}
                      navigate={navigate}
                      index={index}
                      getStatusColor={getStatusColor}
                      getStatusTextColor={getStatusTextColor}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.main>
        ) : (
          <EmptyState />
        )}
      </motion.div>
    </motion.div>
  );
};

export default OrderList;
