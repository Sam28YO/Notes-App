import React, { useState } from "react";
import Navbar from "../../components/navbar/navbar";
import { Link, useNavigate } from "react-router-dom";
import PassInp from "../../components/input/passinp";
import { validateEmail } from "../../utils/helpers";
import Instance from "../../utils/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (pass.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    } else if (pass.search(/[a-z]/) < 0) {
      setError("Password must contain at least one lowercase letter");
      return;
    } else if (pass.search(/[A-Z]/) < 0) {
      setError("Password must contain at least one uppercase letter");
      return;
    } else if (pass.search(/[0-9]/) < 0) {
      setError("Password must contain at least one number");
      return;
    }
    setError("");

    try {
      const response = await Instance.post("/login", {
        email: email,
        password: pass,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7">Login</h4>
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PassInp value={pass} onChange={(e) => setPass(e.target.value)} />
            {error && <p className=" text-red-500 text-xs pb-1">{error}</p>}
            <button type="submit" className="btn-primary">
              Login
            </button>
            <p className="text-sm text-center mt-4">
              Not registered yet? {""}
              <Link to="/signUp" className="font-medium text-primary underline">
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
