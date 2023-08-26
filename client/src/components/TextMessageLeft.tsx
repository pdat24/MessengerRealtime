/**@jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Tooltip } from '@mui/material';

function TextMessageLeft({
    children,
    senderAvatar,
    senderName,
}: {
    children: string;
    senderAvatar: string;
    senderName: string;
}) {
    return (
        <div css={styles.container} className="mt-1">
            <Tooltip title={senderName}>
                <img alt="photo" css={styles.avatar} src={senderAvatar} />
            </Tooltip>
            <div css={styles.message}>
                <span css={styles.text}>{children}</span>
            </div>
        </div>
    );
}

const styles = {
    message: css`
        padding: 4px 12px;
        border-radius: 20px;
        background-color: var(--leftmsg-bg);
    `,
    text: css`
        color: var(--text-color);
        font-size: 14px;
    `,
    avatar: css`
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 1px solid var(--secondary-color2);
        margin-right: 4px;
        flex-shrink: 0;
    `,
    container: css`
        margin-bottom: 3px;
        margin-right: auto;
        display: flex;
        width: fit-content;
        max-width: 90%;
        align-items: center;
    `,
};

export default TextMessageLeft;
