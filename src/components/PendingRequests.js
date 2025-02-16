import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);

  
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "requests"));
        const pendingRequests = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((req) => req.status === "Pending");

        console.log("Fetched Pending Requests:", pendingRequests); 

        setRequests(pendingRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

 
const acceptRequest = async (requestId) => {
    const volunteerName = "Volunteer"; 
    const volunteerPhone = "1234567890"; 

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
            setRequests((prev) => prev.filter((req) => req.id !== requestId)); 
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
