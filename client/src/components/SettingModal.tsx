/**@jsxImportSource @emotion/react */
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { css } from '@emotion/react';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import scss from '../views/layouts/chatroom/chatroom.module.scss';
import { Button, Switch, TextField } from '@mui/material';
import jsCookie from 'js-cookie';
import axios from 'axios';
import { useSelector } from 'react-redux';
import storage from '~/firebase/storage';
import { v4 as uuidV4 } from 'uuid';
import { uploadBytes, ref, listAll, getDownloadURL } from 'firebase/storage';

interface ISettingModal {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

function UsernameUpdateField() {
    const userAPIUrl = useSelector(({ root }) => root.APIs.user);
    const userId = useSelector(({ root }) => root.userId);
    const [newName, setNewName] = useState('');
    const handleUpdate = async () => {
        if (newName.trim()) {
            await axios.patch(
                `${userAPIUrl}/${userId}`,
                {
                    username: newName,
                },
                { headers: { 'Content-Type': 'application/json' } }
            );
            location.reload();
        }
    };
    return (
        <div>
            <h6 css={styles.title} className="mb-3">
                Sửa tên đăng nhập
            </h6>
            <div>
                <TextField
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    label="Tên đăng nhập"
                    variant="outlined"
                    css={styles.input}
                />
                <Button variant="contained" css={styles.updateBtn} onClick={handleUpdate}>
                    Update
                </Button>
            </div>
        </div>
    );
}

export default function SettingModal({ open, setOpen }: ISettingModal) {
    const userAPIUrl = useSelector(({ root }) => root.APIs.user);
    const [username, setUsername] = useState('');
    const userId = useSelector(({ root }) => root.userId);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [darkMode, setDarkMode] = useState(localStorage.getItem('dark_mode'));

    const onDarkMode = () => {
        document.body.classList.add('darkMode');
        setDarkMode('true');
    };
    const offDarkMode = () => {
        document.body.classList.remove('darkMode');
        setDarkMode('false');
    };

    useMemo(() => {
        axios.get(`${userAPIUrl}/${userId}`).then((res) => {
            setUsername(res.data.username);
            setAvatarUrl(res.data.avatarUrl);
        });
        if (darkMode === 'true') onDarkMode();
        else offDarkMode();
    }, []);

    const handleChangeDarkMode = () => {
        if (darkMode === 'true') {
            localStorage.setItem('dark_mode', 'false');
            offDarkMode();
        } else {
            localStorage.setItem('dark_mode', 'true');
            onDarkMode();
        }
    };

    const handleUpdateAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const element = e.currentTarget as HTMLInputElement;
        if (element.files) {
            const newAvatar = element.files[0];

            // update UI
            const newAvatarUrl = URL.createObjectURL(newAvatar);
            setAvatarUrl(newAvatarUrl);
            window.dispatchEvent(new CustomEvent('changeAvatar', { detail: newAvatarUrl }));

            const fileUrl = newAvatar.name + uuidV4();
            const imgRef = ref(storage, 'avatars/' + fileUrl);

            // upload to firebase
            await uploadBytes(imgRef, element.files[0]);
            const imgs = await listAll(ref(storage, 'avatars'));

            // update
            for (const img of imgs.items) {
                const downloadUrl = await getDownloadURL(img);
                if (downloadUrl.includes(fileUrl)) {
                    await axios.patch(
                        `${userAPIUrl}/${userId}`,
                        {
                            avatarUrl: downloadUrl,
                        },
                        { headers: { 'Content-Type': 'application/json' } }
                    );
                    break;
                }
            }
        }
    };

    const handleSignout = () => {
        jsCookie.remove('user_id');
        jsCookie.remove('user_DbId');
        window.location.href = '/login';
    };

    return (
        <div>
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box css={styles.container}>
                    <div className="flex flex-col">
                        <div css={styles.header} className="mb-3">
                            <h3 className="text-center font-medium flex-grow">Tùy chọn</h3>
                            <div className={scss.btn} onClick={() => setOpen(false)}>
                                <CloseIcon />
                            </div>
                        </div>
                        <div className="flex-grow">
                            <h6 css={styles.title} className="mb-3 color-black">
                                Tài khoản
                            </h6>
                            <div className="flex gap-2 items-center">
                                <label
                                    className="relative cursor-pointer block"
                                    htmlFor="avatarInput"
                                    title="Đổi ảnh đại diện"
                                >
                                    <img src={avatarUrl} alt="photo" css={styles.avatar} />
                                    <div className="absolute bottom-0 right-0">
                                        <FlipCameraIosIcon css={styles.cameraIcon} />
                                    </div>
                                    <input
                                        onChange={handleUpdateAvatar}
                                        accept="image/*"
                                        type="file"
                                        className="hidden"
                                        id="avatarInput"
                                    />
                                </label>
                                <div>
                                    <div className="color-black" css={styles.title}>
                                        {username}
                                    </div>
                                    <div css={styles.desc}>{userId}</div>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button variant="contained" onClick={handleSignout}>
                                    <LogoutIcon className="me-1.5" css={styles.signoutBtn} />
                                    <span className="capitalize text-white">Sign out</span>
                                </Button>
                            </div>
                            <hr className="my-4" css={styles.hr} />
                            <div className="flex items-center px-1">
                                <div className={scss.btn} css={styles.btn}>
                                    {darkMode === 'true' ? (
                                        <DarkModeIcon style={{ fontSize: 22 }} />
                                    ) : (
                                        <LightModeIcon style={{ fontSize: 22 }} />
                                    )}
                                </div>
                                <div className="flex-grow ms-2">
                                    <div className="color-black" css={styles.title}>
                                        Chế độ tối
                                    </div>
                                    <div css={styles.desc}>Chế độ tối đang {darkMode === 'true' ? 'bật' : 'tắt'}</div>
                                </div>
                                <Switch
                                    checked={darkMode === 'true'}
                                    onChange={handleChangeDarkMode}
                                    className="color-black"
                                />
                            </div>
                            <hr className="my-4" css={styles.hr} />
                            <UsernameUpdateField />
                        </div>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

const styles = {
    container: css`
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        background-color: var(--bg-color);
        box-shadow: 24px;
        padding: 16px;
        border-radius: 8px;
        border: none;
    `,
    header: css`
        display: flex;
        align-items: center;
        justify-content: center;
    `,
    avatar: css`
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: 1px solid var(--secondary-color3);
    `,
    title: css`
        font-size: 15px;
        font-weight: 600;
    `,
    desc: css`
        font-size: 13px;
        color: var(--secondary-color);
    `,
    btn: css`
        background-color: var(--bg-hover);
    `,
    input: css`
        width: 100%;
        margin-bottom: 8px;

        label,
        input {
            font-size: 15px;
            color: var(--text-color);
        }
        fieldset {
            border-color: var(--border-color) !important;
        }
    `,
    updateBtn: css`
        text-transform: capitalize;
        float: right;
        margin-top: 8px;
    `,
    hr: css`
        border-color: var(--border-color);
    `,
    signoutBtn: css`
        font-size: 18px;
        path {
            color: #fff;
        }
    `,
    cameraIcon: css`
        font-size: 20px;
        path {
            color: var(--secondary-color);
        }
    `,
};
