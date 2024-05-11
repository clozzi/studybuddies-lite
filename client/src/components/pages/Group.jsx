import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Group() {
    const { id } = useParams()
    const [group, setGroup] = useState(null)
    const [userInput, setUserInput] = useState("")
    // get isOpen from WS
    const [isOpen, setIsOpen] = useState(true)

    useEffect(() => {
        fetch(`/api/groups/${id}`)
        .then(r => r.json())
        .then(groupData => setGroup(groupData))
    }, [id])

    


    return (
        <>
        {group ? (
            <div>
                <h2>Group {group.title}</h2>
                <p>Focus: {group.description}</p>
                <div className="active-users-sidebar">
                    {/* {activeUsers.length ? (
                        activeUsers.map((activeUser, index) => (
                            <p key={index}>{activeUser}</p>
                        ))
                    ) : (
                        <p>No One Yet!</p>
                    )} */}
                    <p>Map activeusers from WS</p>
                </div>
                <div className="message-box">
                    {group.messages.map(msg => (
                        <p key={msg.id}>{msg.body}</p>
                    ))}
                </div>
                {isOpen ? (
                    <div>
                        <label>Type Message Here: </label>
                        <input type='text' 
                            value={userInput} 
                            onChange={(e) => {setUserInput(e.target.value)}}>
                        </input>
                        <button onClick={() => sendMessage(userInput)}>Send</button>
                        {/* <button onClick={() => disconnectWS(group.title, user.username)}>Disconnect</button> */}
                    </div>
                ) : (
                    // <button onClick={() => connectWS(group, user.username)}>Activate Chat</button>
                    null
                )}
            </div>
        ) : (
            <h2>Loading...</h2>
        )}
        </>
    )
}

export default Group