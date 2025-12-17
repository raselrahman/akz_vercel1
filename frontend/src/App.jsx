import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './Home.jsx';
import Contact from './Contact.jsx';
import About from './About.jsx';
import Login from './Login.jsx'
import './App.css';
import Menu from './Menu.jsx';
import Dashboard from "./Dashboard.jsx";

export default function App() {
  const [user, setUser] = useState(null);

useEffect(() => {
  // Restore user from localStorage
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }

  // Warm-up backend (Render free service wakes up)
  fetch("https://akzbackend-production.up.railway.app/")
    .then(() => console.log("Backend wake-up ping sent ✅"))
    .catch((err) => console.log("Backend still waking up... ⏳", err));
}, []);


  const handleLogin = (username, password) => {
    const newUser = { name: username, password }; // store both
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser)); // persist login
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <>
      <Menu user={user} handleLogout={handleLogout} />

      <h1>Hi this is Draft Webpage</h1>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login handleLogin={handleLogin} />} />
        <Route path="/dashboard" element={ <Dashboard user={user} />} />
      </Routes>
    </>
  );
}
