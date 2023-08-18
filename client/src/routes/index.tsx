import { Archive, ChatRoom, Friends, Unread } from '../views/pages';

export default [
    { path: '/', component: ChatRoom },
    { path: '/chatroom', component: ChatRoom },
    { path: '/archive', component: Archive },
    { path: '/unread', component: Unread },
    { path: '/friends', component: Friends },
];
