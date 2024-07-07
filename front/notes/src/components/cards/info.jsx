import React from "react";
import { Initials } from "../../utils/helpers";

const info = ({ userInfo, logOut }) => {
  console.log(userInfo);
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
        {Initials(userInfo?.fullName)}
      </div>
      <div>
        <p className="text-sm font-medium">{userInfo?.fullName}</p>
        <button className="text-sm text-slate-700 underline" onClick={logOut}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default info;
