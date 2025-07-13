import React from 'react';
import { useStateProvider } from '../../utils/StateProvider';
import TopArtists from '../TopArtists/TopArtists';
import "./Dashboard.css";

export default function Dashboard() {
    const [{ token }] = useStateProvider();

    const logout = () => {
        // If you want to clear global token, dispatch an action here instead
        // For example: dispatch({ type: reducerCases.SET_TOKEN, token: "" })
        window.localStorage.removeItem("token");
        // You may also want to navigate to login or clear your global state
    }

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
