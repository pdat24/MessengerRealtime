import { Groups, Chat, MakeFriend, FriendRequests } from '../views/pages';

export default [
    { path: '/', component: Chat },
    { path: '/chatroom', component: Chat },
    { path: '/make-friend', component: MakeFriend },
    { path: '/friend-requests', component: FriendRequests },
    { path: '/groups', component: Groups },
];
