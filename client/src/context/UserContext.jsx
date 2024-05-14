import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserContext = createContext({})

function UserProvider({ children }) {
    const [user, setUser] = useState(null)
    // const [userGroups, setUserGroups] = useState(null)
    const navigate = useNavigate()


    useEffect(() => {
        fetch("/api/check_session")
            .then((r) => {
            if (r.status === 200) {
                r.json().then(data => {
                    // console.log(data)
                    setUser(data)
                    // setUserGroups(data.groups)
                })
            }
        })
    }, [])


    function logout() {
        fetch("/api/logout", {
            method: "DELETE"
        })
        setUser(null)
        // setUserGroups(null)
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

    function handleRemoveFromGroup(regId, groupId) {
        setUser(user => ({
            ...user,
            groups: user.groups.map(group => {
                if (group.id === groupId) {
                    return {
                        ...group,
                        registrations: group.registrations.filter(reg => reg.id !== regId)
                    }
                }
                return group
            })
        }))
    }

    function handleAddToGroup(username, groupId) {
        setUser(user => ({
            ...user,
            groups: user.groups.map(group => {
                if (group.id === groupId) {
                    return {
                        ...group,
                        students: [...group.students, username]
                    }
                }
                return group
            })
        }))
    }


    return <UserContext.Provider value={{user, handleCreateGroup, handleDeleteGroup, updateUserGroups, handleAddToGroup, setUser, logout}}>
            { children }</UserContext.Provider>
}

export { UserContext, UserProvider }