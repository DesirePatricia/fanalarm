import axios from "axios";
import React, { useEffect, useState } from "react";
import { reducerCases } from "../../utils/Constants";
import { useStateProvider } from "../../utils/StateProvider";
import "./TopArtists.css";
import Grid from '@mui/material/Grid';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Link } from 'react-router-dom';
import plane from '../../images/Paperplane.svg';

export default function TopArtists() {
    const [{ token }, dispatch] = useStateProvider();
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log(artists);
    }, [artists]);

    useEffect(() => {
        console.log("This is loading: " + loading);
    }, [loading]);

    useEffect(() => {
        const getArtistData = async () => {
            // Check if the cached data exists in localStorage
            const cachedData = localStorage.getItem('spotifyData');

            if (cachedData) {
                // Use the cached data
                const parsedData = JSON.parse(cachedData);
                setArtists(parsedData);
            } else {
                try {
                    setLoading(true);
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
                    let counter = 1;
                    let counterAll = 1;
                    const baseURL = window.location.origin + "/api/getartist/";
                    const topArtists = [];
                    const allArtists = [];
                    setLoading(true); // Move loading state update here
                    for (const { name, id } of items) {
                        let totalAllArtists = counterAll++;
                        allArtists.push({ name, id, totalAllArtists });
                        const responseArtist = await axios.get(
                            baseURL + name,
                            {
                                headers: {
                                    Authorization: "Bearer " + token,
                                    "Content-Type": "application/json",
                                },
                            }
                        );
                        console.log(responseArtist.data);
                        if (responseArtist.data) {
                            let totalArtists = counter++;
                            console.log(name);
                            topArtists.push({ name, id, totalArtists });
                        }
                    }
                    // Cache the response in localStorage
                    localStorage.setItem('spotifyData', JSON.stringify(topArtists));
                    localStorage.setItem('spotifyAllData', JSON.stringify(allArtists));
                    setArtists(topArtists);
                } catch (error) {
                    // Handle error
                } finally {
                    setLoading(false); // Move loading state update here
                }
            }
        };

        getArtistData();
    }, [token]);

    return (
        <div className="topArtists-wrapper">
            <div className="topArtists-title">YOUR TOP ARTISTS</div>
            <div className="topArtists-subtitle">in concert</div>
            <ul className="topArtists-lists">
                {loading ? (
                    <div className="loader-container">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    artists?.map(({ name, id, totalArtists }) => {
                        return (
                            <li className="topArtists-artist" key={id}>
                                <Grid container spacing={3} sx={{ flexGrow: 1 }}>
                                    <Grid item xs={2} xsoffset={0} md={2} mdoffset={0}>
                                        <div className="topArtists-artist-num">{totalArtists}</div>
                                    </Grid>
                                    <Grid item xs={8} xsoffset={0} md={9} mdoffset={0}>
                                        <div className="topArtists-artist-name">{name}</div>
                                    </Grid>
                                    <Grid item xs={2} xsoffset={0} md={1} mdoffset="auto">
                                        <Link to={`/Artist/${name}`} target="_blank" param={name}>
                                            <MoreHorizIcon className="topArtists-artist-more" />
                                        </Link>
                                    </Grid>
                                </Grid>
                            </li>
                        );
                    })
                )}
            </ul>
            <div className="topArtists-alert-wrapper">
                <Link className="topArtists-alert-container topArtists-link" to={`/allartists`}>
                    <img className='planeImg' src={plane} alt="Alert Paperplane" />
                    <div className="topArtists-alert">Alert Me!</div>
                </Link>
            </div>
        </div>
    );
}
