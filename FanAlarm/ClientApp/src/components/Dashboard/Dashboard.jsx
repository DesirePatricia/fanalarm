import React, { useState } from 'react';
import TopArtists from '../TopArtists/TopArtists';
import "./Dashboard.css";

export default function Dashboard({ code }) {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get("access_token");

    // Optional: Remove the token from the URL after extraction
    window.history.replaceState(null, null, window.location.pathname);

    const [token, setToken] = useState("")

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")

    }

    return (<>
        <div className='topArists-header'>
            <div className='topArtists-header-title'>Fan Alarm</div>
        </div>
        <TopArtists />
        <div className='topArtists-footer'>
            <div className='footer-fanalarm-title'>Fan Alarm</div>
        </div>
    </>
    );
}