import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Management({ user }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login"); // redirect if not logged in
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div>
      <h1>Welcome to Management Page, {user.name}!</h1>
      <p>You can manage your data here.</p>
    </div>
  );
}
