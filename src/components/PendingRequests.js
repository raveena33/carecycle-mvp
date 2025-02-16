import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);

  // ✅ Fetch Pending Requests from Firestore
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "requests"));
        const pendingRequests = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((req) => req.status === "Pending");

        console.log("🔥 Fetched Pending Requests:", pendingRequests); // Debugging Log

        setRequests(pendingRequests);
      } catch (error) {
        console.error("❌ Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  // ✅ Accept Request (Assign Volunteer)
  /*const acceptRequest = async (requestId) => {
    try {
      await updateDoc(doc(db, "requests", requestId), {
        status: "Assigned",
        volunteer: "Volunteer", // Placeholder since no email system
        volunteerPhone: "Not Provided", // Modify if phone field exists
      });

      alert("You have accepted the request!");
      setRequests((prev) => prev.filter((req) => req.id !== requestId)); // Remove accepted request from list
    } catch (error) {
      console.error("Error accepting request:", error);
      alert("Failed to accept request.");
    }
  };
*/
const acceptRequest = async (requestId) => {
    const volunteerName = "Volunteer"; // Change this dynamically if you have authentication
    const volunteerPhone = "1234567890"; // If you have phone numbers stored, pass them

    try {
        const response = await fetch("http://localhost:5000/accept-request", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                requestId,
                volunteerName,
                volunteerPhone,
            }),
        });

        const data = await response.json();
        if (response.ok) {
            alert("You have accepted the request!");
            setRequests((prev) => prev.filter((req) => req.id !== requestId)); // Remove accepted request
        } else {
            throw new Error(data.error || "Failed to accept request");
        }
    } catch (error) {
        console.error("Error accepting request:", error);
        alert("Failed to accept request.");
    }
};
  return (
    <div>
      <h2>Pending Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests at this time.</p>
      ) : (
        <ul>
          {requests.map((req) => (
            <li key={req.id}>
              <strong>Service:</strong> {req.service} <br />
              <strong>Status:</strong> {req.status} <br />
              <button onClick={() => acceptRequest(req.id)}>Accept Request</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PendingRequests;
