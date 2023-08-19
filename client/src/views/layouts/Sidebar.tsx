/** @jsxImportSource @emotion/react */
import clsx from 'clsx';
import style from './layout.module.scss';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import { NavLink } from 'react-router-dom';
import { css } from '@emotion/react';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import { Avatar, Fab, Tooltip } from '@mui/material';
import { useMemo, useRef, useState } from 'react';
import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff';
import SettingModal from '~/components/SettingModal';
import axios from 'axios';
import jsCookie from 'js-cookie';
import { useSelector } from 'react-redux';

function Sidebar() {
    const userAPIUrl = useSelector(({ root }) => root.APIUrls.userAPIUrl);
    const [shrink, setShrink] = useState(false);
    const [showSetting, setShowSetting] = useState(false);
    const [username, setUsername] = useState('');
    const userId = useRef(jsCookie.get('user_id'));
    const [avatarUrl, setAvatarUrl] = useState('');
    const hiddneWhenShrink = css`
        display: ${shrink ? 'none' : 'inline-block'};
    `;
    useMemo(() => {
        axios.get(`${userAPIUrl}/${userId.current}`).then((res) => {
            setUsername(res.data.username);
            setAvatarUrl(res.data.avatarUrl);
        });
    }, []);

    return (
        <div
            className={clsx(style.container, 'border-r border-solid border-color')}
            css={css`
                min-width: ${shrink ? 60 : 250}px;
            `}
        >
            <div className={style.linkBlock}>
                {links.map((link) =>
                    shrink ? (
                        <Tooltip placement="right" title={link.title} key={link.path}>
                            <NavLink
                                style={({ isActive }) => (isActive ? { backgroundColor: 'var(--bg-hover)' } : {})}
                                to={link.path}
                                className={style.link}
                            >
                                {link.icon}
                                <span className={style.linkTitle} css={hiddneWhenShrink}>
                                    {link.title}
                                </span>
                            </NavLink>
                        </Tooltip>
                    ) : (
                        <NavLink
                            style={({ isActive }) => (isActive ? { backgroundColor: 'var(--bg-hover)' } : {})}
                            to={link.path}
                            key={link.path}
                            className={style.link}
                        >
                            {link.icon}
                            <span className={style.linkTitle} css={hiddneWhenShrink}>
                                {link.title}
                            </span>
                        </NavLink>
                    )
                )}
            </div>
            <div
                className={style.avatarBlock}
                css={css`
                    flex-direction: ${shrink ? 'column' : 'row'};
                `}
            >
                <div
                    onClick={() => setShowSetting(true)}
                    className={clsx(style.link, 'flex items-center cursor-pointer p-2 grow transition-colors gap-3')}
                >
                    <Avatar src={avatarUrl} alt="avatar" className={style.avatar} />
                    <span css={hiddneWhenShrink} className={style.linkTitle}>
                        {username}
                    </span>
                </div>
                {shrink ? (
                    <Fab css={styles.expandBtn} onClick={() => setShrink(false)}>
                        <ArrowCircleRightOutlinedIcon />
                    </Fab>
                ) : (
                    <Fab css={styles.expandBtn} onClick={() => setShrink(true)}>
                        <ArrowCircleLeftOutlinedIcon />
                    </Fab>
                )}
            </div>
            <SettingModal open={showSetting} setOpen={setShowSetting} />
        </div>
    );
}

const styles = {
    icon: css`
        font-size: 20px;
        color: rgb(101, 103, 107);
    `,
    expandBtn: css`
        width: 36px;
        height: 36px;
        background: var(--bg-hover);
        &:hover {
            background: var(--secondary-color2) !important;
        }
        box-shadow: none !important;
    `,
};

const links = [
    { icon: <MarkChatUnreadIcon css={styles.icon} />, title: 'Chat', path: '/' },
    { icon: <PeopleIcon css={styles.icon} />, title: 'Kết bạn', path: '/friends' },
    { icon: <InventoryIcon css={styles.icon} />, title: 'Kho lưu trữ', path: '/archive' },
    { icon: <SpeakerNotesOffIcon css={styles.icon} />, title: 'Danh sách chặn', path: '/unread' },
];

export default Sidebar;
