import React, { useState } from "react";
import PassInp from "../../components/input/passinp";
import Navbar from "../../components/navbar/navbar";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helpers";
import Instance from "../../utils/axios";
import { FaCheck, FaTimes } from "react-icons/fa";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const passwordRequirements = [
    { label: "At least 8 characters", test: (pass) => pass.length >= 8 },
    {
      label: "At least one lowercase letter",
      test: (pass) => /[a-z]/.test(pass),
    },
    {
      label: "At least one uppercase letter",
      test: (pass) => /[A-Z]/.test(pass),
    },
    { label: "At least one number", test: (pass) => /[0-9]/.test(pass) },
  ];

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name) {
      setError("Enter your name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    for (let requirement of passwordRequirements) {
      if (!requirement.test(pass)) {
        setError(`Password must ${requirement.label.toLowerCase()}`);
        return;
      }
    }
    setError("");

    try {
      const response = await Instance.post("/create-account", {
        fullName: name,
        email: email,
        password: pass,
      });

      if (response.data && response.data.error) {
        setError(response.data.error);
        return;
      }
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/login");
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
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl mb-7">Sign Up</h4>
            <input
              type="text"
              placeholder="Name"
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PassInp value={pass} onChange={(e) => setPass(e.target.value)} />
            <ul className="mt-2 mb-4 text-xs">
              {passwordRequirements.map((req, index) => (
                <li
                  key={index}
                  className={`flex items-center transition-all duration-300 ${
                    req.test(pass) ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {req.test(pass) ? (
                    <FaCheck className="mr-2" />
                  ) : (
                    <FaTimes className="mr-2" />
                  )}
                  <span>{req.label}</span>
                </li>
              ))}
            </ul>
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
            <button type="submit" className="btn-primary">
              Sign Up
            </button>
            <p className="text-sm text-center mt-4">
              Already registered?{" "}
              <Link to="/login" className="font-medium text-primary underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
