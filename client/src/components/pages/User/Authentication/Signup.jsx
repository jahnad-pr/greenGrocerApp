import React, { useEffect, useRef, useState } from "react";
import siginImg from "../../../../assets/images/sign.jpeg";
import logImg from "../../../../assets/images/log.jpeg";
import placeholder from "../../../../assets/images/placholder_profile.png";
import greenGrocerLogo from "../../../../assets/Logos/main.png";
import { IoAdd } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
// import { ToastContainer, toast } from "react-toastify";
import ForgotPassword from "./ForgotPassword";
import { showToast } from '../../../parts/Toast/Tostify'

import {
  useLoginMutation,
  useSignUpMutation,
  useGoogleLogMutation,
  useIsUerExistMutation,
} from "../../../../services/User/userApi";
import { useFetcher, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { validateFormData } from "./validation/validation";
import { auth, googleProvider } from "../../../../config/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import SignDetails from "./signDetails";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import ImageUploadPopup from "../../../parts/popups/ImageUploadPopup";

export default function Signup({ setSign }) {
  // Form data state for signup and login
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [upData, setUpData] = useState({ email: "", password: "" });
  const [mission, setMission] = useState(false); // Toggle between signup and login screens
  const [showPassword, setShowPassword] = useState(false);
  const [popup, showPopup] = useState(false);
  const [profileUrl,setProfileUrl] = useState('')
  const [dataForm, setData] = useState(false);
  const [method, setMethode] = useState("");
  const [verifiedData, setVerifyData] = useState(false);
  const [googleDATA, setGoogleData] = useState();
  // const [verifyData, setVerif] = useState(false);
  const navigator = useNavigate();
  const scroller = useRef();
  const [errors, setErrors] = useState({}); // Error state
  const [showForgotPassword, setShowForgotPassword] = useState(false);


  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);

const handleImageSave = (blob) => {
  setProfileUrl(blob[0])
};

  // data form etk query api
  const [
    signUp,
    { isLoading: isSignUpLoading, error: signUpError, data: data },
  ] = useSignUpMutation();
  const [login, { isLoading: isLoginLoading, error: loginError, data: loginData }] =
    useLoginMutation();
  const [
    googleLog,
    { isLoading: isGoogleLoading, error: googleError, data: googleData },
  ] = useGoogleLogMutation();

  const [
    isUerExist,
    { isLoading: isUerExistLoading, error: isUerExistError, data: isUerExistData },
  ] = useIsUerExistMutation();

    // Custom content component for the toast
    const ToastContent = ({ title, message }) => (
      <div>
          <strong>{title}</strong>
          <div>{message}</div>
      </div>
  );
  



  useEffect(() => {
    if (signUpError?.data?.message) {
      showToast(signUpError?.data?.message, 'error')
    }
  }, [signUpError])


  useEffect(() => {
    console.log(loginError);

    if (loginError?.data?.message) {
      showToast(loginError?.data?.message, 'error')
    }
  }, [loginError])

  useEffect(() => {
    // console.log(googleError);
    if (googleError) {
      showToast(googleError.data, 'error')
    }
  }, [googleError])

  useEffect(() => {
    console.log(isUerExistError);

    if (isUerExistError?.data) {
      showToast(isUerExistError?.data, 'error')
    }
  }, [isUerExistError])

  useEffect(() => {

    if (isUerExistData?.forWord) {
      setData(formData);
      setMethode("normal");
      showPopup(true);
    }
  }, [isUerExistData])

  useEffect(() => {
    if (loginData) {
      navigator('/user/home', { state: { userData: loginData.user, message: loginData.message } })
    }
  }, [loginData])

  // login with google
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      setGoogleData(result.user);

      const data = result.user;
      const dataForm = {
        username: data.displayName,
        email: data.email,
        password: import.meta.env.VITE_GOOGLE_PASSWORD,
        confirmPassword: import.meta.env.VITE_GOOGLE_PASSWORD,

      };
      await googleLog(dataForm).unwrap();

      // You can also store the user info or token in your app state
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  useEffect(() => {
    console.log(googleData);

    if (
      googleData?.isNew ||
      (!googleData?.data?.isVerified && googleData?.data)
    ) {
      setData(googleData?.data);
      setMethode("google");
      showPopup(true);
    } else if (!googleData?.isNew && googleData?.data?.isVerified) {
      navigator("/user/home");
    }
  }, [googleData]);

  useEffect(() => {
    if (data) {
    }
  }, [data]);

  // Handles signup and login functionality
  const signUpUser = async () => {
    setMethode("normal");
    const validationErrors = validateFormData(
      mission ? formData : upData,
      mission
    );
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        if (mission) {
          setMethode('normal')
          await isUerExist(formData).unwrap()

        } else {
          await login({...upData,profileUrl:profileUrl}).unwrap();
        }
      } catch (err) {
        showToast(err.message, "error");
      }
    }
  };

  // Transition effect on mission state change
  useEffect(() => {
    scroller.current.style.transform = mission
      ? "translateX(0vw)"
      : "translateX(-50vw)";
  }, [mission]);

  useEffect(() => {
    if (verifiedData) {
      console.log(verifiedData);

      // showToast("account created successfully", "success");
      if (method === "google") {
        
        (async () => {
          const data = googleDATA;
          console.log(data);
          const dataForm = {
            username: data.displayName,
            email: data.email,
            gmail: data.email,
            password: "Google@123",
            confirmPassword: "Google@123",
            gender: verifiedData.gender,
            phone: verifiedData.phone,
            place: verifiedData.place,
            profileUrl: data.photoURL
          };
          await googleLog(dataForm).unwrap();

          setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          setErrors({});
        })();
      } else if (method === "normal") {
        (async () => {
          const dataForm = {
            ...formData,
            nder: verifiedData.gender,
            phone: verifiedData.phone,
            place: verifiedData.place,
            profileUrl:profileUrl
          };
          await signUp(dataForm).unwrap();
          // setSign(true);
        })()
      }
    }
  }, [verifiedData]);

  // Handle input changes for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    mission
      ? setFormData((prevData) => ({
        ...prevData,
        [name]: name === "password" ? value.trim() : value,
      }))
      : setUpData((prevData) => ({
        ...prevData,
        [name]: name === "password" ? value.trim() : value,
      }));
  };

  return (
    <>
      <ImageUploadPopup
        isOpen={isImagePopupOpen}
        onClose={() => setIsImagePopupOpen(false)}
        onSave={handleImageSave}
        maxImages={1}
      />
      {popup && (
        <SignDetails
          method={method}
          showToast={showToast}
          setVerifyData={setVerifyData}
          setMission={setMission}
          showPopup={showPopup}
          dataForm={dataForm}
        />
      )}
      {showForgotPassword && (
        <ForgotPassword showToast={showToast} setShowForgotPassword={setShowForgotPassword} />
      )}
      {/* <div ref={scroller} className="w-[150%] h-full  flex duration-500"> */}
      <div ref={scroller} className={`w-[150%] duration-500
      bg-[linear-gradient(#d2d2d0,#d1d1cf,#cecece,#c6c8c7,#c6c7c6,#c3c4c3,#b5b9b8)] h-full flex`}>
        <div
          onClick={() => navigator("/user/home")}
          className={`bg-gray-200/40 font-medium absolute ${mission ? "right-10" : "right-[39%]"
            } duration-700 top-10 px-5 py-2 rounded-full flex gap-3 items-center justify-center z-10`}
        >
          <i className="ri-user-4-line text-[20px]"></i>
          <p>Gust accound</p>
        </div>

        <div className="w-full h-full flex duration-300">
          {/* First container */}
          <div className="flex-[2] rounded-r-[555px]">
            <div className="h-[108%] w-20  opacity-40  absolute z-10 left-[40%] "></div>
            <img
              className="absolute h-[111%] translate-y-[-55px] aspect-square translate-x-[-26%] mix-blend-darken"
              src={siginImg}
              alt="Background Image"
            />
          </div>

          {/* Second container */}
          <div className="flex-[3] relative">
            <div className="w-full h-full flex flex-col max-w-[50%] mx-auto items-center justify-center duration-700">
              {/* App logo */}
              <img
                className={`w-[18%] absolute bottom-8 right-8 ${mission ? "opacity-20" : "opacity-0"} brightness-0 duration-300`}
                src={greenGrocerLogo}
                alt="Logo"
              />

              {/* Conditional rendering for logo in login mode */}
              <AnimatePresence>
                {!mission && (
                  <motion.div
                    initial={{ scale: 0.0, rotate: 5, height: 0 }}
                    animate={{ scale: 1, rotate: 0, height: "auto" }}
                    exit={{ scale: 0, height: 0, rotate: 0 }}
                  >
                    <img className="w-[80%]" src={greenGrocerLogo} alt="" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Profile placeholder in signup mode */}
              <AnimatePresence>
                {mission && (
                  <motion.div
                    initial={{ scale: 0.0, height: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0, height: "auto" }}
                    exit={{ scale: 0, height: 0, rotate: 180 }}
                  >
                    <span onClick={() => setIsImagePopupOpen(true)} className="relative group">
                      <div className="w-8 h-8 z-10 bg-orange-300 rounded-full group-hover:scale-110 group-hover:shadow-lg duration-300  flex items-center justify-center absolute bottom-0 right-0">
                        <IoAdd size={28} />
                      </div>
                      <img
                        className="max-w-[8rem] min-w-[8rem] min-h-[8rem] group-hover:scale-125 rounded-full cursor-pointer duration-300 bg-slate-200"
                        src={profileUrl||placeholder}
                        alt="Profile Placeholder"
                      />
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Signup message */}
              <p className="text-[18px] opacity-35 my-5 duration-500">
                Signup below to get started
              </p>

              {/* Input Fields */}
              <div className="flex flex-col w-full max-w-[80%] duration-500">
                {/* Username Input */}
                <AnimatePresence>
                  {mission && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0, height: 0, margin: 0 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        height: "auto",
                        margin: 0,
                      }}
                      exit={{ opacity: 0, scale: 0, height: 0, margin: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="w-full flex items-center justify-center bg-[linear-gradient(45deg,#f5efef,#f5efef)] py-2 px-5 gap-5 rounded-full mb-5">
                        <i className="ri-user-line text-[28px] opacity-20"></i>
                        <input
                          name="username"
                          placeholder="User Name"
                          className="flex-1 w-full mx-auto py-3 bg-transparent outline-none"
                          type="text"
                          value={formData.username}
                          onChange={handleChange}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email Input */}
                <div className="w-full flex items-center justify-center bg-[linear-gradient(45deg,#f5efef,#f5efef)] py-2 px-5 gap-5 rounded-full duration-700 mb-5">
                  <i className="ri-at-line text-[28px] opacity-20"></i>
                  <input
                    name="email"
                    placeholder="Email"
                    className="flex-1 w-full mx-auto py-3 bg-transparent outline-none"
                    type="email"
                    value={mission ? formData.email : upData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* Password Input */}
                <div className="w-full flex items-center justify-center bg-[linear-gradient(45deg,#f5efef,#f5efef)] py-2 px-5 gap-5 rounded-full mb-5 relative">
                  <i className="ri-key-line text-[28px] opacity-20"></i>
                  <input
                    name="password"
                    placeholder="Password"
                    className="flex-1 w-full mx-auto py-3 bg-transparent outline-none select-none"
                    type={showPassword ? "text" : "password"}
                    value={mission ? formData.password : upData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute right-9 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {!showPassword ? (
                      <i className="ri-eye-line text-[24px]"></i>
                    ) : (
                      <i className="ri-eye-off-line text-[24px]"></i>
                    )}
                  </button>
                </div>
                
              

                {/* Confirm Password Input */}
                <AnimatePresence>
                  {mission && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0, height: 0, margin: 0 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        height: "auto",
                        margin: 0,
                      }}
                      exit={{ opacity: 0, scale: 0, height: 0, margin: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="w-full flex items-center justify-center bg-[linear-gradient(45deg,#f5efef,#f5efef)] py-2 px-5 gap-5 rounded-full">
                        <i className="ri-lock-line text-[28px] opacity-20"></i>
                        <input
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          className="flex-1 w-full mx-auto py-3 bg-transparent outline-none"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* error message */}
              <AnimatePresence>
                {Object.keys(errors).length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0, height: 0, margin: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      height: "auto",
                      margin: 0,
                    }}
                    exit={{ opacity: 0, scale: 0, height: 0, margin: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className=" mb-4 mx-16 px-10 rounded-3xl mt-8 bg-[linear-gradient(45deg,#ffffff,#f5efef)] border-[2px] border-gray-300 py-5">
                      {Object.values(errors).map(
                        (error, index) =>
                          index === 0 && (
                            <p
                              key={index}
                              className="text-[18px] text-red-500 font-medium"
                            >
                              {error}
                            </p>
                          )
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

                {  !mission &&
                  <p className="text-[16px] text-blue-900 cursor-pointer w-[80%] ml-3" onClick={() => setShowForgotPassword(true)}>
                    Forgot password?
                  </p>
                  }

              {/* Sign Up Button */}
              <button
                onClick={signUpUser}
                className="bg-[linear-gradient(to_left,#f7085a,#bc4a97)] py-5 text-white w-[80%] text-[20px] rounded-full font-bold shadow-[6px_6px_10px_#00000080_inset] duration-700 mt-8"
              >
                Signup
              </button>

              {/* Switch to Login */}
              <p className="text-[18px] text-gray-500 my-10 cursor-pointer">
                Already a member?{" "}
                <span
                  onClick={() => (setMission(!mission), setErrors({}))}
                  className="text-blue-900"
                >
                  Click to { mission ? "login" : "signup" }
                </span>
              </p>
              <FcGoogle onClick={loginWithGoogle} size={45} />


            </div>
          </div>
        </div>

        {/* Background Image in the Right Container */}
        <div className="bg-gray-300 flex-[2] rounded-r-[555px]">
          <img
            className={`absolute h-[118%] translate-y-[-55px] aspect-[] duration-500 left-[82%]`}
            src={logImg}
            alt="Right Background Image"
          />
        </div>
      </div>
    </>
  );
}
