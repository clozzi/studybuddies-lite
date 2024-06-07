import { useNavigate } from "react-router-dom"
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
        role: yup.string().oneOf(["teacher", "student"]).required("Must select role")
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
        <div className="login-page">
            <h2 className="login-title">Welcome to StudyBuddies!</h2>
            <h3 className="login-title">Please Login to Get Studying</h3>
            <form onSubmit={formik.handleSubmit} className="login-form">
                <label htmlFor='username'>Username</label>
                <br />
                <input
                    id='username'
                    name='username'
                    placeholder='Enter Username...'
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    className="login-input"
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
                    className="login-input"
                />
                <p style={{ color: "red" }}>{formik.errors.password}</p>
                <div className="login-switch">
                    <input 
                        name="role" 
                        type="radio"
                        id="teacher"
                        value="teacher"
                        onChange={formik.handleChange}
                        className="login-switch-input"
                    />
                    <label htmlFor="teacher" className="login-switch-label">Teacher</label>
                    <input 
                        name="role" 
                        type="radio"
                        id="student"
                        value="student"
                        onChange={formik.handleChange}
                        className="login-switch-input"
                    />
                    <label htmlFor="student" className="login-switch-label">Student</label>
                    <p style={{ color: "red" }}>{formik.errors.role}</p>
                </div>
                <button type="submit" className="login-button">Submit</button>
            </form>
        </div>
    )
}


export default Login