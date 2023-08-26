/**@jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Tooltip } from '@mui/material';

function ActiveEmojiMessageLeft({
    imgUri,
    senderAvatar,
    senderName,
}: {
    imgUri: string;
    senderName: string;
    senderAvatar: string;
}) {
    return (
        <div css={styles.container} className="mt-1 me-auto my-1">
            <Tooltip title={senderName}>
                <img alt="avatar" css={styles.avatar} src={senderAvatar} />
            </Tooltip>
            <img alt="picture" src={imgUri} css={{ width: '40px' }} />
        </div>
    );
}

const styles = {
    avatar: css`
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 1px solid var(--secondary-color2);
        margin-right: 4px;
        flex-shrink: 0;
    `,
    container: css`
        display: flex;
        width: fit-content;
        align-items: center;
    `,
};

export default ActiveEmojiMessageLeft;
