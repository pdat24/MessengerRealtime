/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import scss from '../chatroom.module.scss';
import { Tooltip } from '@mui/material';
import SendActiveEmojiBtn from './SendActiveEmojiBtn';
import SendFileBtn from './SendFileBtn';
import SendImageBtn from './SendImageBtn';
import SendTextBtn from './SendTextBtn';
import { ITextInput } from './inputTypes';

function Inputs({ setMessages }: ITextInput) {
    return (
        <div css={styles.container} className="border-t border-solid border-color">
            <Tooltip placement="top" title="Chat bằng giọng nói" arrow>
                <div className={scss.btn}>
                    <MicRoundedIcon className={scss.icon} />
                </div>
            </Tooltip>
            <SendImageBtn setMessages={setMessages} />
            <SendFileBtn setMessages={setMessages} />
            <SendTextBtn setMessages={setMessages} />
            <SendActiveEmojiBtn setMessages={setMessages} />
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
};

export default Inputs;
