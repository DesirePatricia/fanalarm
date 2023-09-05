import React, { useState, useEffect } from "react";
import axios from "axios";
import Landing from "../Landing/Landing";
import "./Login.css";
import loginContainerImage from "../../images/LoginContainer.png";
import { notification } from 'antd';
import { Link } from 'react-router-dom';

export default function Login() {
    const key = 'updatable';
    const [token, setToken] = useState("");
    const frontendUrl = window.location.origin;

    useEffect(() => {
        async function setDeveloperToken() {
            // Replace with your actual frontend URL

            // Define the API endpoint URL
            const apiUrl = `${frontendUrl}/api/getjwt`;
            console.log(frontendUrl);

            // Make a GET request to the API endpoint
            fetch(apiUrl)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        // Handle the error response here
                        throw new Error(`Token request failed: ${response.status} ${response.statusText}`);
                    }
                })
                .then(data => {
                    // Handle the JSON data here
                    setToken(data.token);
                })
                .catch(error => {
                    // Handle any network errors or exceptions here
                    
                    console.log("error: " + error.message);
                });  
        }

        // Call the function to set the developer token
        setDeveloperToken();
    }, []);

    
    const openNotification = (email) => {
        notification.open({
            key,
            message: 'Email added Successfully',
            description: 'Email: ' + email + ' was added.',
        });
    };
    const musicapiUrl = 'https://app.musicapi.com/fanalarm?returnUrl=' + `${frontendUrl}/dashboard`;
    const getMusicAPi = () =>{
        

        fetch(musicapiUrl, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
        })
            .then(response => {
                if (response.ok) {
                    // If the response status is OK, parse the JSON response
                    return response.json();
                } else {
                    // Handle the error response here
                    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
                }
            })
            .then(data => {
                // Handle the API response data here
                console.log({ responseData: data });
            })
            .catch(error => {
                // Handle any network errors or exceptions here
                console.log({ error: error.message });
            });
    };
    
    return (
        <>
        <Landing/>
        <div
            className="loginContainer"
            style={{ minHeight: "100vh" }}
        >
                <div className="loginContainerWrapper"><img className='loginContainerImg' src={loginContainerImage} alt="fanalarm sync with spotify" />
                    <div className="loginContainerText">
                        <div className="loginContainerTitle">Integrate with your <br/> Fav Music Provider</div>
                        <div className="loginContainerSubtitle">Sync with your Music Streaming Provider so Fan Alarm can find
                        all the artists you’d love to see in concert</div>
                    </div>
                </div>
                <div className="loginButtonForm">
                    {/* 
                    <a className="loginButton btn btn-success btn-lg" href={musicapiUrl}>
                        Sync
                    </a>
                    */}
                    <Link className="loginButton btn btn-success btn-lg" to={`/searchartists`}>
                        Find Artists in Concert
                    </Link>
                </div>
        </div>
        </>
    )
}