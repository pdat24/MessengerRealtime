/**@jsxImportSource @emotion/react */
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { css } from '@emotion/react';
import { Dispatch, SetStateAction, useState } from 'react';
import scss from '../views/pages/chatroom/chatroom.module.scss';
import { Button, Switch, TextField } from '@mui/material';
import avatar from '~/assets/imgs/no-avatar.png';

interface ISettingModal {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}
export default function SettingModal({ open, setOpen }: ISettingModal) {
    const [darkMode, setDarkMode] = useState(false);
    const handleChangeDarkMode = () => {
        if (darkMode) document.body.classList.remove('darkMode');
        else document.body.classList.add('darkMode');
        setDarkMode(!darkMode);
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
                                <img src={avatar} alt="photo" css={styles.avatar} />
                                <div>
                                    <div className="color-black" css={styles.title}>
                                        Phạm Quốc Đạt
                                    </div>
                                    <div css={styles.desc}>user id</div>
                                </div>
                            </div>
                            <hr className="my-4" css={styles.hr} />
                            <div className="flex items-center px-1">
                                <div className={scss.btn} css={styles.btn}>
                                    {darkMode ? (
                                        <DarkModeIcon style={{ fontSize: 22 }} />
                                    ) : (
                                        <LightModeIcon style={{ fontSize: 22 }} />
                                    )}
                                </div>
                                <div className="flex-grow ms-2">
                                    <div className="color-black" css={styles.title}>
                                        Chế độ tối
                                    </div>
                                    <div css={styles.desc}>Chế độ tối đang {darkMode ? 'bật' : 'tắt'}</div>
                                </div>
                                <Switch checked={darkMode} onChange={handleChangeDarkMode} className="color-black" />
                            </div>
                            <hr className="my-4" css={styles.hr} />
                            <div>
                                <h6 css={styles.title} className="mb-3">
                                    Sửa tên đăng nhập
                                </h6>
                                <div>
                                    <TextField label="Tên đăng nhập" variant="outlined" css={styles.input} />
                                    <Button color="success" variant="contained" css={styles.updateBtn}>
                                        Update
                                    </Button>
                                </div>
                            </div>
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
};
