/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import scss from './chatroom.module.scss';
import clsx from 'clsx';
import { Tooltip } from '@mui/material';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { Dispatch, ReactElement, SetStateAction, useRef, useState } from 'react';
import PictureMessage from '~/components/PictureMessage';
import FileMessage from '~/components/FileMessage';
import { useSelector } from 'react-redux';
import TextMessageRight from '~/components/TextMessageRight';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import EmojiPicker from '~/components/EmojiMessage';

interface IInputs {
    msgs: ReactElement[];
    setMsgs: Dispatch<SetStateAction<ReactElement[]>>;
}

function scrollToTop() {
    window.dispatchEvent(new CustomEvent('scrollToTop'));
}

function Inputs({ msgs, setMsgs }: IInputs) {
    const [text, setText] = useState('');
    const pictureInput = useRef<HTMLInputElement>(null);
    const fileInput = useRef<HTMLInputElement>(null);
    const activeEmoji = useSelector(({ root }) => root.emoji);

    // send picture
    const handleSendPicture = () => {
        if (pictureInput.current?.files) {
            const imgUri = URL.createObjectURL(pictureInput.current.files[0]);
            setMsgs([...msgs, <PictureMessage imgUri={imgUri} />]);
            scrollToTop();
            pictureInput.current.value = '';
        }
    };
    // attach file
    const handleSendFile = () => {
        if (fileInput.current?.files) {
            console.log(fileInput.current.files[0]);
            const uri = URL.createObjectURL(fileInput.current.files[0]);
            const filename = fileInput.current.files[0].name;
            setMsgs([...msgs, <FileMessage uri={uri} filename={filename} />]);
            scrollToTop();
        }
    };
    // send active emoji
    const handleSendActiveEmojis = () => {
        if (activeEmoji) {
            setMsgs([...msgs, <img src={activeEmoji} alt="emoji" css={styles.activeEmojiStyle} className="my-3" />]);
        } else {
            setMsgs([
                ...msgs,
                <div className="block">
                    <ThumbUpAltIcon className={scss.icon} css={styles.fs40} />
                </div>,
            ]);
        }
        scrollToTop();
    };
    // send text
    const handleSendText = () => {
        if (text) {
            setMsgs([...msgs, <TextMessageRight>{text}</TextMessageRight>]);
            setText('');
            scrollToTop();
        }
    };
    // send text by enter
    const handleSendTextByEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSendText();
    };

    return (
        <div css={styles.container} className="border-t border-solid border-color">
            <Tooltip placement="top" title="Chat bằng giọng nói" arrow>
                <div className={scss.btn}>
                    <MicRoundedIcon className={scss.icon} />
                </div>
            </Tooltip>
            <Tooltip placement="top" title="Chọn ảnh" arrow>
                <label htmlFor="PictureMessage" className={scss.btn}>
                    <InsertPhotoOutlinedIcon className={clsx(scss.icon, 'fs-22')} />
                    <input
                        ref={pictureInput}
                        onChange={handleSendPicture}
                        type="file"
                        name="PictureMessage"
                        id="PictureMessage"
                        className="hidden"
                        accept="image/*"
                    />
                </label>
            </Tooltip>
            <Tooltip placement="top" title="Đính kèm file" arrow>
                <label className={scss.btn}>
                    <AttachFileOutlinedIcon className={clsx(scss.icon, 'fs-22')} />
                    <input
                        ref={fileInput}
                        onChange={handleSendFile}
                        type="file"
                        name="AttachedFile"
                        id="AttachedFile"
                        className="hidden"
                    />
                </label>
            </Tooltip>
            <div>
                <EmojiPicker setMessage={setText} />
            </div>
            <div css={styles.entry} className="mx-2">
                <input
                    autoFocus
                    type="text"
                    placeholder="Aa"
                    className="bg-transparent pe-5 border-0 outline-0 flex-grow text-sm"
                    value={text}
                    onKeyDown={handleSendTextByEnter}
                    onChange={(e) => setText(e.target.value)}
                />
                <Tooltip placement="top" title="Gửi" arrow>
                    <div className={scss.btn} css={styles.emoji} onClick={handleSendText}>
                        <SendRoundedIcon className={clsx(scss.icon, 'fs-22')} />
                    </div>
                </Tooltip>
            </div>
            <Tooltip placement="top" title="Gửi biểu tượng này" arrow>
                <div className={scss.btn} onClick={handleSendActiveEmojis}>
                    {activeEmoji ? (
                        <img src={activeEmoji} alt="emoji" css={styles.activeEmojiStyle} />
                    ) : (
                        <ThumbUpAltIcon className={scss.icon} />
                    )}
                </div>
            </Tooltip>
        </div>
    );
}

const styles = {
    container: css`
        padding: 12px 8px;
        background-color: var(--bg-color);
        align-items: center;
        bottom: 0;
        width: 100%;
        display: flex;
    `,
    entry: css`
        background-color: var(--bg-hover);
        display: flex;
        align-items: center;
        border-radius: 24px;
        padding: 2px 0 2px 12px;
        flex: 1;
    `,
    emoji: css`
        &:hover {
            background-color: var(--secondary-color2);
        }
    `,
    fs40: css`
        font-size: 40px;
    `,
    activeEmojiStyle: css`
        width: 30px;
        height: 30px;
    `,
};

export default Inputs;
