/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import scss from '../chatroom.module.scss';
import { Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import scrollToTop from './scrollToTop';
import { useContext } from 'react';
import { Context } from '../ChatRoomContext';
import axios from 'axios';
import { Message } from '~/utils/types';
import { ITextInput } from './inputTypes';
import iconLike from '~/assets/imgs/emojies/like.png';

export default function SendActiveEmojiBtn({ setMessages }: ITextInput) {
    const activeEmoji = useSelector(({ root }) => root.emoji) || iconLike;
    const userDbId: string = useSelector(({ root }) => root.userDbId);
    const conversationAPI: string = useSelector(({ root }) => root.APIs.conversation);
    const chatRoomInfo = useContext(Context);

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
        scrollToTop();
        // upload to server
        await axios.post(`${conversationAPI}/${chatRoomInfo?.conversionId}`, newMessage, {
            headers: { 'Content-Type': 'Application/json' },
        });
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
