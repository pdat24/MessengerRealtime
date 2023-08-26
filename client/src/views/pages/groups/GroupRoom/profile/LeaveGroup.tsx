/**@jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useContext, useState } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Context } from '../RoomContext';

function CustomPrivilege() {
    const groupsAPIPath = useSelector(({ root }) => root.APIs.groups);
    const userDbId = useSelector(({ root }) => root.userDbId);
    const [open, setOpen] = useState(false);
    const [disableBtn, setDisableBtn] = useState(false);
    const group = useContext(Context);

    const handleOpenDialog = () => setOpen(true);
    const handleCloseDialog = () => setOpen(false);

    const handleUnfriend = () => {
        setDisableBtn(true);
        axios.patch(`${groupsAPIPath}/${userDbId}/leave/${group?.id}`).then(() => {
            window.location.reload();
        });
    };

    return (
        <>
            <div css={styles.chatInfo} onClick={handleOpenDialog}>
                <LogoutIcon className="fs-22" />
                <span className="font-bold ms-2 text-sm">Rời nhóm</span>
            </div>
            <Dialog
                open={open}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                css={styles.dialog}
            >
                <DialogTitle id="alert-dialog-title">Rời nhóm</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <span css={styles.dialogText}>Bạn chắc chắn muốn rời nhóm?</span>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy</Button>
                    {disableBtn ? (
                        <Button sx={{ opacity: '.5', cursor: 'default' }}>Rời</Button>
                    ) : (
                        <Button onClick={handleUnfriend}>Rời</Button>
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
