/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IChatBox, Message } from '~/utils/types';

const renderNewMessage = (userDbId: string, message?: Message) => {
    let result = '';
    if (message) {
        if (message.message.type === 'text') result = message.message.content;
        else if (message.message.type === 'file') result = 'Đã gửi tệp đính kèm';
        else if (message.message.type === 'image') result = 'Đã gửi ảnh';
        else if (message.message.type === 'icon') result = 'Đã gửi biểu tượng';
        if (message.senderId === userDbId) result = 'Bạn: ' + result;
    }
    return result;
};

interface IType extends IChatBox {
    active?: boolean;
}

function ChatBox({ username, latestMessage, avatarUrl, read, friendId, active }: IType) {
    const userDbId = useSelector(({ root }) => root.userDbId);
    const [newMsg, setNewMsg] = useState(renderNewMessage(userDbId, latestMessage));
    const [readMsg, setReadMsg] = useState(read);

    useEffect(() => {
        window.addEventListener('sentNewMessage', (e: CustomEventInit) => {
            if (e.detail.friendId === friendId) {
                setNewMsg(renderNewMessage(userDbId, e.detail.content));
            }
        });

        window.addEventListener('changeToUnreadMessage', (e: CustomEventInit) => {
            if (e.detail === friendId) setReadMsg(false);
        });
    });

    return (
        <div
            css={styles.container}
            onClick={() => setReadMsg(true)}
            style={
                active
                    ? {
                          backgroundColor: 'var(--bg-hover)',
                          outline: '1px solid var(--secondary-color2)',
                      }
                    : {}
            }
        >
            <div className="flex gap-2 items-center w-full">
                <img src={avatarUrl} alt="avatar" css={styles.avatar} className="shrink-0" />
                <div className="overflow-hidden flex-grow">
                    <h6 css={styles.name} className="mb-1">
                        {username}
                    </h6>
                    <span css={!readMsg ? styles.unreadMsg : styles.readMsg}>{newMsg}</span>
                </div>
                <div className="shrink-0">
                    {!readMsg ? (
                        <div css={styles.unreadDot}></div>
                    ) : (
                        <img src={avatarUrl} alt="avatar" css={styles.subAvatar} />
                    )}
                </div>
            </div>
        </div>
    );
}

const newMessage = css`
    white-space: nowrap;
    display: block;
    width: 90%;
    text-overflow: ellipsis;
    overflow: hidden;
`;

const styles = {
    container: css`
        border-radius: 8px;
        display: flex;
        align-items: center;
        padding: 8px;
        justify-content: space-between;
        cursor: pointer;
        margin-bottom: 4px;
        &:hover {
            background-color: var(--bg-hover);
        }
    `,
    avatar: css`
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: 1px solid #bbbbbb;
    `,
    name: css`
        font-size: 15px;
        line-height: 20px;
    `,
    unreadMsg: css`
        ${newMessage}
        font-size: 13px;
        color: var(--text-color);
        font-weight: 600;
    `,
    readMsg: css`
        ${newMessage}
        font-size: 13px;
        color: #a3a3a3;
    `,
    subAvatar: css`
        width: 16px;
        height: 16px;
        border-radius: 50%;
    `,
    unreadDot: css`
        width: 10px;
        height: 10px;
        background-color: var(--primary-color);
        border-radius: 50%;
    `,
};

export default ChatBox;
