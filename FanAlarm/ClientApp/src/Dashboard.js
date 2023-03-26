import React, { useState } from 'react';

export default function Dashboard({ code }) {
    const [token, setToken] = useState("")

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    return (<>
                <div>{code}</div>
                <button onClick={logout}>Logout</button>
        </>
        );
}