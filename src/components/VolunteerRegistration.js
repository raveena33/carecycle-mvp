import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const VolunteerRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    services: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleServiceChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        services: [...prev.services, value],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        services: prev.services.filter((service) => service !== value),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "volunteers"), formData);
      alert("Volunteer registered successfully!");

      // ✅ Redirect to Pending Requests After Registering
      navigate("/pending-requests");

    } catch (error) {
      console.error("Error registering volunteer:", error);
      alert("Failed to register.");
    }
  };

  return (
    <div>
      <h2>Volunteer Registration</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone" onChange={handleChange} required />
        <input type="text" name="address" placeholder="Address" onChange={handleChange} required />

        <label>
          <input type="checkbox" value="Groceries" onChange={handleServiceChange} /> Groceries
        </label>
        <label>
          <input type="checkbox" value="Companionship" onChange={handleServiceChange} /> Companionship
        </label>
        <label>
          <input type="checkbox" value="Medical Care" onChange={handleServiceChange} /> Medical Care
        </label>
<br></br>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default VolunteerRegistration;
