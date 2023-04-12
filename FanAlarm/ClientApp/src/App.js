import React, { Component, useEffect, useState } from 'react';
import Login from "./Login"
import Dashboard from "./Dashboard"
import { reducerCases } from "./utils/Constants";
import { useStateProvider } from "./utils/StateProvider";

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