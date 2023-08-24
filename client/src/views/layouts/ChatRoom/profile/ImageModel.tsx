/**@jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import { useContext, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Message } from '~/utils/types';
import { Context } from '../ChatRoomContext';

function ImageModel() {
    const chatRoomInfo = useContext(Context);
    const [pictures, setPictures] = useState<Message[]>([]);
    const messagesViaTypePath = useSelector(({ root }) => root.APIs.messagesViaType);
    const [isLoading, setIsLoading] = useState(true);
    const container = useRef<HTMLDivElement>(null);

    useMemo(() => {
        axios.get(`${messagesViaTypePath}/${chatRoomInfo?.conversionId}/images`).then((res) => {
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
                    <h6>Kho ảnh</h6>
                </div>
                <div className="mt-12">
                    {isLoading ? (
                        <div className="flex justify-center my-4">
                            <CircularProgress />
                        </div>
                    ) : pictures.length !== 0 ? (
                        <div className="flex flex-wrap gap-1 justify-center">
                            {pictures.map((pictures, index) => (
                                <a href={pictures.message.content} target="_blank" className="mb-2" key={index}>
                                    <img loading="lazy" css={styles.imgs} alt="photo" src={pictures.message.content} />
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-sm italic mt-5">Kho ảnh trống!</p>
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
    imgs: css`
        border-radius: 16px;
        border: 1px solid var(--secondary-color);
        width: 100%;
        object-fit: contain;
    `,
    backIcon: css`
        font-size: 18px;
        margin-right: 8px;
    `,
};

export default ImageModel;
