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
import noAvatar from '~/assets/imgs/no-avatar.png';
import { useState } from 'react';
import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff';
import SettingModal from '~/components/SettingModal';

const icon = css`
    font-size: 20px;
    color: rgb(101, 103, 107);
`;

const expandBtn = css`
    width: 36px;
    height: 36px;
    background: var(--bg-hover);
    &:hover {
        background: var(--secondary-color2) !important;
    }
    box-shadow: none !important;
`;

const links = [
    { icon: <MarkChatUnreadIcon css={icon} />, title: 'Chat', path: '/' },
    { icon: <PeopleIcon css={icon} />, title: 'Kết bạn', path: '/friends' },
    { icon: <InventoryIcon css={icon} />, title: 'Kho lưu trữ', path: '/archive' },
    { icon: <SpeakerNotesOffIcon css={icon} />, title: 'Danh sách chặn', path: '/unread' },
];

function Sidebar() {
    const [shrink, setShrink] = useState(false);
    const [showSetting, setShowSetting] = useState(false);
    const hiddneWhenShrink = css`
        display: ${shrink ? 'none' : 'inline-block'};
    `;

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
                    className={clsx(
                        style.link,
                        'flex items-center gap-2 cursor-pointer p-2  grow transition-colors gap-3'
                    )}
                >
                    <Avatar src={noAvatar} alt="avatar" className={style.avatar} />
                    <span css={hiddneWhenShrink} className={style.linkTitle}>
                        Đạt
                    </span>
                </div>
                {shrink ? (
                    <Fab css={expandBtn} onClick={() => setShrink(false)}>
                        <ArrowCircleRightOutlinedIcon />
                    </Fab>
                ) : (
                    <Fab css={expandBtn} onClick={() => setShrink(true)}>
                        <ArrowCircleLeftOutlinedIcon />
                    </Fab>
                )}
            </div>
            <SettingModal open={showSetting} setOpen={setShowSetting} />
        </div>
    );
}

export default Sidebar;
