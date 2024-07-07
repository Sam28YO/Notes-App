import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const PassInp = ({ value, onChange, placeholder }) => {
  const [isShowPass, setIsPass] = useState(false);
  const toggle = () => {
    setIsPass(!isShowPass);
  };

  return (
    <div className="flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3">
      <input
        value={value}
        onChange={onChange}
        type={isShowPass ? "text" : "password"}
        placeholder={placeholder || "Password"}
        className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"
      />
      {isShowPass ? (
        <FaRegEye
          size={22}
          className=" text-primary cursor-pointer"
          onClick={() => toggle()}
        />
      ) : (
        <FaRegEyeSlash
          size={22}
          className="text-slate-400 cursor-pointer"
          onClick={() => toggle()}
        />
      )}
    </div>
  );
};

export default PassInp;
