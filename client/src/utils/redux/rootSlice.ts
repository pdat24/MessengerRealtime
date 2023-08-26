import { createSlice } from '@reduxjs/toolkit';
import { IFriendInfo, IGroupBox, Message } from '../types';

interface IStateSchema {
    topic: string;
    emoji: string;
    APIs: {
        user: string;
        friends: string;
        friendRequests: string;
        conversation: string;
        latestMessage: string;
        messagesViaType: string;
        groups: string;
    };
    userId: string | undefined;
    userDbId: string | undefined;
    friendList: IFriendInfo[];
    friendRequestsSent: string[];
    haveNewFriend: boolean;
    activeChatbox: string;
    activeGroupRoom: string;
    groupList: IGroupBox[];
}

const initialState: IStateSchema = {
    topic: '',
    emoji: '',
    APIs: {
        user: 'https://localhost:7101/api/user',
        friends: 'https://localhost:7101/api/friends',
        friendRequests: 'https://localhost:7101/api/friendRequests',
        conversation: 'https://localhost:7101/api/conversation',
        latestMessage: 'https://localhost:7101/api/latestMessage',
        messagesViaType: 'https://localhost:7101/api/messages',
        groups: 'https://localhost:7101/api/groups',
    },
    userId: sessionStorage.getItem('user_id')!,
    userDbId: sessionStorage.getItem('user_DbId')!,
    friendList: [],
    friendRequestsSent: [],
    haveNewFriend: false,
    activeChatbox: '',
    activeGroupRoom: '',
    groupList: [],
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
        setFriendList(state, action) {
            state.friendList = action.payload;
        },
        addGroupList(state, action) {
            state.groupList = [...state.groupList, action.payload];
        },
        setGroupList(state, action) {
            state.groupList = action.payload;
        },
        setFriendRequestsSent(state, action) {
            state.friendRequestsSent = action.payload;
        },
        setFefreshFriendList(state, action) {
            state.haveNewFriend = action.payload;
        },
        setActiveChatbox(state, action) {
            state.activeChatbox = action.payload;
        },
        setActiveGroupRoom(state, action) {
            state.activeGroupRoom = action.payload;
        },
        setLatestMessage(state, action) {
            const data = action.payload as {
                message: Message;
                friendDbId: string;
            };
            state.friendList.forEach((friend) => {
                if (friend.id === data.friendDbId) {
                    friend.latestMessage = data.message;
                }
            });
        },
    },
});

export const {
    setTopic,
    setEmoji,
    setFriendList,
    setFriendRequestsSent,
    setLatestMessage,
    setFefreshFriendList,
    addGroupList,
    setGroupList,
    setActiveChatbox,
    setActiveGroupRoom,
} = rootSlice.actions;
export default rootSlice.reducer;
