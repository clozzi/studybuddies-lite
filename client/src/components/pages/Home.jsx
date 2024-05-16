import { useContext } from "react"
import { NavLink } from "react-router-dom"
import { UserContext } from "../../context/UserContext"

function Home() {
    const { user, handleDeleteGroup } = useContext(UserContext)


    function deleteGroup(id) {
        handleDeleteGroup(id)
        fetch(`/api/groups/${id}`, {
            method: "DELETE"
        })
    }
    

    return (
        <>
        {user ? (
            <div className="user-home">
                <h2>{user.username}'s Home Page</h2>
                {user.students ? (
                    <div>
                        <NavLink to='/groups/new' className='nav-link'>Create New Group </NavLink>
                    </div>
                ) : (
                    null
                )}
                <div className="user-groups">
                    {user.groups.map((group) => (
                        <div className="user-group" key={group.id}>
                            <h4>Group Name: {group.title}</h4>
                            <p><b>Focus</b>: {group.description}</p>
                            <NavLink to={`/groups/${group.id}`} className='nav-link'>Visit Group</NavLink>
                            {user.students ? (
                                <>
                                <NavLink to={`/student-groups/${group.id}`} className='nav-link'>Edit Roster</NavLink>
                                <button onClick={() => deleteGroup(group.id)}>Delete Group</button>
                                </>
                            ) : (
                                null
                            )}
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