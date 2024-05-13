import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserContext = createContext({})

function UserProvider({ children }) {
    const [user, setUser] = useState(null)
    const [userGroups, setUserGroups] = useState(null)
    const navigate = useNavigate()


    useEffect(() => {
        fetch("/api/check_session")
            .then((r) => {
            if (r.status === 200) {
                r.json().then(data => {
                    // console.log(data)
                    setUser(data)
                    setUserGroups(data.groups)
                })
            }
        })
    }, [])


    function logout() {
        fetch("/api/logout", {
            method: "DELETE"
        })
        setUser(null)
        setUserGroups(null)
        navigate("/")
    }


    return <UserContext.Provider value={{user, userGroups, setUser, logout}}>
            { children }</UserContext.Provider>
}

export { UserContext, UserProvider }