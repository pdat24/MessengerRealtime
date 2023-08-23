import scrollToBottom from '~/views/layouts/ChatRoom/Input/scrollToBottom';
import { IChatBox, Message } from '../types';
import { Dispatch, SetStateAction } from 'react';

interface IReceiveOnlineMessage {
    type: 'text' | 'image' | 'file' | 'icon';
    onSetMessages: Dispatch<SetStateAction<Message[]>>;
    onUpdateLatestMessage: (message: Message, friendDbId: string, updateDb?: boolean) => void;
}

function receiveOnlineMessage({ type, onSetMessages, onUpdateLatestMessage }: IReceiveOnlineMessage) {
    window.addEventListener('selectedAChat', (e: CustomEventInit) => {
        const data = e.detail as IChatBox;
        sessionStorage.setItem('friendIdIsChatting', data.friendId!);
    });
    window.addEventListener('haveNewOnlineMessage', (e: CustomEventInit) => {
        const data = e.detail as Message;
        if (data.message.type === type) {
            if (sessionStorage.getItem('friendIdIsChatting') === data.senderId) {
                onSetMessages((messages) => [...messages, data]);
            }
            onUpdateLatestMessage(data, data.senderId, false);
            scrollToBottom();
        }
    });
}

export default receiveOnlineMessage;
