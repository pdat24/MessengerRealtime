/**@jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';
import Profile from './profile';
import Room from './room';
import ChatRoomContext from './ChatRoomContext';
import { IChatBox } from '~/utils/types';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import { css } from '@emotion/react';

function ChatRoom() {
    const [selectedChat, setSelectedChat] = useState(false);
    const [chatBox, setChatBox] = useState<IChatBox>({
        username: '',
        avatarUrl: '',
        conversation: [],
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
        <div className="h-full w-full flex justify-center items-center">
            <div className="flex items-center flex-col">
                <QuestionAnswerOutlinedIcon css={styles.icon} />
                <div className="mt-2" css={styles.text}>
                    Chọn một hội thoại để tiếp tục
                </div>
            </div>
        </div>
    );
}

const styles = {
    text: css`
        color: var(--secondary-color);
        font-size: 20px;
        font-weight: 500;
    `,
    icon: css`
        font-size: 100px;
        path {
            color: var(--secondary-color);
        }
    `,
};

export default ChatRoom;
