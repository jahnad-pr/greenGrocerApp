"use client";
// import Image from "next/image";
import React, { useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

export const AnimatedTooltip = ({
  setCurrentPosition,
  items
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0); // going to set this value on mouse move
  // rotate the tooltip
  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig);
  // translate the tooltip
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig);
  const handleMouseMove = (event) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth); // set the x value, which is then used in transform and rotate
  };

  return (<>
    {items.map((item, idx) => (
      <div onClick={() => setCurrentPosition(idx+1)}
        className="-mr-2 relative group z-10"
        key={item.product._id}
        onMouseEnter={() => setHoveredIndex(item.product._id)}
        onMouseLeave={() => setHoveredIndex(null)}>
        <AnimatePresence mode="popLayout">
          {hoveredIndex === item.product._id && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.6 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 260,
                  damping: 10,
                },
              }}
              exit={{ opacity: 0, y: 20, scale: 0.6 }}
              style={{
                translateX: translateX,
                rotate: rotate,
                whiteSpace: "nowrap",
              }}
              className="absolute -top-16 -left-1/2 translate-x-1/2 flex text-xs  flex-col items-center justify-center rounded-md bg-black z-50 shadow-xl px-4 py-2">
              <div
                className="absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px " />
              <div
                className="absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px " />
              <div className="font-bold text-white relative z-30 text-base">
                {item.product.name}
              </div>
              {/* <div className="text-white text-xs">{item.designation}</div> */}
            </motion.div>
          )}
        </AnimatePresence>
        <img
          onMouseMove={handleMouseMove}
          height={100}
          width={100}
          src={item.product.pics.one}
          alt={item.name}
          className="object-cover !m-0 p-3 object-top rounded-full overflow-visible h-20 w-20 border-2 group-hover:scale-105 group-hover:z-30 border-[#ffffff30] bg-[linear-gradient(45deg,#ffffff20,#ffffff40)]  relative transition duration-500" />
      </div>
    ))}
  </>);
};
