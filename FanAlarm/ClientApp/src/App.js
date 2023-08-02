import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Feedback from './components/Feedback/Feedback';
import { reducerCases } from './utils/Constants';
import { useStateProvider } from './utils/StateProvider';
import Artist from './components/Artist/Artist';
import AllArtists from './components/AllArtists/AllArtists';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCYuGqtCNVSe0srd_LribfiqONDRnrlRhU",
    authDomain: "fanalarm.firebaseapp.com",
    projectId: "fanalarm",
    storageBucket: "fanalarm.appspot.com",
    messagingSenderId: "605355605336",
    appId: "1:605355605336:web:c91a7d091c18680e2ff92d",
    measurementId: "G-KDS4ZTRPW3"
};

function App() {
    const [{ token }, dispatch] = useStateProvider();
    const navigate = useNavigate();

    useEffect(() => {
        // Initialize Firebase app and analytics
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);

        // Token extraction logic from URL hash
        const hash = window.location.hash;
        if (hash) {
            const token = hash.substring(1).split('&')[0].split('=')[1];
            if (token) {
                dispatch({ type: reducerCases.SET_TOKEN, token });
            } else {
                if (location.pathname == '/dashboard') {
                    navigate('/login', { replace: true });
                }
            }
        } else {
            if (location.pathname == '/dashboard') {
                navigate('/login', { replace: true });
            }
        }
    }, [dispatch, navigate]);

    return (
            <Routes>
                <Route path="/login/*" element={<Login />} />
                {/* Render the Dashboard component directly */}
                <Route path="/" element={<Login/>} />
                {/* Render the Dashboard component directly */}
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/artist/:name" element={<Artist />} />
                <Route path="/allartists" element={<AllArtists />} />
                <Route path="/feedback" element={<Feedback />} />
            </Routes>
    );
}

export default App;
