/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';

function FileMessage({ filename, uri }: { filename: string; uri: string }) {
    const style = css`
        border-radius: 16px;
        background-color: var(--secondary-color3);
        padding: 8px 12px;
        width: fit-content;
        max-width: 40%;
        font-size: 15px;
        display: block;
        margin-left: auto;
        font-weight: 500;
        line-break: anywhere;
    `;
    return (
        <a css={style} className="my-2" href={uri} download={filename}>
            <span className="underline">
                <DownloadForOfflineIcon className="me-1" />
                {filename}
            </span>
        </a>
    );
}

export default FileMessage;
