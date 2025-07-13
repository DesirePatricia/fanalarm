import React from 'react';
import { useStateProvider } from '../../utils/StateProvider';
import TopArtists from '../TopArtists/TopArtists';
import "./Dashboard.css";

export default function Dashboard() {
    const [{ token }, dispatch] = useStateProvider();

    const logout = () => {
        dispatch({ type: reducerCases.SET_TOKEN, token: "" });
        window.localStorage.removeItem("token");
        // Optionally navigate to login page here
    };

    return (
        <>
            <div className='topArtists-header'>
                <div className='topArtists-header-title'>Fan Alarm</div>
            </div>
            <TopArtists />
            <div className='topArtists-footer'>
                <div className='footer-fanalarm-title'>Fan Alarm</div>
            </div>
        </>
    );
}
