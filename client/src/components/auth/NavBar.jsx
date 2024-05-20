import { useContext } from "react";
import { NavLink } from "react-router-dom"
import { UserContext } from "../../context/UserContext";

function NavBar() {
    const { socket, user, logout } = useContext(UserContext)

    function handleBadDisconnect() {
        socket.emit('bad_leave_room', {username:user.username})
        socket.disconnect()
        console.log('fired')
    }

    return (
        <div>
            {user ? (
                <nav id="navbar">
                <NavLink to={`/user/${user.id}`} className='nav-link' onClick={handleBadDisconnect} >Home</NavLink>
                <button onClick={logout} style={{color: '#e60000'}}>Logout</button>
                </nav>
            ) : (
                null
            )}
        </div>
    )
}

export default NavBar