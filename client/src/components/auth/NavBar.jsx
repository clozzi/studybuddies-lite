import { useContext } from "react";
import { NavLink } from "react-router-dom"
import { UserContext } from "../../context/UserContext";

function NavBar() {
    const { socket, user, logout } = useContext(UserContext)

    function handleBadDisconnect() {
        socket.emit('bad_leave_room', {username:user.username})
        socket.disconnect()
    }

    
    return (
        <div className="nav-bar">
            {user ? (
                <nav>
                    <div style={{ textAlign: "end"}}>
                        <button onClick={logout} className="danger-btn" style={{ fontSize: "xx-small", padding: "10px"}}>Logout</button>
                    </div>
                <h1>StudyBuddies</h1>
                <h3>The Real Time Chat App for Students</h3>
                <NavLink to={`/user/${user.id}`} className='nav-link' onClick={handleBadDisconnect} style={{ fontSize: "small", padding: "10px 20px"}}>Home</NavLink>
                </nav>
            ) : (
                <nav>
                <h1>StudyBuddies</h1>
                <h3>The Real Time Chat App for Students</h3>
                </nav>
                
            )}
        </div>
    )
}


export default NavBar