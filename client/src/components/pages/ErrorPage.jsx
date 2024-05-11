import { useRouteError } from "react-router-dom";
import NavBar from "../auth/NavBar";

function ErrorPage() {
    const error = useRouteError()
    console.error(error)

    return (
        <>
            <header>
                <NavBar />
            </header>
            <main>
                <h1>Whoops! That's not a page!</h1>
            </main>
        </>
    )
}

export default ErrorPage