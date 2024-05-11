import { useContext } from "react";
import { NavLink } from "react-router-dom"
import { UserContext } from "../../context/UserContext";

function NavBar() {
    const { user, logout } = useContext(UserContext)

    return (
        <div>
            {user ? (
                <>
                <NavLink to={`/user/${user.id}`} style={({ isActive, isPending, isTransitioning }) => {
                    return {
                    fontWeight: isActive ? "bold" : "",
                    color: isPending ? "red" : "black",
                    viewTransitionName: isTransitioning ? "slide" : "",
                    };
                }}>Home</NavLink>
                <button onClick={logout}>Logout</button>
                </>
            ) : (
                null
            )}
        </div>
    )
}

export default NavBar