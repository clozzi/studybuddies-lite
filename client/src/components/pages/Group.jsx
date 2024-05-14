import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

var socket = io('http://localhost:5555', { autoConnect: false });

// REMOVE ACTIVE USERS FROM HERE AND MOVE TO BE

function Group() {
    const { id } = useParams()
    const { user } = useContext(UserContext)
    const [userInput, setUserInput] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [activeUsers, setActiveUsers] = useState(null)
    const [group, setGroup] = useState(null)
    const [currentMessages, setCurrentMessages] = useState([])

    useEffect(() => {
        fetch(`/api/groups/${id}`)
        .then(r => {
            if (r.status === 200) {
                r.json()
                .then(data => setGroup(data))
            }
        })
    }, [id])

    function connectWS() {
        socket.connect()
        setIsOpen(true)
        socket.emit('enter_room', {'room':id, 'username':user.username})
    }

    useEffect(() => {
        socket.on('connect', () => {
            socket.on('user_joined', (data) => {
                setActiveUsers(data.users)
            })
            socket.on('user_left', (data) => {
                setActiveUsers(data.users)
            })
            socket.on('new_message', (data) => {
                console.log(data)
                setCurrentMessages(prevMessages => [...prevMessages, data])
            })
        })
    }, [])
    

    function disconnectWS() {
        socket.emit('leave_room', {room:id, username:user.username})
        socket.disconnect()
        setIsOpen(false)
    }

    function sendMessage() {
        socket.emit('send_message', {userInput: userInput, username:user.username, room:id})
        fetch("/api/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                body: userInput,
                group_id: id,
            })
        })
        setUserInput("")
    }
    

    return (
        <>
        {group ? (
            <div>
                <h2>Group {group.title}</h2>
                <p>Focus: {group.description}</p>
                <div className="active-users-sidebar">
                    {activeUsers ? (
                        activeUsers.map((activeUser, index) => (
                            <p key={index}>{activeUser}</p>
                        ))
                    ) : (
                        <p>No One Yet!</p>
                    )}
                </div>
                <div className="message-box">
                    {/* <div className="old-messages"> */}
                        {group.messages.map((msg) => {
                            if (msg.teacher) {
                                return <p key={msg.id}><b>{msg.teacher.username}</b>: {msg.body}</p>
                            } else if (msg.student) {
                                return <p key={msg.id}><b>{msg.student.username}</b>: {msg.body}</p>
                            }
                        })}
                    {/* </div> */}
                    {/* <div className="new-messages"> */}
                        {currentMessages.map((msg, index) => (
                            <p key={index}>{msg}</p>
                        ))}
                    {/* </div> */}
                    
                </div>
                {isOpen ? (
                    <div>
                        <label>Type Message Here: </label>
                        <input type='text' 
                            value={userInput} 
                            onChange={(e) => {setUserInput(e.target.value)}}>
                        </input>
                        <button onClick={sendMessage}>Send</button>
                        <button onClick={disconnectWS}>Disconnect</button>
                    </div>
                ) : (
                    <button onClick={connectWS}>Activate Chat</button>
                )}
            </div>
        ) : (
            <h2>Loading...</h2>
        )}
        </>
    )
}

export default Group