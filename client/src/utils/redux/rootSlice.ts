import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    topic: '',
    emoji: '',
    APIUrls: {
        userAPIUrl: 'https://localhost:7101/api/user',
    },
};

const rootSlice = createSlice({
    name: 'root',
    initialState,
    reducers: {
        setTopic(state, action) {
            state.topic = action.payload;
        },
        setEmoji(state, action) {
            state.emoji = action.payload;
        },
    },
});

export const { setTopic, setEmoji } = rootSlice.actions;
export default rootSlice.reducer;
