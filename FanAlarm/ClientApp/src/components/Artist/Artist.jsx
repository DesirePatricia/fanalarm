import React, { useEffect, useState } from "react";
import axios from "axios";
import { reducerCases } from "../../utils/Constants";
import { useStateProvider } from "../../utils/StateProvider";
import './Artist.css';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';

export default function Artist() {
    const { name } = useParams();
    const baseURL = window.location.origin + "/api/getconcert/" + name;
    const [artists, setArtists] = useState([]);
    const [{ token }, dispatch] = useStateProvider();

    useEffect(() => {
        console.log(artists);
    }, [artists]);

    useEffect(() => {
        const getArtistData = async () => {
            try {
                const response = await axios.get(baseURL, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const items = response.data;
                console.log(items)
                setArtists(items);
                dispatch({ type: reducerCases.GET_ARTIST_DETAILS, artistDetails: items });
            } catch (error) {
                // Handle error
            }
        };
        getArtistData();
    }, [baseURL, dispatch]);

    return (
        <div className='artist_homewrapper'>
            <div className='artist_fanalarm'>Fan Alarm</div>
            <div className='artist_split'></div>
            {artists.map(({ name, image, id, concerts, venues }) => (
                <div className='artist_concertwrapper' key={id}>
                    <img className='artist_image' src={image} alt={name} />
                    <div className='artist_artistname'>{name}</div>
                    <div className='artist_concertdetails'>
                        <div className='artist_concerttitle'>Concerts in Your Area</div>
                        <div className='artist_split'></div>
                        <div className='artist_concerts'>
                            {concerts && <div className='artist_concertname'>{concerts.name}</div>}
                            {venues && venues.map(({ name, venue_id, city, date, url }) => (
                                <div className='artist_venuewrapper' key={venue_id}>
                                    <Grid className='artist_venuegrid' container spacing={1} sx={{ flexGrow: 1 }}>
                                        <Grid item xs={2} xsoffset={0} md={4} mdoffset={0}>
                                            <a className='artist_venuename' href={url}>
                                                <div className='artist_venuename'>{name}</div>
                                            </a>
                                        </Grid>
                                        <Grid item xs={2} xsoffset={0} md={4} mdoffset={0}>
                                            <a className='artist_venuecity' href={url}>
                                                <div className='artist_venuecity'>{city}</div>
                                            </a>
                                        </Grid>
                                        <Grid item xs={2} xsoffset={0} md={4} mdoffset="auto">
                                            <a className='artist_venuedate' href={url}>
                                                <div className='artist_venuedate'>
                                                    {new Date(date).toLocaleDateString('en-gb', {
                                                        year: 'numeric',
                                                        day: 'numeric',
                                                        month: 'long'
                                                    })}
                                                </div>
                                            </a>
                                        </Grid>
                                    </Grid>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
