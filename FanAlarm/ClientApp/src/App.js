import React, {useEffect} from 'react';
import Login from "./components/Login/Login"
import Dashboard from "./Dashboard"
import { reducerCases } from "./utils/Constants";
import { useStateProvider } from "./utils/StateProvider";// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function App() {

    const [{ token }, dispatch] = useStateProvider();
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const token = hash.substring(1).split("&")[0].split("=")[1];
            if (token) {
                dispatch({ type: reducerCases.SET_TOKEN, token });
            }
        }
    }, [dispatch, token]);


    return token ? <Dashboard code={token} /> : <Login />
}

export default App