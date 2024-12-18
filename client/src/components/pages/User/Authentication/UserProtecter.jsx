import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useGetUserMutation } from "../../../../services/User/userApi";


// ProtectedRoute component
export default function UserProtecter({ children }) { 

    const [getUser, { isLoading, error, data }] = useGetUserMutation();
    const [userData,setData] = useState(false)
    const navigater = useNavigate()
    const location = useLocation()

    // api to get userdata
    useEffect(()=>{ (async()=>{
         await getUser().unwrap()
    })() },[location])

    useEffect(()=>{
        if(location.pathname==='/user/signup'){
            if(data?.user.length>0){
                navigater('/user/home',{ state:{ message:'',userData:data?.user } })
            }
        }
        if(location.pathname.startsWith('/user/profile')){
            if(data?.user.length<=0){
                navigater('/user/home',{ state:{ message:'',userData:data?.user } })
            }
        }
    },[location,data])


    useEffect(()=>{ 
        if(!data?.verified&&data?.user.length>0){   
            navigater('/user/home',{ state:{ message:'your accound is blocked' } })
            setData(false)
        }else{
            setData(data?.user)
        }
     },[data])


     useEffect(()=>{
        if(error){
            setData(false)
        }
     },[error])

     if(Array.isArray(userData)){
        const sendData = userData[0]
         return React.cloneElement(children, { userData:sendData })
     }else{

         return React.cloneElement(children, { userData })
     }


}
