import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import EditGroup from "../restricted/EditGroup";

// var socket = io('http://localhost:5555', { autoConnect: false });


function Group() {
    const { id } = useParams()
    const { socket, user, updateUserGroups } = useContext(UserContext)
    const [userInput, setUserInput] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [activeUsers, setActiveUsers] = useState([])
    const [group, setGroup] = useState(null)
    const [currentMessages, setCurrentMessages] = useState([])
    const [isEditing, setIsEditing] = useState(false)


    useEffect(() => {
        fetch(`/api/groups/${id}`)
        .then(r => {
            if (r.status === 200) {
                r.json()
                .then(data => setGroup(data))
            }
        })
    }, [id, isEditing])

    
    // START MSG BOX SCROLLED TO BOTTOM

    // setTimeout(() => {
    //     const msgBox = document.getElementById("messages")
    //     msgBox.scrollTop = msgBox.scrollHeight
    // }, 1000)
    

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
                // console.log(data)
                setCurrentMessages(prevMessages => [...prevMessages, data])
            })
            socket.on('bad_disconnect', (data) => {
                console.log(data)
                const currentRoom = data.filter(data => data.room_id == id)
                // const currentRoomUsers = currentRoom.users.map(currentUser => currentUser)
                console.log(currentRoom)
                // console.log(currentRoomUsers)
                // WHY IS THIS NOT WORKING
                // setActiveUsers([currentRoom.users])
            })
        })
    }, [])

    function disconnectWS() {
        socket.emit('leave_room', {room:id, username:user.username})
        socket.disconnect()
        setIsOpen(false)
        setActiveUsers(["You're Disconnected!"])
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

    function handleUpdateGroup(updatedGroupObj) {
        setIsEditing(false);
        updateUserGroups(updatedGroupObj)
    }
    

    return (
        <>
        {group ? (
            <div className="group">
                <div className="group-details">
                   {isEditing ? (
                        <EditGroup
                        id={group.id}
                        title={group.title}
                        description={group.description}
                        onUpdateGroup={handleUpdateGroup}
                        />
                    ) : (
                        <>
                        <h2>Group: {group.title}</h2>
                        <p><b>Focus</b>: {group.description}</p>
                        </>
                    )}
                    {user ? (
                        user.students ? (
                            <button onClick={() => setIsEditing((isEditing) => !isEditing)}>
                                <span role="img" aria-label="edit">
                                Edit Group Details ✏️
                                </span>
                            </button>
                        ) : (
                            null
                        )
                    ) : (
                        null
                    )}
                </div>
                <div className="message-box">
                    <div className="active-users-sidebar">
                        <p>Active Users</p>
                        <hr/>
                        {activeUsers.length ? (
                                activeUsers.map((activeUser, index) => (
                                    <p key={index}>{activeUser}</p>
                                    ))
                        ) : (
                            <p>No One Yet!</p>
                        )}
                    </div>
                    <div className="messages">
                        <div className="old-messages">
                            {group.messages.map((msg) => {
                                if (msg.teacher) {
                                    return <p key={msg.id}><b>{msg.teacher.username}</b>: {msg.body}</p>
                                } else if (msg.student) {
                                    return <p key={msg.id}><b>{msg.student.username}</b>: {msg.body}</p>
                                } else {
                                    return null
                                }
                            })}
                        </div>
                        <hr />
                        <p>Live Messages</p>
                        <div className="new-messages">
                            {/* {currentMessages.map((msg, index) => (
                                <p key={index}>{msg}</p>
                            ))} */}
                            {currentMessages.map((msg, index) => {
                                if (msg.username == user.username) {
                                    return <p key={index} style={{ backgroundColor: "green"}}><b>{msg.username}</b>: {msg.message}</p>
                                } else if (msg.username != user.username) {
                                    return <p key={index} style={{ backgroundColor: "blue"}}><b>{msg.username}</b>: {msg.message}</p>
                                } else {
                                    return null
                                }
                            })}
                        </div>
                    </div>
                </div>
                <div className="msg-bottom">
                {isOpen ? (
                        <div className="input-group">
                            {/* <label>Type Message Here: </label> */}
                            <input type='text' 
                                value={userInput} 
                                className="form-control"
                                placeholder="Type message..."
                                onChange={(e) => {setUserInput(e.target.value)}}>
                            </input>
                            <button onClick={sendMessage}>Send</button>
                            <button onClick={disconnectWS} style={{color: '#e60000'}}>Disconnect</button>
                        </div>
                    ) : (
                        <button onClick={connectWS}>Activate Chat</button>
                    )} 
                </div>
            </div>
        ) : (
            <h2>Loading...</h2>
        )}
        </>
    )
}

export default Group