import { Route, Routes } from "react-router-dom"
import { UserProvider } from "./context/UserContext"
import Login from "./components/auth/Login"
import NavBar from "./components/auth/NavBar"
import Home from "./components/pages/Home"
import ErrorPage from "./components/pages/ErrorPage"
import Group from "./components/pages/Group"
import CreateGroup from "./components/restricted/CreateGroup"
import EditGroup from "./components/restricted/EditGroup"

function App() {

  return (
    <>
    <UserProvider>
      <NavBar />
      <h1>StudyBuddies Lite</h1>
      <Routes>
        <Route path="/" element={<Login />} errorElement={<ErrorPage />}/>
        <Route path="/user/:id" element={<Home />} />
        <Route path="/groups/:id" element={<Group />} />
        <Route path="/groups/new" element={<CreateGroup />} />
        {/* <Route path="/groups/:id/edit" element={<EditGroup />} /> */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </UserProvider>
    </>
  )
}

export default App
