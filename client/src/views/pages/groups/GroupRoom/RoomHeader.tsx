/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import scss from './chatroom.module.scss';
import { Tooltip } from '@mui/material';
import PendingIcon from '@mui/icons-material/Pending';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Context } from './RoomContext';
import { setGroupList } from '~/utils/redux/rootSlice';
import { IGroupBox } from '~/utils/types';
import { useDispatch, useSelector } from 'react-redux';

export default function Header() {
    const [showProfile, setShowProfile] = useState(true);
    const [avatar, setAvatar] = useState('');
    const group = useContext(Context);
    const dispatch = useDispatch();
    const [groupName, setGroupName] = useState('');
    const groupList = useSelector(({ root }) => root.groupList) as IGroupBox[];

    useEffect(() => {
        window.addEventListener('changeGroupAvatar', (e: CustomEventInit) => {
            const data = e.detail as {
                newAvatar: string;
                groupId: string;
            };
            if (group?.id === data.groupId) {
                setAvatar(data.newAvatar);
                const newGroups: IGroupBox[] = groupList.map((g) => {
                    if (g.id === data.groupId) {
                        return { ...g, avatarUrl: data.newAvatar };
                    } else return g;
                });
                dispatch(setGroupList(newGroups));
            }
        });
        window.addEventListener('changeGroupName', (e: CustomEventInit) => {
            const data = e.detail as {
                newName: string;
                groupId: string;
            };
            if (group?.id === data.groupId) {
                setGroupName(data.newName);
                const newGroups: IGroupBox[] = groupList.map((g) => {
                    if (g.id === data.groupId) {
                        return { ...g, name: data.newName };
                    } else return g;
                });
                dispatch(setGroupList(newGroups));
            }
        });
    }, []);

    useMemo(() => {
        if (group) {
            setGroupName(group.name);
            setAvatar(group.avatarUrl);
        }
    }, [group]);

    const handleToggleProfile = () => {
        window.dispatchEvent(new CustomEvent('toggleGroupProfile'));
        setShowProfile(!showProfile);
    };

    return (
        <div css={styles.header} className="border-b border-solid border-color">
            <a className="flex items-center gap-2" href="#">
                <div className="relative">
                    <img src={avatar} alt="avatar" css={styles.avatar} />
                    <div className="active-dot"></div>
                </div>
                <div>
                    <div css={styles.name}>{groupName}</div>
                    <div css={styles.time}>Đang hoạt động</div>
                </div>
            </a>
            <div className="flex items-center gap-1">
                <Tooltip placement="bottom" title="Bắt đầu gọi thoại" arrow>
                    <div className={scss.btn}>
                        <LocalPhoneIcon className={scss.icon} />
                    </div>
                </Tooltip>
                <Tooltip placement="bottom" title="Bắt đầu gọi video" arrow>
                    <div className={scss.btn}>
                        <VideocamRoundedIcon className={scss.icon} />
                    </div>
                </Tooltip>
                <div className={scss.btn} onClick={handleToggleProfile}>
                    {showProfile ? (
                        <PendingIcon className={scss.icon} />
                    ) : (
                        <MoreHorizRoundedIcon className={scss.icon} />
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    header: css`
        display: flex;
        justify-content: space-between;
        padding: 12px;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
        background-color: var(--bg-color);
        z-index: 1;
    `,
    avatar: css`
        border-radius: 50%;
        width: 36px;
        height: 36px;
        border: 1px solid #bbb;
    `,
    name: css`
        font-size: 15px;
        font-weight: bold;
        line-height: 20px;
    `,
    time: css`
        font-size: 13px;
        color: var(--secondary-color);
    `,
};
