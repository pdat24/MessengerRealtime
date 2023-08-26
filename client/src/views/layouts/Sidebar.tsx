/** @jsxImportSource @emotion/react */
import clsx from 'clsx';
import style from './layout.module.scss';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import PeopleIcon from '@mui/icons-material/People';
import { NavLink } from 'react-router-dom';
import { css } from '@emotion/react';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import { Avatar, Fab, Tooltip } from '@mui/material';
import { useMemo, useState } from 'react';
import SettingModal from '~/components/SettingModal';
import axios from 'axios';
import { useSelector } from 'react-redux';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Diversity3Icon from '@mui/icons-material/Diversity3';

function Sidebar() {
    const userAPIUrl = useSelector(({ root }) => root.APIs.user);
    const [shrink, setShrink] = useState(true);
    const [showSetting, setShowSetting] = useState(false);
    const [username, setUsername] = useState('');
    const userId = useSelector(({ root }) => root.userId);
    const [avatarUrl, setAvatarUrl] = useState('');
    const hiddneWhenShrink = css`
        display: ${shrink ? 'none' : 'inline-block'};
    `;
    useMemo(() => {
        axios.get(`${userAPIUrl}/${userId}`).then((res) => {
            setUsername(res.data.username);
            setAvatarUrl(res.data.avatarUrl);
        });
        const handleChangeAvatar = (e: CustomEventInit) => setAvatarUrl(e.detail);
        window.addEventListener('changeAvatar', handleChangeAvatar);
        return () => window.removeEventListener('changeAvatar', handleChangeAvatar);
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
                    className={clsx(style.link, 'flex items-center cursor-pointer p-2 grow transition-colors gap-3', {
                        'w-0': !shrink,
                    })}
                >
                    <Avatar src={avatarUrl} alt="avatar" className={style.avatar} />
                    <span css={hiddneWhenShrink} className={clsx(style.linkTitle, 'textEllipsis')}>
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
    {
        icon: <MarkChatUnreadIcon css={styles.icon} />,
        title: 'Chat',
        path: '/',
    },
    { icon: <PersonAddIcon css={styles.icon} />, title: 'Kết bạn', path: '/make-friend' },
    { icon: <PeopleIcon css={styles.icon} />, title: 'Lời mời kết bạn', path: '/friend-requests' },
    {
        icon: <Diversity3Icon css={styles.icon} />,
        title: 'Nhóm chat',
        path: '/groups',
    },
];

export default Sidebar;
