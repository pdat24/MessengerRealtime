import { useEffect, useState } from 'react';
import Profile from './profile';
import Room from './room';
import ChatRoomContext from './ChatRoomContext';
import { IChatBox } from '~/utils/types';

function ChatRoom() {
    const [selectedChat, setSelectedChat] = useState(false);
    const [chatBox, setChatBox] = useState<IChatBox>({
        username: '',
        avatarUrl: '',
        conversation: [],
        newMessage: '',
    });

    useEffect(() => {
        const handler = (e: CustomEventInit<IChatBox>) => {
            setSelectedChat(true);
            setChatBox(e.detail as IChatBox);
        };
        window.addEventListener('selectedAChat', handler);
    }, []);
    return selectedChat ? (
        <ChatRoomContext value={chatBox}>
            <div className="flex overflow-hidden">
                <Room />
                <Profile />
            </div>
        </ChatRoomContext>
    ) : (
        <div>Select a conversation to continue</div>
    );
}

export default ChatRoom;
