/**@jsxImportSource @emotion/react */
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Tooltip, css } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { IGroupBox } from '~/utils/types';
import { addGroupList } from '~/utils/redux/rootSlice';

export default function CreateGroupBtn() {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const groupsAPIPath = useSelector(({ root }) => root.APIs.groups);
    const userDbId = useSelector(({ root }) => root.userDbId);
    const [groupName, setGroupName] = useState('');
    const [disableCreate, setDisableCreate] = useState(false);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleCreateGroup = () => {
        if (groupName.length > 0 && groupName.trim().length > 0) {
            setDisableCreate(true);
            axios.post(`${groupsAPIPath}/createdBy/${userDbId}`, { Name: groupName }).then((res) => {
                const data = res.data as IGroupBox;
                dispatch(addGroupList(data));
                handleClose();
                setDisableCreate(false);
                setGroupName('');
            });
        } else {
            alert('Tên nhóm không hợp lệ!');
        }
    };

    return (
        <div>
            <Tooltip title="Tạo nhóm">
                <div role="button" onClick={handleClickOpen}>
                    <AddCircleOutlineIcon />
                </div>
            </Tooltip>
            <Dialog open={open} onClose={handleClose} css={styles.dialog}>
                <DialogTitle>Tạo nhóm</DialogTitle>
                <DialogContent>
                    <TextField
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        css={styles.input}
                        sx={{ minWidth: 300 }}
                        autoFocus
                        margin="dense"
                        label="Tên nhóm"
                        type="email"
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    {disableCreate ? (
                        <Button sx={{ opacity: '.5', cursor: 'default' }}>Ok</Button>
                    ) : (
                        <Button onClick={handleCreateGroup} disabled={disableCreate}>
                            Ok
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </div>
    );
}

const styles = {
    dialog: css`
        > div > div:first-of-type {
            background: var(--bg-color);
        }
        label {
            color: var(--text-color);
        }
        input {
            color: var(--text-color);
        }
    `,
    input: css`
        div::before {
            border-color: var(--text-color);
        }
    `,
};
