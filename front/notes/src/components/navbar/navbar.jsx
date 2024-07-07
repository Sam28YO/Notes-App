/*import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Info from "../cards/info";
import Search from "../search/search";
import { FaRegStickyNote } from "react-icons/fa";

function Navbar({ userInfo, onSearch, handleClear }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const logOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if (query) {
      onSearch(query);
    }
  };

  const clearSearch = () => {
    setQuery("");
    handleClear();
  };

  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <div className="flex items-center">
        <FaRegStickyNote className="text-xl text-black mr-2" />{" "}
        <h2 className="text-xl font-medium text-black py-2">Notes</h2>
      </div>
      {!isAuthRoute && (
        <>
          <Search
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            clearSearch={clearSearch}
            handleSearch={handleSearch}
          />
          <Info userInfo={userInfo} logOut={logOut} />
        </>
      )}
    </div>
  );
}

export default Navbar;*/

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Info from "../cards/info";
import Search from "../search/search";
import { FaRegStickyNote } from "react-icons/fa";
import bgImage from "../../assets/images/bg3.png";

function Navbar({ userInfo, onSearch, handleClear }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const logOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if (query) {
      onSearch(query);
    }
  };

  const clearSearch = () => {
    setQuery("");
    handleClear();
  };

  const isAuthRoute =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="relative bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50 z-0"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
      <div className="flex items-center z-10 relative">
        <FaRegStickyNote className="text-xl text-black mr-2" />
        <h2 className="text-xl font-medium text-black py-2">Notes</h2>
      </div>
      {!isAuthRoute && (
        <>
          <div className="z-10 relative">
            <Search
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              clearSearch={clearSearch}
              handleSearch={handleSearch}
            />
          </div>
          <div className="z-10 relative">
            <Info userInfo={userInfo} logOut={logOut} />
          </div>
        </>
      )}
    </div>
  );
}

export default Navbar;
