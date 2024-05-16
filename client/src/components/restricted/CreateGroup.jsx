import { useContext } from "react"
import { UserContext } from "../../context/UserContext"
import { useFormik } from "formik"
import * as yup from 'yup'
import { useNavigate } from "react-router-dom"

function CreateGroup() {
    const { user, handleCreateGroup } = useContext(UserContext)
    const navigate = useNavigate()


    const formSchema = yup.object().shape({
        title: yup.string().required("Must Name Group").max(20),
        description: yup.string().required("Description required"),
    })

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            teacher_id: "",
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch("/api/groups", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: values.title,
                    description: values.description,
                    teacher_id: user.id
                }),
            })
            .then((r) => {
                if (r.status === 201) {
                    r.json().then((data) => {
                        handleCreateGroup(data)
                        navigate(`/user/${user.id}`)
                    })
                } else {
                    alert('Failed to create group')
            }})
        }
    })


    return (
        <>
        {user.students ? (
            <div>
                <h2>Create a New Group</h2>
                <form onSubmit={formik.handleSubmit} style={{ margin: "30px" }}>
                    <label htmlFor='title'>Title</label>
                    <br />
                    <input
                        id='title'
                        name='title'
                        placeholder='Enter Group Title...'
                        onChange={formik.handleChange}
                        value={formik.values.title}
                    />
                    <p style={{ color: "red" }}>{formik.errors.title}</p>
                    <label htmlFor='description'>Description</label>
                    <br />
                    <input
                        id='description'
                        name='description'
                        placeholder='Enter Group Description...'
                        onChange={formik.handleChange}
                        value={formik.values.description}
                    />
                    <p style={{ color: "red" }}>{formik.errors.description}</p>
                    <button type="submit">Create Group</button>
                </form>
            </div>
        ) : (
            <h2>Loading...</h2>
        )}
        </>
    )
}

export default CreateGroup