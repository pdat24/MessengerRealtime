/**@jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import scss from './chatroom.module.scss';
import PushPinIcon from '@mui/icons-material/PushPin';
import { useContext, useEffect, useMemo, useState } from 'react';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import ImageIcon from '@mui/icons-material/Image';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import TopicPicker from '~/components/TopicPicker';
import { useSelector } from 'react-redux';
import ActiveEmojiPicker from '~/components/ActiveEmojiPicker';
import { Context } from './ChatRoomContext';

function ChatInfo() {
    const [drop, setDrop] = useState(false);
    return (
        <div>
            <div css={styles.chatInfo} onClick={() => setDrop(!drop)}>
                <span className="font-bold flex-grow">Thông tin đoạn chat</span>
                {drop ? <KeyboardArrowDownIcon /> : <ChevronRightRoundedIcon />}
            </div>
            {drop && (
                <div className="ms-4">
                    <div css={styles.chatInfo}>
                        <PushPinIcon className="fs-22" />
                        <span className="font-bold ms-2 text-sm">Xem tin nhắn đã ghim</span>
                    </div>
                </div>
            )}
        </div>
    );
}

function CustomChat() {
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

function Media() {
    const [drop, setDrop] = useState(false);
    return (
        <div>
            <div css={styles.chatInfo} onClick={() => setDrop(!drop)}>
                <span className="font-bold flex-grow">Ảnh và file đính kèm</span>
                {drop ? <KeyboardArrowDownIcon /> : <ChevronRightRoundedIcon />}
            </div>
            {drop && (
                <div className="ms-4">
                    <div css={styles.chatInfo}>
                        <ImageIcon className="fs-22" />
                        <span className="font-bold ms-2 text-sm">Ảnh</span>
                    </div>
                    <div css={styles.chatInfo}>
                        <FilePresentIcon className="fs-22" />
                        <span className="font-bold ms-2 text-sm">File đính kèm</span>
                    </div>
                </div>
            )}
        </div>
    );
}

function CustomPrivilege() {
    const [drop, setDrop] = useState(false);
    return (
        <div>
            <div css={styles.chatInfo} onClick={() => setDrop(!drop)}>
                <span className="font-bold flex-grow">Quyền riêng tư & hỗ trợ</span>
                {drop ? <KeyboardArrowDownIcon /> : <ChevronRightRoundedIcon />}
            </div>
            {drop && (
                <div className="ms-4">
                    <div css={styles.chatInfo}>
                        <RemoveCircleIcon className="fs-22" />
                        <span className="font-bold ms-2 text-sm">Chặn</span>
                    </div>
                </div>
            )}
        </div>
    );
}

function Profile() {
    const [notification, setNotification] = useState(true);
    const [show, setShow] = useState(true);
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');
    const chatBox = useContext(Context);
    useMemo(() => {
        if (chatBox) {
            setName(chatBox.username);
            setAvatar(chatBox.avatarUrl);
        }
    }, [chatBox]);

    useEffect(() => {
        const toggleProfileHandler = () => setShow((prevValue) => !prevValue);
        window.addEventListener('toggleProfile', toggleProfileHandler);

        return () => window.removeEventListener('toggleProfile', toggleProfileHandler);
    }, []);

    return (
        show && (
            <div css={styles.container}>
                <div className="py-5 overflow-auto h-full">
                    <img src={avatar} alt="avatar" css={styles.avatar} />
                    <div css={styles.name}>{name}</div>
                    <div css={styles.time}>Hoạt động 17 phút trước</div>
                    <div className="flex justify-center mt-4">
                        <div css={styles.actions}>
                            <a className={scss.btn} css={styles.btn} href="https://facebook.com">
                                <FacebookRoundedIcon />
                            </a>
                            <div css={styles.time}>Trang cá nhân</div>
                        </div>
                        <div css={styles.actions}>
                            <div className={scss.btn} css={styles.btn} onClick={() => setNotification(!notification)}>
                                {notification ? <NotificationsActiveRoundedIcon /> : <NotificationsOffIcon />}
                            </div>
                            <div css={styles.time}>{notification ? 'Tắt thông báo' : 'Bật thông báo'}</div>
                        </div>
                        <div css={styles.actions}>
                            <div className={scss.btn} css={styles.btn}>
                                <SearchRoundedIcon />
                            </div>
                            <div css={styles.time}>Tìm kiếm</div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <ChatInfo />
                        <CustomChat />
                        <Media />
                        <CustomPrivilege />
                    </div>
                </div>
            </div>
        )
    );
}

const styles = {
    container: css`
        flex: 1;
        height: 100vh;
        overflow: hidden;
        background-color: var(--bg-color);
        padding: 0 8px;
    `,
    avatar: css`
        width: 72px;
        height: 72px;
        border-radius: 50%;
        margin: 0 auto 8px;
    `,
    name: css`
        font-size: 17px;
        text-align: center;
        font-weight: bold;
    `,
    time: css`
        font-size: 13px;
        text-align: center;
        color: var(--secondary-color);
    `,
    actions: css`
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 80px;
    `,
    btn: css`
        background-color: var(--bg-hover);
        margin-bottom: 4px;
        &:hover {
            background-color: var(--secondary-color2) !important;
        }
    `,
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

export default Profile;
