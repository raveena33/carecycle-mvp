import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const VolunteerMatching = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const querySnapshot = await getDocs(collection(db, "requests"));
      setRequests(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchRequests();
  }, []);

  const matchVolunteer = async (requestId) => {
    const volunteersSnapshot = await getDocs(collection(db, "volunteers"));
    const availableVolunteers = volunteersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (availableVolunteers.length > 0) {
      const assignedVolunteer = availableVolunteers[0]; 
      await updateDoc(doc(db, "requests", requestId), { status: "Assigned", volunteer: assignedVolunteer.name });

      alert(`Assigned ${assignedVolunteer.name} to request ${requestId}`);
    }
  };

  return (
    <div>
      <h2>Pending Requests</h2>
      <ul>
        {requests.map((req) => (
          <li key={req.id}>
            {req.service} - {req.status}{" "}
            {req.status === "Pending" && <button onClick={() => matchVolunteer(req.id)}>Match</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VolunteerMatching;
