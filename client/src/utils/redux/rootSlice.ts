import { createSlice } from '@reduxjs/toolkit';
import jsCookie from 'js-cookie';

const initialState = {
    topic: '',
    emoji: '',
    APIs: {
        user: 'https://localhost:7101/api/user',
        friends: 'https://localhost:7101/api/friends',
        conversation: 'https://localhost:7101/api/conversation',
    },
    userId: jsCookie.get('user_id'),
    userDbId: jsCookie.get('user_DbId'),
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
