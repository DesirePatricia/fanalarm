import './AllArtists.css';
import axios from "axios";
import React, { useEffect, useState } from "react";
import { reducerCases } from "../../utils/Constants";
import { useStateProvider } from "../../utils/StateProvider";
import Grid from '@mui/material/Grid';
import plane from '../../images/Paperplane.svg';

export default function AllArtists() {
    const [{ token, artists }, dispatch] = useStateProvider();
    const [artistsNum, setArtistsNum] = useState(50);

    const handleArtistsChange = (event) => {
        setArtistsNum(parseInt(event.target.value));
    };

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    useEffect(() => {
        const getArtistData = async () => {
            // Check if the cached data exists in localStorage
            const cachedData = localStorage.getItem('spotifyAllData');

            if (cachedData) {
                // Use the cached data
                const parsedData = JSON.parse(cachedData);
                dispatch({ type: reducerCases.GET_ALL_ARTISTS, artists: parsedData });
            } else {
                try {
                    const response = await axios.get(
                        "https://api.spotify.com/v1/me/top/artists?limit=50",
                        {
                            headers: {
                                Authorization: "Bearer " + token,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    const { items } = response.data;
                    console.log(items);
                    let counter = 1;
                    const artists = items.map(({ name, id }) => {
                        let totalAllArtists = counter++;
                        console.log(totalAllArtists);
                        return { name, id, totalAllArtists };
                    });
                    console.log(artists);
                    // Cache the response in localStorage
                    localStorage.setItem('spotifyAllData', JSON.stringify(artists));
                    dispatch({ type: reducerCases.GET_ALL_ARTISTS, artists });
                } catch (error) {
                    // Handle error
                }
            }
        };
        getArtistData();
    }, [token, dispatch]);

    useEffect(() => {
        // Update the artistsNum state whenever it changes
        setArtistsNum(artistsNum);
    }, [artistsNum]);
    return (
        <>
        <div className="allArtists-wrapper">
            <div className='allArists-header'>
                <div className='allArtists-header-title'>Fan Alarm</div>
            </div>
            <div className="allArtists-title">
                YOUR TOP <input className="allArtists-top-count" 
                    defaultValue="50"
                    onChange={handleArtistsChange}
                    name="topArtistsDisplay" 
                    type="number"
                    min="1"
                    max="50" /> ARTISTS
            </div>
            <ul className="allArtists-lists">
                {console.log(artists)}
                {artists?.map(({ name, id, totalAllArtists }) => {
                    console.log("here");
                    if (totalAllArtists <= artistsNum){
                    return (
                            <li className="allArtists-artist" key={id}>
                                <Grid container spacing={3} sx={{ flexGrow: 1 }}>
                                    <Grid item xs={2} xsoffset={0} md={2} mdoffset={0}>
                                        <div className="allArtists-artist-num">{totalAllArtists}</div>
                                    </Grid>
                                    <Grid item xs={6} xsoffset={0} md={6} mdoffset={0}>
                                        <div className="allArtists-artist-name">{name}</div>
                                    </Grid>
                                    <Grid item xs={4} xsoffset={0} md={4} mdoffset="auto">
                                        <input className="allArtists-checkbox" type="checkbox" name="myCheckbox" defaultChecked={true} />
                                    </Grid>
                                </Grid>
                            </li>
                        );
                    }
                    return null;
                    })}
            </ul>
            <div className="allArtists-message-wrapper">
                <div className="allArtists-message-radio-wrapper">
                    <label className="allArtists-radio-label">
                        <span className="allArtists-radio-text">Email</span>
                        <input className="allArtists-radio" defaultChecked={true} type="radio" value="email" name="message" />
                    </label>
                    <label className="allArtists-radio-label">
                        <span className="allArtists-radio-text">Text</span> 
                        <input className="allArtists-radio" type="radio" value="text" name="message" />
                    </label>
                </div>
                <div className="allArtists-message-container">
                    <input className="allArtists-message allArtists-message-text" type="text"/>
                    <input className="allArtists-message allArtists-message-number" type="number" />
                    <button className="allArtists-button">
                        <img className="allArtists-planeImg" src={plane} alt="Alert Paperplane" />
                    </button>
                </div>
            </div>
            
        </div>
        <div className='allArtists-footer'>
                <div className='footer-fanalarm-title'>Fan Alarm</div>
        </div>
        </>
    );
}