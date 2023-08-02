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
    const [{ token, topArtists }, dispatch] = useStateProvider();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
    }, [loading]);

    useEffect(() => {
        const getArtistData = async () => {
            // Check if the cached data exists in localStorage
            const cachedData = localStorage.getItem('spotifyData');
            if (cachedData) {
                // Use the cached data
                const parsedData = JSON.parse(cachedData);
                dispatch({ type: reducerCases.GET_TOP_ARTISTS, topArtists: parsedData });
            } else {
                try {
                    setLoading(true);
                    console.log(token);
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
                    const exists = [];
                    setLoading(true); // Move loading state update here
                    for (const { name, id, artistId } of items) {
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
                        if (responseArtist.data) {
                            let totalArtists = counter++;
                            topArtists.push({ name, id, artistId, totalArtists });
                            exists.push(true);
                        } else {
                            exists.push(false);
                        }
                    }
                    // Cache the response in localStorage
                    dispatch({ type: reducerCases.GET_TOP_ARTISTS, topArtists: topArtists });
                    localStorage.setItem('spotifyData', JSON.stringify(topArtists));
                    localStorage.setItem('spotifyDataExists', JSON.stringify(exists));
                    localStorage.setItem('spotifyAllData', JSON.stringify(allArtists));
                } catch (error) {
                    console.log("error: " + error);
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
                ) : (topArtists?.map(({ name, id, totalArtists }) => {
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
