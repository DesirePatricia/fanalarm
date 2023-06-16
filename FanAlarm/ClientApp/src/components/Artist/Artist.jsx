import React, { useEffect } from 'react';
import axios from "axios";
import { reducerCases } from "../../utils/Constants";
import { useStateProvider } from "../../utils/StateProvider";
import './Artist.css'
import { useParams } from 'react-router-dom';

export default function Artist() {
    const { name } = useParams();
    const baseURL = window.location.origin + "/api/getconcert/" + name;
    console.log(baseURL);
    const [{ token, allConcerts }, dispatch] = useStateProvider();
    useEffect(() => {
        const getArtistData = async () => {
            const response = await axios.get(
                baseURL,
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
            dispatch({ type: reducerCases.GET_ARTIST, allConcerts });
        };
        getArtistData();
    }, [token, dispatch]);

    return (
        <div className=''>
            <img className='artist_image' />
            <div className='artist_artistname'></div>
            <div className='artist_concertwrapper'>
                <div>Concerts in Your Area</div>
                <div>
                    <div className='artist_concertcity'></div>
                    <div className='artist_concertvenue'></div>
                    <div className='artist_concertdate'></div>
                </div>
            </div>
        </div>
    );
}