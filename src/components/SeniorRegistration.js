import React, { useState } from "react";
import axios from "axios";

const SeniorRegistration = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/register-senior", formData);
      alert("Senior registered successfully!");
    } catch (error) {
      alert("Failed to register senior.");
    }
  };

  return (
    <div>
      <h2>Senior Registration</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone" onChange={handleChange} required />
        <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default SeniorRegistration;
