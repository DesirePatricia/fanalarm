import { reducerCases } from "./Constants";

export const initialState = {
    token: null,
    userInfo: null,
    allArtists: [],
    aritst: null,
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
                allArtists: action.allArtists,
            };
        default:
            return state;
    }
};

export default reducer;