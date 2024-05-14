import { useContext } from "react"
import { NavLink } from "react-router-dom"
import { UserContext } from "../../context/UserContext"

function Home() {
    const { user } = useContext(UserContext)
    
    return (
        <>
        {user ? (
            <div className="user-home">
                <h2>{user.username}'s Home Page</h2>
                {user.students ? (
                    <div>
                        <NavLink to='/groups/new'>Create New Group </NavLink>
                        <br/>
                        <NavLink to='/teacher-groups'> Add/Remove Students</NavLink>
                    </div>
                ) : (
                    null
                )}
                <div className="user-groups">
                    {user.groups.map((group) => (
                        <div className="user-group" key={group.id}>
                            <p>Group Name: {group.title}</p>
                            <NavLink to={`/groups/${group.id}`}>Visit Group</NavLink>
                        </div>
                        ))}
                </div>
            </div>
        ) : (
            <h2>Loading...</h2>
        )}
        </>
    )
}

export default Home