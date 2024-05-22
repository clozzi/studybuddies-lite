import { useFormik } from "formik"


function EditGroup({ id, title, description, onUpdateGroup}) {
    const formik = useFormik({
        initialValues: {
            title: title,
            description: description,
        },
        onSubmit: (values) => {
            fetch(`/api/groups/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values, null ,2),
            })
                .then((r) => {
                    if (r.status === 200) {
                        r.json().then((data) => {
                            onUpdateGroup(data)
                        })
                    } else {
                        alert('Failed attempt to update')
                    }
        })}
    })

    
    return (
        <div className="edit-group">
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <label>Enter New Title: </label>
                    <input 
                        type="text" 
                        id="title"
                        name="title" 
                        placeholder={title} 
                        max="10" 
                        min="0"
                        onChange={formik.handleChange}
                        value={formik.values.title}
                    />
                </div>
                <div>
                    <label>Enter New Description: </label>
                    <input 
                        type="text" 
                        id="description"
                        name="description" 
                        placeholder={description}
                        onChange={formik.handleChange}
                        value={formik.values.description}
                    />
                </div>
                <button type="submit">Modify Group</button>
            </form>
        </div>
    )
}


export default EditGroup