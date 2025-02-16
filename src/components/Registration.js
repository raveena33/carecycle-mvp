import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import "../style.css"
const Registration = () => {
  const navigate = useNavigate();

  // ✅ Google Sign-In
  /*
  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Logged in:", result.user);
      })
      .catch((error) => console.error("Login Error:", error));
  };
*/
  return (
    <div>
     
      
      {/* ✅ Google Sign-In Button */}
     {/* <button onClick={signIn}>Sign in with Google</button>*/}
<div className = "registration-container">
     <h1>Welcome to Care Cycle</h1>
     <img src="carecycle.png" alt = "name" className="logo-image" />
      {/* ✅ Volunteer Registration Button */}
    <div className = "button-container">
      <button onClick={() => navigate("/volunteer-registration")}>
        Register as a Volunteer
      </button>

      {/* ✅ Senior Registration Button */}
      <button onClick={() => navigate("/senior-registration")}>
        Register as a Senior
      </button>
    </div>
    </div>
    </div>
  );
};

export default Registration;

