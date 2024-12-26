import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useGetUserMutation } from "../../../../services/User/userApi";

export default function UserProtecter({ children }) {
  const [getUser] = useGetUserMutation();
  const [userData, setData] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      // Only fetch if we don't have userData yet
      if (!userData) {
        try {
          const result = await getUser().unwrap();
          if (isMounted) {
            handleUserData(result);
          }
        } catch (error) {
          if (isMounted) {
            setData(false);
          }
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []); // Remove location dependency

  const handleUserData = (data) => {
    if (!data?.verified && data?.user.length > 0) {
      navigate('/user/home', { 
        state: { message: 'your account is blocked' },
        replace: true 
      });
      setData(false);
      return;
    }

    setData(data?.user);

    // Handle routing logic
    if (location.pathname === '/user/signup' && data?.user.length > 0) {
      navigate('/user/home', { 
        state: { message: '', userData: data?.user },
        replace: true
      });
    }
    
    if (location.pathname.startsWith('/user/profile') && data?.user.length <= 0) {
      navigate('/user/home', { 
        state: { message: '', userData: data?.user },
        replace: true
      });
    }
  };

  const userDataToPass = Array.isArray(userData) ? userData[0] : userData;
  return React.cloneElement(children, { userData: userDataToPass });
}