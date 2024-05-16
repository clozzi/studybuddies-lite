import { useContext } from "react";
import { NavLink } from "react-router-dom"
import { UserContext } from "../../context/UserContext";

function NavBar() {
    const { user, logout } = useContext(UserContext)

    return (
        <div>
            {user ? (
                <nav id="navbar">
                <NavLink to={`/user/${user.id}`} className='nav-link'>Home</NavLink>
                <button onClick={logout}>Logout</button>
                </nav>
            ) : (
                null
            )}
        </div>
    )
}

export default NavBar