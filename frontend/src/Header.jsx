import Menu from "./Menu.jsx";

export default function Header({ user, handleLogout }) {
    return (
        <header style={{ width:"100%",position: "sticky", top: 0, zIndex: 1000, background: "#fff" }}>

            <Menu user={user} handleLogout={handleLogout} />
        </header>
    );
}
