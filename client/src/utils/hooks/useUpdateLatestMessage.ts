import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Message } from '~/utils/types';
import { setLatestMessage } from '../redux/rootSlice';

export default function useUpdateLatestMessage() {
    const userDbId: string = useSelector(({ root }) => root.userDbId);
    const latestMessageAPIPath = useSelector(({ root }) => root.APIs.latestMessage);
    const dispatch = useDispatch();

    return (message: Message, friendDbId: string) => {
        dispatch(setLatestMessage({ friendDbId, message }));
        axios.put(`${latestMessageAPIPath}/${userDbId}/${friendDbId}`, message);
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
