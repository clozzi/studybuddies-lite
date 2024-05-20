

// SIGNUP MODS
import { useFormik } from 'formik';
import { useContext } from 'react';
import * as yup from "yup";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';


function Signup() {
    const { setUser } = useContext(UserContext)
    const navigate = useNavigate()

    
    const formSchema = yup.object().shape({
        username: yup.string().required("Must enter username").max(20),
        password: yup.string().required("Password required"),
        // NEW
        role: yup.string().oneOf(["teacher", "student", "admin"]).required("Must select role")
    })

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            // NEW
            role: ""
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            console.log(values)
            fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values, null, 2),
            })
            .then((r) => {
                if (r.status === 201) {
                    r.json()
                    .then((data) => {
                        setUser(data),
                        navigate(`/user/${data.id}`)
                    })
                } else {
                    alert('Could not signup user')
                }})
        }
    })
    

    return (
        <div>
            <h3>Sign Up Now!</h3>
            <form onSubmit={formik.handleSubmit} style={{ margin: "30px" }}>
                <label htmlFor='username'>Username</label>
                <br />
                <input
                    id='username'
                    name='username'
                    placeholder='Enter Username...'
                    onChange={formik.handleChange}
                    value={formik.values.username}
                />
                <p style={{ color: "red" }}>{formik.errors.username}</p>
                <label htmlFor='password'>Password</label>
                <br />
                <input
                    id='password'
                    name='password'
                    placeholder='Enter Password...'
                    onChange={formik.handleChange}
                    value={formik.values.password}
                />
                <p style={{ color: "red" }}>{formik.errors.password}</p>
                <label>Teacher </label>
                     <input 
                        name="role" 
                        type="radio"
                        id="teacher"
                        value="teacher"
                        onChange={formik.handleChange}
                    />
                    <label>Student </label>
                    <input 
                        name="role" 
                        type="radio"
                        id="student"
                        value="student"
                        onChange={formik.handleChange}
                    />
                    {/* NEW */}
                    <label>Admin </label>
                    <input 
                        name="role" 
                        type="radio"
                        id="admin"
                        value="admin"
                        onChange={formik.handleChange}
                    />
                <p style={{ color: "red" }}>{formik.errors.role}</p>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}


// export default Signup


// LOGIN MODS
import { NavLink, useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import * as yup from "yup"
import { useContext } from "react"
import { UserContext } from "../../context/UserContext"

function Login() {
    const { setUser } = useContext(UserContext)
    const navigate = useNavigate()

    const formSchema = yup.object().shape({
        username: yup.string().required("Must enter username").max(20),
        password: yup.string().required("Password required"),
        // NEW
        role: yup.string().oneOf(["teacher", "student", "admin"]).required("Must select role")
    })

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            role: ""
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values, null, 2),
            })
            .then((r) => {
                if (r.status === 200) {
                    r.json().then((data) => {
                        setUser(data)
                        navigate(`/user/${data.id}`)
                    })
                } else {
                    alert('Incorrect username or password')
            }})
        }
    })


    return (
        <div>
            <NavLink to='/signup' className='nav-link'>Signup</NavLink>
            <h2>Welcome to StudyBuddies!</h2>
            <h3>Please Login to Get Studying</h3>
            <form onSubmit={formik.handleSubmit} style={{ margin: "30px" }}>
                <label htmlFor='username'>Username</label>
                <br />
                <input
                    id='username'
                    name='username'
                    placeholder='Enter Username...'
                    onChange={formik.handleChange}
                    value={formik.values.username}
                />
                <p style={{ color: "red" }}>{formik.errors.username}</p>
                <label htmlFor='password'>Password</label>
                <br />
                <input
                    id='password'
                    name='password'
                    placeholder='Enter Password...'
                    onChange={formik.handleChange}
                    value={formik.values.password}
                />
                <p style={{ color: "red" }}>{formik.errors.password}</p>
                <label>Teacher </label>
                     <input 
                        name="role" 
                        type="radio"
                        id="teacher"
                        value="teacher"
                        onChange={formik.handleChange}
                    />
                    <label>Student </label>
                    <input 
                        name="role" 
                        type="radio"
                        id="student"
                        value="student"
                        onChange={formik.handleChange}
                    />
                    {/* NEW */}
                    <label>Admin </label>
                    <input 
                        name="role" 
                        type="radio"
                        id="admin"
                        value="admin"
                        onChange={formik.handleChange}
                    />
                <p style={{ color: "red" }}>{formik.errors.role}</p>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

// export default Login