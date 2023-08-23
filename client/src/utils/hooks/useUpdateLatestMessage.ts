import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { IFriendInfo, Message } from '~/utils/types';
import { setFriendList, setLatestMessage } from '../redux/rootSlice';

export default function useUpdateLatestMessage() {
    const userDbId: string = useSelector(({ root }) => root.userDbId);
    const friendList = useSelector(({ root }) => root.friendList) as Array<IFriendInfo>;
    const latestMessageAPIPath = useSelector(({ root }) => root.APIs.latestMessage);
    const dispatch = useDispatch();

    return (message: Message, friendDbId: string, updateDb: boolean = true) => {
        dispatch(setLatestMessage({ friendDbId, message }));
        if (updateDb) {
            // when send message
            axios.put(`${latestMessageAPIPath}/${userDbId}/${friendDbId}`, message);
        } else {
            // when receive
            if (sessionStorage.getItem('friendIdIsChatting') === friendDbId) {
                axios.put(`${latestMessageAPIPath}/${userDbId}/${friendDbId}/read`);
            } else {
                dispatch(
                    setFriendList(
                        friendList.map((friend) => {
                            if (friend.id === friendDbId) {
                                window.dispatchEvent(new CustomEvent('changeToUnreadMessage', { detail: friend.id }));
                                return { ...friend, read: false };
                            }
                            return friend;
                        })
                    )
                );
                axios.put(`${latestMessageAPIPath}/${userDbId}/${friendDbId}/unread`);
            }
        }
        window.dispatchEvent(
            new CustomEvent('sentNewMessage', {
                detail: {
                    friendId: friendDbId,
                    content: message,
                },
            })
        );
    };
}
