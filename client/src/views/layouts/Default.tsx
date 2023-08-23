import { ReactElement, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatRoom from './ChatRoom';
import { IUsers } from '~/utils/types';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setFriendRequestsSent } from '~/utils/redux/rootSlice';

function DefaultLayout({ children }: { children: ReactElement }) {
    const dispatch = useDispatch();
    const friendRequestsSent = useSelector(({ root }) => root.friendRequestsSent) as IUsers[];
    const friendRequestsAPIPath = useSelector(({ root }) => root.APIs.friendRequests);
    const userId = useSelector(({ root }) => root.userId);

    useEffect(() => {
        (async () => {
            if (friendRequestsSent.length === 0) {
                const res = await axios.get(`${friendRequestsAPIPath}/${userId}/sent`);
                const usersSent = res.data as Array<IUsers>;
                dispatch(setFriendRequestsSent(usersSent));
            }
        })();
    }, []);

    return (
        <div className="flex">
            <div className="flex">
                <Sidebar />
                {children}
            </div>
            <div className="flex-grow">
                <ChatRoom />
            </div>
        </div>
    );
}

export default DefaultLayout;
