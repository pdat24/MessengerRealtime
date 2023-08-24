/**@jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import { useContext, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Message } from '~/utils/types';
import { Context } from '../ChatRoomContext';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import getFilename from '~/utils/functions/getFilename';

function FileModel() {
    const chatRoomInfo = useContext(Context);
    const [pictures, setPictures] = useState<Message[]>([]);
    const messagesViaTypePath = useSelector(({ root }) => root.APIs.messagesViaType);
    const [isLoading, setIsLoading] = useState(true);
    const container = useRef<HTMLDivElement>(null);

    useMemo(() => {
        axios.get(`${messagesViaTypePath}/${chatRoomInfo?.conversionId}/files`).then((res) => {
            setIsLoading(false);
            setPictures(res.data);
        });
    }, [chatRoomInfo]);

    const handleClose = () => {
        window.dispatchEvent(new CustomEvent('changeModel', { detail: 'profile' }));
    };

    return (
        <div css={styles.container} ref={container}>
            <div className="py-5 overflow-auto h-full px-2">
                <div className="flex w-fit cursor-pointer" onClick={handleClose}>
                    <div>
                        <ArrowBackIosIcon css={styles.backIcon} />
                    </div>
                    <h6>Kho tệp tin</h6>
                </div>
                <div className="mt-12">
                    {isLoading ? (
                        <div className="flex justify-center my-4">
                            <CircularProgress />
                        </div>
                    ) : pictures.length !== 0 ? (
                        <div className="flex flex-wrap justify-center">
                            {pictures.map((pictures, index) => {
                                const filename = getFilename(pictures.message.content);
                                return (
                                    <a
                                        key={index}
                                        css={styles.files}
                                        href={pictures.message.content}
                                        download={filename}
                                    >
                                        <span className="underline">
                                            <DownloadForOfflineIcon className="me-1" />
                                            {filename}
                                        </span>
                                    </a>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-center text-sm italic mt-5">Kho tệp tin trống!</p>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: css`
        flex: 1;
        height: 100vh;
        overflow: hidden;
        background-color: var(--bg-color);
        transition: all 500ms ease;
        z-index: 10;
    `,
    files: css`
        border-radius: 16px;
        background-color: var(--secondary-color3);
        padding: 8px 12px;
        font-size: 15px;
        display: block;
        font-weight: 500;
        line-break: anywhere;
        width: 100%;
        margin-bottom: 8px;
    `,
    backIcon: css`
        font-size: 18px;
        margin-right: 8px;
    `,
};

export default FileModel;
