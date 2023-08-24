/**@jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import scss from '../chatroom.module.scss';
import { useContext, useMemo, useState } from 'react';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { Context } from '../ChatRoomContext';
import CustomPrivilege from './CustomPrivilege';
import CustomChatRoom from './CustomChatRoom';
import Media from './Media';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PushPinIcon from '@mui/icons-material/PushPin';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

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

function ProfileModel() {
    const [notification, setNotification] = useState(true);
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');
    const chatRoomInfo = useContext(Context);

    useMemo(() => {
        if (chatRoomInfo) {
            setName(chatRoomInfo.username);
            setAvatar(chatRoomInfo.avatarUrl);
        }
    }, [chatRoomInfo]);

    return (
        <div css={styles.container}>
            <div className="py-5 overflow-auto h-full px-2">
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
                    <CustomChatRoom />
                    <Media />
                    <CustomPrivilege chatRoomInfo={chatRoomInfo!} />
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
};

export default ProfileModel;
