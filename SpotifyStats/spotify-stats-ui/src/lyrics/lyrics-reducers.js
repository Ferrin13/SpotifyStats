import axios from "axios";

const initialState = { lyrics: "", searching: false, modal: false, title: "title", artist: "artist"   };

const callLyrics = 'CALL_LYRICS_API';
const recieveLyrics = 'RECIEVE_LYRICS_API';

const toggleSearch = "TOGGLE_SEARCH";
const toggleModal = "TOGGLE_MODAL";


export const actionCreators = {
    toggleModal: () => ({ type: toggleModal }),
    toggleSearch: () => ({ type: toggleSearch }),
    requestLyrics: (artist, title) => async (dispatch) => {

        dispatch({ type: callLyrics, artist, title });

        let apikey = 'EawCwK89ZMoTgplpHx6Dua7xE5p6ROiPUsZIfeFvWeSgMmBApwd0K5uwl4cbR8Vk';

        let url = 'https://orion.apiseeds.com/api/music/lyric/' + artist + '/' + title + '?apikey=' + apikey;

        const response = await axios.get(url, { 'headers': { 'apikey': apikey } })
            .then(res => res.data.result.track.text)
            .catch(e => "no lyrics were found");

        let lyrics;
        if (response === "no lyrics were found") {
            lyrics = "no lyrics were found"
        } else {
            lyrics = await response;
        }

        dispatch({ type: recieveLyrics, artist, title, lyrics });

    }
};


export const reducer = (state, action) => {
    state = state || initialState;
    if (action.type === callLyrics) {
        return {
            ...state,
            lyrics: "loading...",
            modal: true,
            artist: action.artist,
            title: action.title
        };
    }
    if (action.type === recieveLyrics) {
        return {
            ...state,
            lyrics: action.lyrics,
            artist: action.artist,
            title: action.title
        };
    }
    if (action.type === toggleSearch)
        return {
            ...state,
            searching: !state.searching
        }
    if (action.type === toggleModal)
        return {
            ...state,
            modal: !state.modal
        }
    return state;
};
