/**@jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Tooltip } from '@mui/material';

function PictureMessageLeft({
    imgUri,
    senderAvatar,
    senderName,
}: {
    imgUri: string;
    senderName: string;
    senderAvatar: string;
}) {
    return (
        <div css={styles.container} className="mt-1 w-1/2 me-auto my-3">
            <Tooltip title={senderName}>
                <img alt="photo" css={styles.avatar} src={senderAvatar} />
            </Tooltip>
            <img alt="picture" src={imgUri} className="flex-1 rounded-2xl border border-solid border-color" />
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
        align-items: center;
    `,
};

export default PictureMessageLeft;
