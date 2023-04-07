import axios from "axios";
import React, { useEffect } from "react";
import { reducerCases } from "../utils/Constants";
import { useStateProvider } from "../utils/StateProvider";

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
            const allArtists = items.map(({ name, id }) => {
                return { name, id };
            });
            dispatch({ type: reducerCases.GET_ALL_ARTISTS, allArtists });
        };
        getArtistData();
    }, [token, dispatch]);
    return (
        <div>
            <ul>
                {allArtists?.map(({ name, id }) => {
                    return (
                        <li key={id}>
                            {name}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}