import React, { Component, useEffect, useState } from 'react';
import Login from "./Login"
import Dashboard from "./Dashboard"

function App() {

    const [token, setToken] = useState("")

    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        // getToken()


        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }

        setToken(token)

    }, [])


    return token ? <Dashboard code={token} /> : <Login />
}

export default App