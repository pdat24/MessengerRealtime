/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import scss from '../chatroom.module.scss';
import { Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import scrollToBottom from './scrollToBottom';
import { useContext, useMemo } from 'react';
import { Context } from '../ChatRoomContext';
import axios from 'axios';
import { Message } from '~/utils/types';
import { ITextInput } from './inputTypes';
import { useUpdateLatestMessage } from '~/utils/hooks';
import receiveOnlineMessage from '~/utils/functions/receiveOnlineMessage';
import { connection } from '~/utils/functions/chatOnline';

const iconLike =
    'https://firebasestorage.googleapis.com/v0/b/messengerrealtime-134d1.appspot.com/o/emojis%2Flike.png?alt=media&token=26b01fe8-0740-436f-a8f1-9c3787e188cc';

export default function SendActiveEmojiBtn({ setMessages }: ITextInput) {
    const activeEmoji = useSelector(({ root }) => root.emoji) || iconLike;
    const userDbId: string = useSelector(({ root }) => root.userDbId);
    const conversationAPI: string = useSelector(({ root }) => root.APIs.conversation);
    const chatRoomInfo = useContext(Context);
    const updateLatestMessage = useUpdateLatestMessage();

    useMemo(() => {
        receiveOnlineMessage({
            type: 'icon',
            onSetMessages: setMessages,
            onUpdateLatestMessage: updateLatestMessage,
        });
    }, []);

    const handleSendActiveEmojis = async () => {
        // update UI
        const newMessage: Message = {
            senderId: userDbId,
            message: {
                content: activeEmoji,
                type: 'icon',
            },
        };
        setMessages((messages) => [...messages, newMessage]);
        scrollToBottom();
        if (chatRoomInfo?.friendId) {
            // update new message
            updateLatestMessage(newMessage, chatRoomInfo.friendId);
            // upload to server
            await axios.post(`${conversationAPI}/${chatRoomInfo?.conversionId}`, newMessage, {
                headers: { 'Content-Type': 'Application/json' },
            });
            connection.send('SendPrivateMessage', userDbId, chatRoomInfo?.friendId, activeEmoji, 'icon');
        }
    };
    return (
        <Tooltip placement="top" title="Gửi biểu tượng này" arrow>
            <div className={scss.btn} onClick={handleSendActiveEmojis}>
                <img src={activeEmoji} alt="emoji" css={styles.activeEmojiStyle} />
            </div>
        </Tooltip>
    );
}

const styles = {
    activeEmojiStyle: css`
        width: 30px;
        height: 30px;
    `,
};
