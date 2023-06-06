import axios from "axios";
import React, { useEffect } from "react";
import { reducerCases } from "../../utils/Constants";
import { useStateProvider } from "../../utils/StateProvider";
import "./TopArtists.css";
import Grid from '@mui/material/Grid';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export default function TopArtists() {
    const [{ token, allArtists }, dispatch] = useStateProvider();
    useEffect(() => {
        const getArtistData = async () => {
            const response = await axios.get(
                "https://api.spotify.com/v1/me/top/artists",
                {
                    headers: {
                        Authorization: "Bearer " + token,
                        "Content-Type": "application/json",
                    },
                }
            );
            const { items } = response.data;
            console.log(items);
            let counter = 1 ;
            const allArtists = items.map(({ name, id }) => {
                let totalArtists = counter ++ ;
                return { name, id, totalArtists };
            });
            dispatch({ type: reducerCases.GET_ALL_ARTISTS, allArtists });
        };
        getArtistData();
    }, [token, dispatch]);
    return (
        <div className="topArtists-wrapper">
            <div className="topArtists-title">YOUR TOP ARTISTS</div>
            <ul className="topArtists-lists">
                {allArtists?.map(({ name, id, totalArtists }) => {
                    return (
                        <li className="topArtists-artist" key={id}>
                            <Grid container spacing={3} sx={{ flexGrow: 1 }}>
                                <Grid item xs={6} xsoffset={3} md={2} mdoffset={0}>
                                    <div className="topArtists-artist-num">{totalArtists}</div> 
                                </Grid>
                                <Grid item xs={6} xsoffset={3} md={9} mdoffset={0}>
                                    <div className="topArtists-artist-name">{name}</div>
                                </Grid>
                                <Grid item xs={6} xsoffset={3} md={1} mdoffset="auto">
                                    <MoreHorizIcon className="topArtists-artist-more" />
                                </Grid>
                            </Grid>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}