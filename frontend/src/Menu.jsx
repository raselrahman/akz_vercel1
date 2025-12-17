import { Link } from "react-router-dom";
import "./Menu.css";

export default function Menu({ user, handleLogout }) {
  return (
    <nav className="menu">
      <ul className="left-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>

      <ul className="right-link">
        {user ? (
          <>
            <li>Hello, {user.name}</li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <li><Link to="/login"><button>Login</button></Link></li>
        )}
      </ul>
    </nav>
  );
}
