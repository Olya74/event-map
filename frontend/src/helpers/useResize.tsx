import { useState,useEffect} from "react";
import {SCREEN_SM,SCREEN_MD,SCREEN_LG, SCREEN_XL} from './const-breakepoints';

export const useResize = () => {
const [width, setWidth] = useState(window.innerWidth);

useEffect(() => {
  const handleResize = (e: UIEvent) => {
    setWidth((e.target as Window).innerWidth);
  };
  window.addEventListener("resize", handleResize);
  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, [width]);
return {
    width,
    isSM: width < SCREEN_SM,
    isMD: width >= SCREEN_SM && width < SCREEN_MD,
    isLG: width >= SCREEN_MD && width < SCREEN_LG,
    isXL: width >= SCREEN_LG ,
    isSearch:width >= SCREEN_XL,
  
    // isXL: width >= SCREEN_LG && width < SCREEN_XL,
    // isXXL: width >= SCREEN_XL && width < SCREEN_XXL,
    // isXXL: width >= SCREEN_XXL
    };

};