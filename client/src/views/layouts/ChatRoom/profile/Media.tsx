/**@jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react';
import ImageIcon from '@mui/icons-material/Image';
import FilePresentIcon from '@mui/icons-material/FilePresent';

export default function Media() {
    const [drop, setDrop] = useState(false);
    const handleOpenImageModel = () => {
        window.dispatchEvent(new CustomEvent('changeModel', { detail: 'image' }));
    };
    const handleOpenFileModel = () => {
        window.dispatchEvent(new CustomEvent('changeModel', { detail: 'file' }));
    };

    return (
        <div>
            <div css={styles.chatInfo} onClick={() => setDrop(!drop)}>
                <span className="font-bold flex-grow">Ảnh và file đính kèm</span>
                {drop ? <KeyboardArrowDownIcon /> : <ChevronRightRoundedIcon />}
            </div>
            {drop && (
                <div className="ms-4">
                    <div css={styles.chatInfo} onClick={handleOpenImageModel}>
                        <ImageIcon className="fs-22" />
                        <span className="font-bold ms-2 text-sm">Ảnh</span>
                    </div>
                    <div css={styles.chatInfo} onClick={handleOpenFileModel}>
                        <FilePresentIcon className="fs-22" />
                        <span className="font-bold ms-2 text-sm">File đính kèm</span>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    chatInfo: css`
        display: flex;
        align-items: center;
        border-radius: 6px;
        padding: 10px;
        transition: all ease 0.15s;
        cursor: pointer;
        user-select: none;

        &:hover {
            background-color: var(--bg-hover);
        }
    `,
};
