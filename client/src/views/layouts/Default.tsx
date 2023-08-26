import { ReactElement, useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import ChatRoom from './ChatRoom';
import { IUsers } from '~/utils/types';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setActiveChatbox, setActiveGroupRoom, setFriendRequestsSent } from '~/utils/redux/rootSlice';
import GroupRoom from '../pages/groups/GroupRoom';

function DefaultLayout({ children }: { children: ReactElement }) {
    const dispatch = useDispatch();
    const friendRequestsSent = useSelector(({ root }) => root.friendRequestsSent) as IUsers[];
    const friendRequestsAPIPath = useSelector(({ root }) => root.APIs.friendRequests);
    const userId = useSelector(({ root }) => root.userId);
    const [openGroupChat, setOpenGroupChat] = useState(location.href.split('/').at(-1) === 'groups');

    useEffect(() => {
        (async () => {
            if (friendRequestsSent.length === 0) {
                const res = await axios.get(`${friendRequestsAPIPath}/${userId}/sent`);
                const usersSent = res.data as Array<IUsers>;
                dispatch(setFriendRequestsSent(usersSent));
            }
        })();
        window.addEventListener('openGroupChat', () => {
            setOpenGroupChat(true);
            dispatch(setActiveGroupRoom(-1));
        });
        window.addEventListener('openPrivateChat', () => {
            setOpenGroupChat(false);
            dispatch(setActiveChatbox(-1));
        });
    }, []);

    return (
        <div className="flex">
            <div className="flex">
                <Sidebar />
                {children}
            </div>
            <div className="flex-grow">{openGroupChat ? <GroupRoom /> : <ChatRoom />}</div>
        </div>
    );
}

export default DefaultLayout;
