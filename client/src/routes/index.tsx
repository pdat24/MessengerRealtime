import { Groups, ChatRoom, Friends, FriendRequests } from '../views/pages';

export default [
    { path: '/', component: ChatRoom },
    { path: '/chatroom', component: ChatRoom },
    { path: '/friends', component: Friends },
    { path: '/friend-requests', component: FriendRequests },
    { path: '/groups', component: Groups },
];
