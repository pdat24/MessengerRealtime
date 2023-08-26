/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import { Tooltip } from '@mui/material';

function FileMessageLeft({
    filename,
    uri,
    senderAvatar,
    senderName,
}: {
    filename: string;
    uri: string;
    senderName: string;
    senderAvatar: string;
}) {
    return (
        <div css={styles.container} className="mt-1 my-2 me-auto w-fit">
            <Tooltip title={senderName}>
                <img alt="avatar" css={styles.avatar} src={senderAvatar} />
            </Tooltip>
            <a css={styles.file} href={uri} download={filename}>
                <span className="underline">
                    <DownloadForOfflineIcon className="me-1" />
                    {filename}
                </span>
            </a>
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
        margin-bottom: 3px;
        margin-right: auto;
        display: flex;
        width: fit-content;
        max-width: 45%;
        align-items: center;
    `,
    file: css`
        border-radius: 16px;
        background-color: var(--secondary-color3);
        padding: 8px 12px;
        font-size: 15px;
        display: block;
        font-weight: 500;
        line-break: anywhere;
    `,
};

export default FileMessageLeft;
