import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import EditGroup from "../restricted/EditGroup";
import { unstable_usePrompt } from "react-router-dom";

var socket = io('http://localhost:5555', { autoConnect: false });


function Group() {
    const { id } = useParams()
    // const location = useLocation()
    const { user, updateUserGroups } = useContext(UserContext)
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
    // useEffect(() => {
        // let msgBox = document.querySelector(".messages")
        // msgBox.scrollTop = msgBox.scrollHeight
        // msgBox.scrollIntoView({behavior:"smooth", block: "end"})
        // console.log(msgBox)
    // }, [group])

    // TRYING TO DISCONNECT ON ROUTE CHANGE
    // useEffect(() => {
        // console.log(location.pathname)
        // socket.emit('special_disconnect', user.username)
    // }, [location])
    // window.addEventListener('beforeunload', disconnectWS)
    // document.onvisibilitychange = function() {
    //     if (document.visibilityState === 'hidden') {
    //       disconnectWS();
    //     }
    //   };
    // Uncaught Error: useBlocker must be used within a data router
    // unstable_usePrompt({
    //     disconnectWS,
    //     message: "Please disconnect before leaving",
    //     when: ({currentLocation, nextLocation}) =>
    //         isOpen === true && currentLocation.pathname !== nextLocation.pathname,
    // })

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
                setCurrentMessages(prevMessages => [...prevMessages, data])
            })
            // NEED THE DISCONNECT ON PAGE CHANGE
            // SEND FULL ACTIVE USER LIST EVERY TIME AND UPDATE WITH FILTER?
            // socket.on('user_bad', (data) => {
            //     let userRoom = data.filter(room => room.room_id !== id)
            //     console.log(userRoom)
            //     setActiveUsers(userRoom.users)
            // })
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
                        {activeUsers.length ? (
                                activeUsers.map((activeUser, index) => (
                                    <p key={index}>{activeUser}</p>
                                ))
                            ) : (
                                <p>No One Yet!</p>
                        )}
                    </div>
                    <div className="messages">
                        {/* <div className="old-messages"> */}
                            {group.messages.map((msg) => {
                                if (msg.teacher) {
                                    return <p key={msg.id}><b>{msg.teacher.username}</b>: {msg.body}</p>
                                } else if (msg.student) {
                                    return <p key={msg.id}><b>{msg.student.username}</b>: {msg.body}</p>
                                } else {
                                    return null
                                }
                            })}
                        {/* </div> */}
                        {/* <div className="new-messages"> */}
                            {currentMessages.map((msg, index) => (
                                <p key={index}>{msg}</p>
                            ))}
                        {/* </div> */}
                    </div>
                </div>
                <div className="message-input">
                {isOpen ? (
                        <div>
                            <label>Type Message Here: </label>
                            <input type='text' 
                                value={userInput} 
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