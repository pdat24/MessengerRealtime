/**@jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import scss from '../chatroom.module.scss';
import { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from 'react';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import { Context } from '../RoomContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LeaveGroup from './LeaveGroup';
import CustomChat from '~/views/layouts/ChatRoom/profile/CustomChatRoom';
import Media from '~/views/layouts/ChatRoom/profile/Media';
import MemberList from './MembersList';
import storage from '~/firebase/storage';
import { getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
import axios from 'axios';
import { v4 as uuidV4 } from 'uuid';
import { useSelector } from 'react-redux';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';

function GroupName({
    name,
    setName,
    groupId,
}: {
    name: string;
    setName: Dispatch<SetStateAction<string>>;
    groupId: string;
}) {
    const [editable, setEditable] = useState(false);
    const [newName, setNewName] = useState(name);
    const groupsAPIPath = useSelector(({ root }) => root.APIs.groups);
    useEffect(() => {
        setEditable(false);
    }, [name]);
    const handleOk = () => {
        if (newName.length !== 0 && newName.trim().length !== 0) {
            setName(newName);
            window.dispatchEvent(new CustomEvent('changeGroupName', { detail: { newName, groupId } }));
            axios.patch(`${groupsAPIPath}/${groupId}/changeName`, {
                Name: newName,
            });
        }
    };
    const handleOkWhenEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleOk();
    };
    const handleCancel = () => {
        setNewName('');
        setEditable(false);
    };
    const handleOpenEdit = () => {
        setNewName(name);
        setEditable(true);
    };

    return !editable ? (
        <div className="flex items-center gap-2 justify-center m-auto" css={{ maxWidth: '90%' }}>
            <div css={styles.name} className="textEllipsis">
                {name}
            </div>
            <div onClick={handleOpenEdit}>
                <BorderColorOutlinedIcon css={styles.editIcon} className="cursor-pointer" />
            </div>
        </div>
    ) : (
        <div className="flex justify-center py-2 gap-1.5 flex-wrap">
            <input
                type="text"
                value={newName}
                onKeyDown={handleOkWhenEnter}
                onChange={(e) => setNewName(e.target.value)}
                css={styles.nameInput}
                autoFocus
            />
            <div className="flex gap-1">
                <button css={styles.changeNameBtn} onClick={handleCancel}>
                    Hủy
                </button>
                <button css={styles.changeNameBtn} onClick={handleOk}>
                    Ok
                </button>
            </div>
        </div>
    );
}

function GroupMembers() {
    const [notification, setNotification] = useState(true);
    const [name, setName] = useState('');
    const groupsAPIPath = useSelector(({ root }) => root.APIs.groups);
    const [avatar, setAvatar] = useState('');
    const group = useContext(Context);
    useMemo(() => {
        if (group) {
            setName(group.name);
            setAvatar(group.avatarUrl);
        }
    }, [group]);

    const handleUpdateAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const element = e.currentTarget as HTMLInputElement;
        if (element.files) {
            const newAvatar = element.files[0];
            // update UI
            const newAvatarUrl = URL.createObjectURL(newAvatar);
            setAvatar(newAvatarUrl);
            window.dispatchEvent(
                new CustomEvent('changeGroupAvatar', {
                    detail: {
                        newAvatar: newAvatarUrl,
                        groupId: group?.id,
                    },
                })
            );
            const fileUrl = newAvatar.name + uuidV4();
            const imgRef = ref(storage, 'avatars/' + fileUrl);
            // upload to firebase
            await uploadBytes(imgRef, element.files[0]);
            const imgs = await listAll(ref(storage, 'avatars'));
            // update
            for (const img of imgs.items) {
                const downloadUrl = await getDownloadURL(img);
                if (downloadUrl.includes(fileUrl)) {
                    await axios.patch(`${groupsAPIPath}/${group?.id}/changeAvatar`, {
                        avatarUrl: downloadUrl,
                    });
                    break;
                }
            }
        }
    };

    return (
        <div css={styles.container}>
            <div className="py-5 overflow-auto h-full px-2">
                <div className="flex justify-center mb-2">
                    <div className="relative inline-block">
                        <img src={avatar} alt="avatar" css={styles.avatar} />
                        <div className="active-dot" css={styles.dot}></div>
                    </div>
                </div>
                <GroupName name={name} setName={setName} groupId={group!.id} />
                <div css={styles.time}>Đang hoạt động</div>
                <div className="flex justify-center mt-4">
                    <label css={styles.actions} htmlFor="groupAvatarInput" className="block">
                        <div className={scss.btn} css={styles.btn}>
                            <AccountCircleIcon />
                        </div>
                        <div css={styles.time}>Ảnh đại diện</div>
                        <input
                            type="file"
                            id="groupAvatarInput"
                            onChange={handleUpdateAvatar}
                            className="hidden"
                            accept="image/*"
                        />
                    </label>
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
                    <MemberList memberIds={group!.members} />
                    <CustomChat />
                    <Media />
                    <LeaveGroup />
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
        border: 1px solid var(--secondary-color);
    `,
    name: css`
        font-size: 17px;
        text-align: center;
        font-weight: bold;
        width: auto;
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
    dot: css`
        width: 10px;
        height: 10px;
        bottom: 4px;
        right: 6px;
    `,
    nameInput: css`
        color: var(--text-color);
        font-size: 14px;
        background: var(--secondary-color2);
        border-radius: 16px;
        padding: 3px 12px;
        border: none;
        outline: 1px solid var(--secondary-color3);
    `,
    changeNameBtn: css`
        padding: 3px 12px;
        font-size: 12px;
        background: var(--primary-color);
        color: #fff;
        border-radius: 16px;
    `,
    editIcon: css`
        font-size: 19px;
    `,
};

export default GroupMembers;
