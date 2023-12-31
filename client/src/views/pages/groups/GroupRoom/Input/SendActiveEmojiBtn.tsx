/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import scss from '../chatroom.module.scss';
import { Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import scrollToBottom from './scrollToBottom';
import { useContext } from 'react';
import { Context } from '../RoomContext';
import axios from 'axios';
import { Message } from '~/utils/types';
import { ITextInput } from './inputTypes';
import useListenMessageInGroup from '~/utils/hooks/useListenMessageInGroup';
import { connection } from '~/utils/functions/chatOnline';

const iconLike =
    'https://firebasestorage.googleapis.com/v0/b/messengerrealtime-134d1.appspot.com/o/emojis%2Flike.png?alt=media&token=26b01fe8-0740-436f-a8f1-9c3787e188cc';

export default function SendActiveEmojiBtn({ setMessages }: ITextInput) {
    const activeEmoji = useSelector(({ root }) => root.emoji) || iconLike;
    const userDbId: string = useSelector(({ root }) => root.userDbId);
    const conversationAPI: string = useSelector(({ root }) => root.APIs.conversation);
    const group = useContext(Context);

    useListenMessageInGroup({
        conversationId: group!.conversationId,
        updateMessages: setMessages,
        type: 'icon',
    });

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
        // upload to server
        await axios.post(`${conversationAPI}/${group?.conversationId}`, newMessage);
        connection.send('SendGroupMessage', userDbId, group?.id, group?.conversationId, activeEmoji, 'icon');
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
