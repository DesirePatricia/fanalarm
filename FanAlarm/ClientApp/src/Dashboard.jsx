import React, { useState } from 'react';
import TopArtists from './components/TopArtists';

export default function Dashboard({ code }) {
    const [token, setToken] = useState("")

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    const CLIENT_ID = "197117536354511"
    const REDIRECT_URI = "https://localhost:3000"
    const AUTH_ENDPOINT = "https://api.instagram.com/oauth/authorize"
    const RESPONSE_TYPE = "code"
    const SCOPE = "user_profile,user_media"

    return (<>
                
                <div>{code}</div>

                <TopArtists/>
                <a className="btn btn-success btn-lg" href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>
                Login With Instagram
                </a>
                <button onClick={logout}>Logout</button>
        </>
        );
}