import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import "../style.css"
const Registration = () => {
  const navigate = useNavigate();

  return (
    <div>
     
<div className = "registration-container">
     <h1>Welcome to Care Cycle</h1>
     
      {/*Volunteer Registration Button */}
    <div className = "button-container">
      <button onClick={() => navigate("/volunteer-registration")}>
        Register as a Volunteer
      </button>

      {/*Senior Registration Button */}
      <button onClick={() => navigate("/senior-registration")}>
        Register as a Senior
      </button>
    </div>
    </div>
    </div>
  );
};

export default Registration;

