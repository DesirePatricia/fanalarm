import React, { useState, useEffect } from 'react';
import TopArtists from '../TopArtists/TopArtists';
import "./Dashboard.css";

export default function Dashboard() {
    const [token, setToken] = useState("");

    useEffect(() => {
        // Extract token from URL hash
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const _token = params.get("access_token");

        if (_token) {
            setToken(_token);
            // Optionally, remove the token from URL for cleanliness
            window.history.replaceState(null, null, window.location.pathname);
            // Also save to localStorage if you want to persist it
            window.localStorage.setItem("token", _token);
        }
    }, []);

    const logout = () => {
        setToken("");
        window.localStorage.removeItem("token");
    };

    return (
        <>
            <div className='topArtists-header'>
                <div className='topArtists-header-title'>Fan Alarm</div>
                {token && <button onClick={logout}>Logout</button>}
            </div>
            <TopArtists token={token} />
            <div className='topArtists-footer'>
                <div className='footer-fanalarm-title'>Fan Alarm</div>
            </div>
        </>
    );
}
