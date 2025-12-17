import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Login({ handleLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const response = await fetch("https://akzbackend-production.up.railway.app/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  
    const data = await response.json();
    console.log("Backend response:", data);  // ✅ debug
  
    if (data.success) {
      handleLogin(username, password);
      navigate("/dashboard");
    } else {
      alert(data.message);  // ✅ show backend message instead of undefined
    }
  };
  

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handleSubmit} style={{position: 'absolute', left: '50%', transform: 'translateX(-50%)'}}>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br/>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
