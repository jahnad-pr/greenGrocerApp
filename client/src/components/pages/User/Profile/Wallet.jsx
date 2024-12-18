import React, { useEffect, useState } from "react";
import coin from "../../../../assets/images/gCoin.png";
import { toast } from "react-hot-toast";
import PaymentPopup from "../../../parts/popups/PaymentPopup";
import TransactionDetailsPopup from "../../../parts/popups/TransactionDetailsPopup";
import "./Wallet.css";
import { useGetUserTransactionsMutation } from "../../../../services/User/userApi";
import HoverKing from "../../../parts/buttons/HoverKing";

export default function Wallet({userData}) {

  const [getUserTransactions, { data } ] = useGetUserTransactionsMutation([]);

  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [amount, setAmount] = useState()
  const [popData, setPopData] = useState({})
  const [transactions, setTransactions] = useState([])

  useEffect(()=>{ if(userData){setAmount(userData?.wallet?.amount)} },[userData])
  useEffect(()=>{ 
    if(data){
      const sortedTransactions = [...data].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setTransactions(sortedTransactions);
    } 
  },[data])
  useEffect(()=>{getUserTransactions()},[])

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Function to get status color
  const getStatusColor = (status) => {
    const colors = {
      completed: 'text-green-600',
      pending: 'text-yellow-600',
      failed: 'text-red-600',
      cancelled: 'text-gray-600'
    };
    return colors[status] || 'text-gray-600';
  };

  return (
    <div className="w-[96%] min-h-screen bg-[#f2f2f2] overflow-x-hidden">
      <div className="w-full h-full px-4 md:px-20 lg:px-80 flex flex-col items-center gap-5 fade-in">
        {/* Head */}
        {transactions?.length > 0 &&<h1 className="text-[35px] font-bold my-10 mt-16 slide-down">Wallet and Coin </h1>}

        {/* coin config */}
        <div className="w-full h-56 flex py-10 gap-10 items-center justify-center duration-500">
          {/* statics */}
          {transactions?.length > 0 &&
          <div className="h-full w-[50%] pl-28 bg-[linear-gradient(45deg,#ffde97,#eae4e3)] rounded-[30px] rounded-tl-[120px] duration-500 hover:mx-10 scale-125 hover:scale-[140%] flex gap-10 items-center py-5 px-10 relative slide-right">
            {/* coin count */}
            <img className="h-1/2 absolute top-0 left-0 rotate-in" src={coin} alt="" />
            <div className="">
              <p className="text-[35px] font-bold leading-none">
                {String((amount?.toFixed(2) || 0) * 10).padStart(2, '0')}
              </p>
              <p className="translate-y-[-10px] opacity-45">Coins</p>
            </div>
            {/* indian conversion */}
            <div className="flex gap-5 items-center">
              <p className="text-[35px] text-gray-500">
                ₹<span className="font-bold text-black">{amount?.toFixed(2)||0}</span>
              </p>
              <p className="leading-none font-medium opacity-45">
                Indian
                <br />amo
                rupees
              </p>
              <p className="absolute text-[130px] right-10 opacity-5">₹</p>
            </div>
          </div>}

          {/* add coin */}
          {transactions?.length > 0 &&
          <div 
            onClick={() =>( setPopData({}) , setShowPaymentPopup(true))}
            className="h-full w-[30%] bg-[linear-gradient(45deg,#d1811f80,#eae4e3)] hover:mx-28 duration-500 ml-16 hover:scale-125 relative overflow-hidden py-3 flex items-center rounded-[30px] cursor-pointer slide-left">
            <img className="h-1/2 mx-5 rotate-6 grayscale-[90%]" src={coin} alt="" />
            <p className="absolute text-[230px] top-[-95px] left-10 opacity-5">₹</p>
            <div className="">
              <p className="text-[35px] font-bold">Add Coin</p>
              <p className="translate-y-[-10px] opacity-45">buy coins by purchase</p>
            </div>
          </div>}
        </div>

        {/* History of transaction */}
        {transactions?.length > 0 && (
        <h1 className="text-[30px] font-bold my-5 mt-16 w-full fade-in-delay">
          Transaction History
        </h1>
        )}

        {/* table */}
        <div className="w-full mx-auto slide-up pb-40">
          <div className="rounded-lg pt-5">
            {/* Head row */}
            {transactions?.length > 0 && (
              <div className="sticky top-0 z-10 bg-[#f2f2f2]">
                <div className="grid grid-cols-6 gap-4 font-mono p-4 text-sm text-gray-900 mb-6 bg-gradient-to-r from-[#d1811f13] to-[#c9c1c031] px-10 rounded-[30px]">
                  <div className="text-[20px]">ID</div>
                  <div className="text-[20px]">Date</div>
                  <div className="text-[20px]">Description</div>
                  <div className="text-[20px]">Amount</div>
                  <div className="text-[20px]">Status</div>
                  <div className="text-[20px]">Method</div>
                </div>
              </div>
            )}

            {/* Items / rows */}
            {transactions?.length > 0 &&
            <div className="divide-y px-10 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 450px)', minHeight: '300px' }}>
              {transactions?.map((transaction, index) => (
                <div
                  key={transaction?.transaction_id}
                  onClick={() => setSelectedTransaction(transaction)}
                  className={`grid grid-cols-6 gap-4 p-4 text-sm hover:bg-gray-50/50 rounded-lg transition-colors table-row-animate delay-${index % 10} cursor-pointer`}
                >
                  <div className="text-gray-500 text-[16px] font-mono text-ellipsis overflow-hidden">
                    {transaction.transaction_id || 'N/A'}
                  </div>
                  <div className="text-gray-500 text-[16px]">
                    {formatDate(transaction.date)}
                  </div>
                  <div className="text-gray-900 text-[16px] text-wrap max-w-[100px] w-20 font-medium opacity-70">
                    <p className="text-ellipsis overflow-hidden">
                    {transaction.description || 'Wallet Transaction'}
                    </p>
                  </div>
                  <div className="text-gray-600 text-[16px] font-bold">
                    ₹{transaction.amount?.toLocaleString('en-IN') || '0'}
                  </div>
                  <div className={`text-[16px] font-medium capitalize ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </div>
                  <div className="text-gray-500 text-[16px] text-center">
                    {transaction?.payment_method || 'Razorpay'}
                  </div>
                </div>
              ))}

              {/* Empty state with illustration */}
            </div>}

              {!transactions?.length > 0 && (
                <div className="col-span-6 min-h-[10vh] text-center pb-16 flex flex-col items-center justify-center">
                  <img 
                    src={'/empty-wallet-remove.svg'} 
                    alt="Empty Wallet" 
                    className="w-96 h-96 mb-6 opacity-80 object-cover"
                  />
                  <h3 className="text-[30px] text-gray-800 mb-2">
                    No transactions yet!
                  </h3>
                  <p className="text-gray-600 opacity-55 mb-4 max-w-md mx-auto text-[18px]">
                    Start your journey by adding coins to your wallet. Purchase coins to unlock exclusive deals and make seamless transactions.
                  </p>
                  <HoverKing  event={() => setShowPaymentPopup(true)} styles={'fixed bottom-36 left-1/2 -translate-x-[15%] rounded-full border-0 font-medium text-[16px] bg-white'} Icon={<i className="ri-money-euro-circle-line text-[30px] "></i>} >Add coin now</HoverKing>

                  {/* <button 
                    onClick=
                    className="text-blue-600 font-bold text-lg hover:text-blue-700 transition-colors flex items-center gap-2"
                  >
                    <img src={coin} alt="coin" className="w-6 h-6" />
                    Add Coins Now
                  </button> */}
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Transaction Details Popup */}
      <TransactionDetailsPopup
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
        onRetry={(retryAmount,description,id) => {
          setPopData({amount:retryAmount,description:description,id:id})
            setShowPaymentPopup(true);
            setAmount(retryAmount);
        }}
      />

      {/* Payment Popup */}
      <PaymentPopup
        isOpen={showPaymentPopup}
        onClose={() => setShowPaymentPopup(false)}
        userData={userData}
        data={popData}
        setAmount={setAmount}
        setTransactions={setTransactions}
      />
    </div>
  );
}
