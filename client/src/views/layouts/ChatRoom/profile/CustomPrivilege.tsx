/**@jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useSelector } from 'react-redux';
import { IChatBox } from '~/utils/types';
import axios from 'axios';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function CustomPrivilege({ chatRoomInfo }: { chatRoomInfo: IChatBox }) {
    const [drop, setDrop] = useState(false);
    const friendAPI = useSelector(({ root }) => root.APIs.friends);
    const userDbId = useSelector(({ root }) => root.userDbId);
    const [open, setOpen] = useState(false);
    const [disableBtn, setDisableBtn] = useState(false);

    const handleOpenDialog = () => setOpen(true);
    const handleCloseDialog = () => setOpen(false);

    const handleUnfriend = () => {
        setDisableBtn(true);
        axios.delete(`${friendAPI}/${userDbId}/${chatRoomInfo.friendId}`).then(() => window.location.reload());
    };

    return (
        <>
            <div>
                <div css={styles.chatInfo} onClick={() => setDrop(!drop)}>
                    <span className="font-bold flex-grow">Quyền riêng tư & hỗ trợ</span>
                    {drop ? <KeyboardArrowDownIcon /> : <ChevronRightRoundedIcon />}
                </div>
                {drop && (
                    <div className="ms-4">
                        <div css={styles.chatInfo} onClick={handleOpenDialog}>
                            <RemoveCircleIcon className="fs-22" />
                            <span className="font-bold ms-2 text-sm">Hủy bạn bè</span>
                        </div>
                    </div>
                )}
            </div>
            <Dialog
                open={open}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                css={styles.dialog}
            >
                <DialogTitle id="alert-dialog-title">Xóa bạn bè</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <span css={styles.dialogText}>Bạn sẽ không thể hoàn tác sau khi xóa!</span>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    {disableBtn ? (
                        <Button sx={{ opacity: '.5', cursor: 'default' }}>Unfriend</Button>
                    ) : (
                        <Button onClick={handleUnfriend}>Unfriend</Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
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
    dialog: css`
        > div > div:first-of-type {
            background: var(--bg-color);
        }
    `,
    dialogText: css`
        color: var(--secondary-color);
    `,
};

export default CustomPrivilege;
