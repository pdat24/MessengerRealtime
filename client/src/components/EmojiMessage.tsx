/**@jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { Tooltip } from '@mui/material';
import clsx from 'clsx';
import { Dispatch, ReactElement, SetStateAction, useEffect, useState } from 'react';
import { emojies } from '~/utils/vars';
import scss from '../views/pages/chatroom/chatroom.module.scss';

interface IEmojiPicker {
    setMessage: Dispatch<SetStateAction<string>>;
}

export default function EmojiPicker({ setMessage }: IEmojiPicker) {
    const [open, setOpen] = useState(false);
    const [pickedEmojies, setPickedEmojies] = useState<ReactElement[]>([]);
    useEffect(() => {
        document.body.addEventListener('click', (e: Event) => !e.defaultPrevented && setOpen(false));
    });
    const handleOpen = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setOpen(true);
    };

    return (
        <div className="relative">
            <Tooltip placement="top" title="Biểu tượng cảm xúc" arrow>
                <div className={scss.btn} onClick={handleOpen}>
                    <EmojiEmotionsIcon className={clsx(scss.icon, 'fs-22')} />
                </div>
            </Tooltip>
            {open && (
                <div css={styles.container} onClick={(e) => e.preventDefault()}>
                    <div className="flex flex-col">
                        <div css={styles.header} className="mb-3">
                            <h3 className="text-center font-medium flex-grow">Biểu tượng cảm xúc</h3>
                        </div>
                        <div className="flex flex-wrap flex-grow overflow-auto justify-center">
                            {emojies.map((emoji, index) => (
                                <div
                                    css={styles.emojiDemoWrapper}
                                    key={index}
                                    onClick={() => {
                                        setPickedEmojies([
                                            ...pickedEmojies,
                                            <img src={emoji} css={styles.emojiDemo} />,
                                        ]);
                                        setMessage(emoji);
                                    }}
                                >
                                    <img src={emoji} css={styles.emojiDemo} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: css`
        position: absolute;
        width: 280px;
        background-color: var(--bg-color);
        box-shadow: 0 0 4px var(--secondary-color2);
        padding: 12px;
        border-radius: 8px;
        top: -210px;
        z-index: 2000;
    `,
    header: css`
        display: flex;
        align-items: center;
        justify-content: center;
    `,
    emojiDemo: css`
        width: 24px;
        height: 24px;
    `,
    emojiDemoWrapper: css`
        border-radius: 16px;
        transition: all 0.15s ease;
        cursor: pointer;
        padding: 6px;

        &:hover {
            background-color: var(--bg-hover);
        }
    `,
};
