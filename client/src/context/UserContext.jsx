import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserContext = createContext({})

const socket = io('http://localhost:5555', { autoConnect: false });


function UserProvider({ children }) {
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetch("/api/check_session")
            .then((r) => {
            if (r.status === 200) {
                r.json().then(data => {
                    setUser(data)
                })
            }
        })
    }, [])

    function logout() {
        fetch("/api/logout", {
            method: "DELETE"
        })
        setUser(null)
        navigate("/")
    }

    function handleCreateGroup(group) {
        setUser(user => ({
            ...user,
            groups: [...user.groups, group]
        }))
    }

    function handleDeleteGroup(id) {
        setUser(user => ({
            ...user,
            groups: user.groups.filter(group => group.id !== id)
        }))
    }

    function updateUserGroups(groupObj) {
        setUser(user => ({
            ...user,
            groups: user.groups.map(group => {
                if (group.id === groupObj.id) {
                    return groupObj
                }
                return group
            })
        }))
    }


    return <UserContext.Provider value={{ socket, user, handleCreateGroup, handleDeleteGroup, updateUserGroups, setUser, logout}}>
            { children }</UserContext.Provider>
}


export { UserContext, UserProvider }