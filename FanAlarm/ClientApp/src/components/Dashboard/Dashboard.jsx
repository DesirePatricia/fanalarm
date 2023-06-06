import React, { useState } from 'react';
import TopArtists from '../TopArtists/TopArtists';
import "./Dashboard.css";

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
                <div className='topArists-header'>
                    <div className='topArtists-header-title'>Fan Alarm</div>
                </div>
                <TopArtists/>
                <button onClick={logout}>Logout</button>
        </>
        );
}