import { useState } from "react";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });

  function update(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await signup(form);
    navigate("/login");
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-96">
        <h1 className="text-xl font-bold mb-4 text-center">Signup</h1>

        {Object.keys(form).map((key) => (
          <input
            key={key}
            className="w-full border p-2 rounded mb-3"
            placeholder={key}
            value={form[key]}
            type={key.includes("password") ? "password" : "text"}
            onChange={(e) => update(key, e.target.value)}
          />
        ))}

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
          Signup
        </button>
        <button type="button" onClick={() => navigate('/login')} className="w-full bg-blue-600 text-white py-2 mt-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
