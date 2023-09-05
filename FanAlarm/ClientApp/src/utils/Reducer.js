import { reducerCases } from "./Constants";

export const initialState = {
    token: null,
    userInfo: null,
    allArtists: [],
    artist: null,
    artists: [],
    topArtists: [],
    artistDetails: [],
    artistSearch: [],
};

const reducer = (state, action) => {
    switch (action.type) {
        case reducerCases.SET_TOKEN:
            return {
                ...state,
                token: action.token,
            };
        case reducerCases.SET_USER:
            return {
                ...state,
                userInfo: action.userInfo,
            };
        case reducerCases.GET_ARTIST:
            return {
                ...state,
                artist: action.artist,
            };
        case reducerCases.GET_ALL_ARTISTS:
            return {
                ...state,
                artists: action.artists,
            };
        case reducerCases.GET_TOP_ARTISTS:
            return {
                ...state,
                topArtists: action.topArtists,
            };
        case reducerCases.GET_ARTIST_DETAILS:
            return {
                ...state,
                artistDetails: action.artistDetails,
            };

        case reducerCases.GET_SEARCH_ARTIST:
            return {
                ...state,
                artistSearch: action.artistSearch,
            };
        default:
            return state;
    }
};

export default reducer;