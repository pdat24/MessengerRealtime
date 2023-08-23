/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import scss from '../chatroom.module.scss';
import clsx from 'clsx';
import { Tooltip } from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import scrollToBottom from './scrollToBottom';
import EmojiMessage from '~/components/EmojiMessage';
import { ITextInput } from './inputTypes';
import axios from 'axios';
import { Context } from '../ChatRoomContext';
import { Message } from '~/utils/types';
import { useUpdateLatestMessage } from '~/utils/hooks';

function SendTextBtn({ setMessages }: ITextInput) {
    const userDbId: string = useSelector(({ root }) => root.userDbId);
    const conversationAPIPath = useSelector(({ root }) => root.APIs.conversation);
    const [text, setText] = useState('');
    const chatRoomInfo = useContext(Context);
    const updateLatestMessage = useUpdateLatestMessage();

    const handleSendText = () => {
        if (text) {
            const newMessage: Message = {
                senderId: userDbId,
                message: {
                    content: text,
                    type: 'text',
                },
            };
            setMessages((messages) => [...messages, newMessage]);
            axios.post(`${conversationAPIPath}/${chatRoomInfo?.conversionId}`, newMessage);
            chatRoomInfo?.friendId && updateLatestMessage(newMessage, chatRoomInfo.friendId);
            setText('');
            scrollToBottom();
        }
    };

    const handleSendTextByEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSendText();
    };
    return (
        <>
            <EmojiMessage setMessage={setText} />
            <div css={styles.entry} className="mx-2">
                <input
                    autoFocus
                    type="text"
                    placeholder="Aa"
                    className="bg-transparent pe-5 border-0 outline-0 flex-grow text-sm"
                    value={text}
                    onKeyDown={handleSendTextByEnter}
                    onChange={(e) => setText(e.target.value)}
                />
                <Tooltip placement="top" title="Gửi" arrow>
                    <div className={scss.btn} css={styles.emoji} onClick={handleSendText}>
                        <SendRoundedIcon className={clsx(scss.icon, 'fs-22')} />
                    </div>
                </Tooltip>
            </div>
        </>
    );
}

const styles = {
    entry: css`
        background-color: var(--bg-hover);
        display: flex;
        align-items: center;
        border-radius: 24px;
        padding: 2px 0 2px 12px;
        flex: 1;
    `,
    emoji: css`
        &:hover {
            background-color: var(--secondary-color2);
        }
    `,
};

export default SendTextBtn;
