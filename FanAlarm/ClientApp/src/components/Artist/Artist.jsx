import React, { useEffect } from 'react';
import axios from "axios";
import { reducerCases } from "../../utils/Constants";
import { useStateProvider } from "../../utils/StateProvider";
import './Artist.css';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';

export default function Artist() {
    const { name } = useParams();
    const baseURL = window.location.origin + "/api/getconcert/" + name;
    console.log(baseURL);
    const [{ token, artistDetails }, dispatch] = useStateProvider();
    useEffect(() => {
        const getArtistData = async () => {
            const response = await axios.get(
                baseURL,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const items = response.data;
            console.log(items);
            const artistDetails = items.map(({ name, id, image, concerts, venues }) => {
                return { name, id, image, concerts, venues };
            });
            dispatch({ type: reducerCases.GET_ARTIST_DETAILS, artistDetails });
        };
        getArtistData();
    }, [token, dispatch]);

    return (
        <div className='artist_homewrapper'>
            <div className='artist_fanalarm'>Fan Alarm</div>
            <div className='artist_split'></div>
            {artistDetails.map(({ name, image, id, concerts, venues }) => {
                return (
                    <div className='artist_concertwrapper' key = {id}>
                                    <img className='artist_image' src={image} />
                                    <div className='artist_artistname' key={id}>{name}</div>
                        <div className='artist_concertdetails'>
                        <div className='artist_concerttitle'>Concerts in Your Area</div>
                        <div className='artist_split'></div>
                        <div className='artist_concerts'>
                                <div className='artist_concertname' key={id} >{concerts?.name}</div>
                            {venues?.map(({ name, venue_id, city, date, url }) => {
                                return (
                                    <div className='artist_venuewrapper'>
                                        <Grid className='artist_venuegrid' container spacing={1} sx={{ flexGrow: 1 }}>
                                            <Grid item xs={2} xsoffset={0} md={4} mdoffset={0}>
                                                <a className='artist_venuename' href={url}><div className='artist_venuename' key={venue_id}>{name}</div></a>
                                            </Grid>
                                            <Grid item xs={2} xsoffset={0} md={4} mdoffset={0}>
                                                <a className='artist_venuecity' href={url}><div className='artist_venuecity' key={venue_id}>{city}</div></a>
                                            </Grid>
                                            <Grid item xs={2} xsoffset={0} md={4} mdoffset="auto">
                                                <a className='artist_venuedate' href={url}>
                                                <div className='artist_venuedate' key={venue_id}>{new Date(date).toLocaleDateString(
                                                    'en-gb',
                                                    {
                                                        year: 'numeric',
                                                        day: 'numeric',
                                                        month: 'long'

                                                    }
                                                )}</div>
                                                </a>
                                            </Grid>
                                        </Grid>
                                    </div>
                                );
                            })}
                        </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}