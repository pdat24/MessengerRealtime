/**@jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import scss from '../chatroom.module.scss';
import { useState } from 'react';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import TopicPicker from '~/components/TopicPicker';
import { useSelector } from 'react-redux';
import ActiveEmojiPicker from '~/components/ActiveEmojiPicker';

export default function CustomChat() {
    const [drop, setDrop] = useState(false);
    const [openTopicPicker, setOpenTopicPicker] = useState(false);
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const topic = useSelector(({ root }) => root.topic);
    const activeEmoji = useSelector(({ root }) => root.emoji);

    return (
        <div>
            <div css={styles.chatInfo} onClick={() => setDrop(!drop)}>
                <span className="font-bold flex-grow">Tùy chỉnh đoạn chat</span>
                {drop ? <KeyboardArrowDownIcon /> : <ChevronRightRoundedIcon />}
            </div>
            {drop && (
                <div className="ms-4">
                    <div css={styles.chatInfo} onClick={() => setOpenTopicPicker(true)}>
                        <div
                            css={
                                topic
                                    ? css`
                                          ${styles.topicDemo};
                                          background: ${topic};
                                      `
                                    : styles.topicDemo
                            }
                        ></div>
                        <span className="font-bold ms-2 text-sm">Chọn chủ đề</span>
                    </div>
                    <div css={styles.chatInfo} onClick={() => setOpenEmojiPicker(true)}>
                        {activeEmoji ? (
                            <img src={activeEmoji} alt="emoji" css={styles.activeEmojiStyle} />
                        ) : (
                            <ThumbUpAltIcon className={'fs-22 ' + scss.icon} />
                        )}
                        <span className="font-bold ms-2 text-sm">Đổi biểu tượng cảm xúc</span>
                    </div>
                </div>
            )}
            <TopicPicker open={openTopicPicker} setOpen={setOpenTopicPicker} />
            <ActiveEmojiPicker open={openEmojiPicker} setOpen={setOpenEmojiPicker} />
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
    topicDemo: css`
        width: 22px;
        height: 22px;
        background-color: var(--purple-color);
        border-radius: 50%;
    `,
    activeEmojiStyle: css`
        width: 24px;
        width: 24px;
    `,
};
