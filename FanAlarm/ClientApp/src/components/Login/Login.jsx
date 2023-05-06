import React from "react"
import Landing  from "../Landing/Landing"
import "./Login.css"
import loginContainerImage from "../../images/LoginContainer.png"

export default function Login() {
    const CLIENT_ID = "2b13915048a841b4b878f0287977a897"
    const REDIRECT_URI = "https://localhost:3000"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"
    const SCOPE = "user-top-read"
    return (
        <>
        <Landing/>
        <div className="loginContainer">
                <div className="loginContainerWrapper"><img className='loginContainerImg' src={loginContainerImage} />
                    <div className="loginContainerText">
                        <div className="loginContainerTitle">Integrate with Spotify</div>
                        <div className="loginContainerSubtitle">Sync with Spotify so Fan Alarm can find
                        all the artists you’d love to see in concert</div>
                    </div>
                </div>
                <div>
                    {/*<a className="loginButton btn btn-success btn-lg" href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>
                        Sync with Spotify
                    </a>
                    */}
                    <a className="loginButton btn btn-success btn-lg">
                        Sync with Spotify
                    </a>
                </div>
        </div>
        </>
    )
}