import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { auth, provider, db } from "./firebase";  // ✅ Firebase
import { signInWithPopup } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import Registration from "./components/Registration";
import VolunteerRegistration from "./components/VolunteerRegistration";
import SeniorRegistration from "./components/SeniorRegistration";
import PendingRequests from "./components/PendingRequests";
import "./style.css"
//import VolunteerMatching from "./VolunteerMatching";

function App() {
  const [user, setUser] = useState(null);
  const [requestStatus, setRequestStatus] = useState("");

  // ✅ Google Sign-In Function (Commented Out)
  /*
  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
        console.log("Logged in:", result.user);
      })
      .catch((error) => console.error("Login Error:", error));
  };
  */

  // ✅ Add a Test Request to Firestore
  const addTestRequest = async () => {
    try {
      await addDoc(collection(db, "requests"), {
        service: "Test Request",
        status: "Pending",
        timestamp: new Date(),
      });
      setRequestStatus("Request added successfully!");
    } catch (error) {
      console.error("Error adding request:", error);
      setRequestStatus("Failed to add request.");
    }
  };

  // ✅ Call Twilio API to Trigger a Call
  const testTwilioCall = async () => {
    try {
      const response = await fetch("http://localhost:5000/voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to trigger Twilio call.");
      }

      alert("Twilio call test triggered! Check your phone.");
    } catch (error) {
      console.error("Twilio Call Error:", error);
      alert("Failed to trigger Twilio call.");
    }
  };

  return (
    <Router>
      <div className="App">
        {/* ✅ Single Title at the Top */}
        

        {/* ✅ Routes for Navigation */}
        <Routes>
          <Route path="/" element={<Registration />} />
          <Route path="/volunteer-registration" element={<VolunteerRegistration />} />
          <Route path="/senior-registration" element={<SeniorRegistration />} />
          <Route path="/pending-requests" element={<PendingRequests />} />
        </Routes>

       {/* {/* ✅ Firestore Request Test */}
        {/*<button onClick={addTestRequest}>Add Test Request to Firestore</button>
       {/* {requestStatus && <p>{requestStatus}</p>}*/

        /* ✅ Twilio Call Test */
      /*}  <button onClick={testTwilioCall}>Test Twilio Call</button>*/}

        {/* ✅ Volunteer Matching Feature */}
        {/*<VolunteerMatching />*/}
      </div>
    </Router>
  );
}

export default App;
