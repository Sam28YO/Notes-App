import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import SignUp from "./pages/signup/signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect from root to /signup */}
        <Route path="/" element={<Navigate to="/signup" />} />

        {/* Define your routes */}
        <Route path="/dashboard" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
