/**@jsxImportSource @emotion/react */
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { css } from '@emotion/react';
import { Dispatch, SetStateAction } from 'react';
import scss from '../views/pages/chatroom/chatroom.module.scss';
import { emojies } from '~/utils/vars';
import { useDispatch } from 'react-redux';
import { setEmoji } from '~/utils/redux/rootSlice';

interface IActiveEmojiPicker {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}
export default function ActiveEmojiPicker({ open, setOpen }: IActiveEmojiPicker) {
    const dispatch = useDispatch();
    const handlePick = (topic: string) => {
        dispatch(setEmoji(topic));
        setOpen(false);
    };

    return (
        <div>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box css={styles.container}>
                    <div className="flex flex-col">
                        <div css={styles.header} className="mb-3">
                            <h3 className="text-center font-medium flex-grow">Biểu tượng cảm xúc</h3>
                            <div className={scss.btn} onClick={() => setOpen(false)}>
                                <CloseIcon />
                            </div>
                        </div>
                        <div className="flex flex-wrap flex-grow overflow-auto">
                            {emojies.map((emoji, index) => (
                                <div css={styles.emojiDemoWrapper} key={index} onClick={() => handlePick(emoji)}>
                                    <img src={emoji} css={styles.emojiDemo} />
                                </div>
                            ))}
                        </div>
                        <div css={styles.detach} onClick={() => handlePick('')} className="mt-4">
                            <CloseIcon css={styles.detachIcon} />
                            <span className="text-sm">Gỡ</span>
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

const styles = {
    container: css`
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        background-color: var(--bg-color);
        box-shadow: 24px;
        padding: 16px;
        border-radius: 8px;
        border: none;
    `,
    header: css`
        display: flex;
        align-items: center;
        justify-content: center;
    `,
    emojiDemo: css`
        width: 30px;
        height: 30px;
    `,
    emojiDemoWrapper: css`
        border-radius: 16px;
        transition: all 0.15s ease;
        cursor: pointer;
        padding: 8px;

        &:hover {
            background-color: var(--bg-hover);
        }
    `,
    detachIcon: css`
        font-size: 20px;
    `,
    detach: css`
        display: flex;
        gap: 4px;
        padding: 4px 12px;
        background-color: var(--secondary-color2);
        border-radius: 5px;
        width: fit-content;
        margin-top: 8px;
        margin-left: auto;
        cursor: pointer;
    `,
};
