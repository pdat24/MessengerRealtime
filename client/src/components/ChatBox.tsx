/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { IChatBox } from '~/utils/types';

function ChatBox({ username, newMessage, avatarUrl, unread, conversation }: IChatBox) {
    const handleClick = () => {
        window.dispatchEvent(
            new CustomEvent('selectedAChat', {
                detail: {
                    username,
                    newMessage,
                    avatarUrl,
                    unread,
                    conversation,
                },
            })
        );
    };

    return (
        <div css={styles.container} onClick={handleClick}>
            <div className="flex gap-2 items-center">
                <img src={avatarUrl} alt="avatar" css={styles.avatar} />
                <div>
                    <h6 css={styles.name}>{username}</h6>
                    <span css={unread ? styles.unreadMsg : styles.readMsg}>{newMessage}</span>
                </div>
            </div>
            <div css={styles.right}>
                {unread ? (
                    <div css={styles.unreadDot}></div>
                ) : (
                    <img src={avatarUrl} alt="avatar" css={styles.subAvatar} />
                )}
            </div>
        </div>
    );
}

const styles = {
    container: css`
        border-radius: 8px;
        transition: all 0.15s ease;
        display: flex;
        align-items: center;
        padding: 8px;
        justify-content: space-between;
        cursor: pointer;

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
        font-size: 13px;
        color: var(--text-color);
        font-weight: 600;
    `,
    readMsg: css`
        font-size: 13px;
        color: #a3a3a3;
    `,
    right: css``,
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
