import { useContext, useEffect, useState } from "react"
import { NavLink, useNavigate, useParams } from "react-router-dom"
import { UserContext } from "../../context/UserContext"


function EditRoster() {
    const { id } = useParams()
    const { user, handleRemoveFromGroup, handleAddToGroup } = useContext(UserContext)
    const [studentId, setStudentId] = useState('')
    const [group, setGroup] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`/api/groups/${id}`)
        .then(r => {
            if (r.status === 200) {
                r.json()
                .then(data => setGroup(data))
            }
        })
    }, [id])

    function handleRemoveStudent(SID) {
        handleRemoveFromGroup(SID, )
        fetch(`/api/students-groups`, {
            method: 'DELETE'
        })
    }

    function handleAddStudent(e) {
        e.preventDefault()
        fetch("/api/students_groups", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                student_id: studentId,
                group_id: group.id
            }),
        })
        .then((r) => {
            if (r.status === 201) {
                r.json().then((data) => {
                    // handleAddToGroup(username, data.group_id)
                    console.log(data)
                })
            } else {
                alert('Failed to register student')
        }})
    }
    return (
        <>
        {user ? (
            <div>
                {group ? (
                    <div>
                        <h2>Group {group.title}</h2>
                        <p>Focus: {group.description}</p>
                        <NavLink to={`/groups/${group.id}`}>Visit Group</NavLink>
                        <form onSubmit={handleAddStudent}>
                            <label>Add Student to Group: </label>
                            <select name="students" id="students" onChange={(e) => setStudentId(e.target.value)}>
                                <option value="">Choose here</option>
                                {user.students ? (
                                    user.students.map(student => (
                                        <option value={student.id} key={student.id}>{student.username}</option>
                                    ))
                                ):(
                                    null
                                )}
                            </select>
                            <button type="submit">Click to Add</button>
                        </form>
                        
                        <ul>
                            {group.students.map((student) => (
                                <div className="group-students" key={student.id}>
                                    <p>Student: {student.username}</p>
                                    <button onClick={() => handleRemoveStudent(student.id)}>Remove from Group</button>
                                </div>
                            ))}
                        </ul> 
                    </div>
                ) : (
                    <h2>Loading...</h2>
                )}
            </div>
        ) : (
            <h2>Loading...</h2>
        )}
            
        </>
    )
}

export default EditRoster