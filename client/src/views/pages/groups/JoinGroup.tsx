/**@jsxImportSource @emotion/react */
import { Button, TextField, css } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import { addGroupList } from '~/utils/redux/rootSlice';
import { IGroupBox } from '~/utils/types';

function JoinGroup() {
    const dispatch = useDispatch();
    const groupsAPIPath = useSelector(({ root }) => root.APIs.groups);
    const [groupId, setGroupId] = useState('');
    const userDbId = useSelector(({ root }) => root.userDbId);
    const groupList = useSelector(({ root }) => root.groupList) as IGroupBox[];
    const [invalidGroupId, setInvalidGroupId] = useState(false);
    const [disableJoin, setDisableJoin] = useState(false);

    const handleJoinGroup = () => {
        setDisableJoin(true);
        joinGroup();
    };

    const joinGroup = async () => {
        if (groupId.length === 24) {
            // make sure user have not in the group before
            let inGroupBefore = false;
            groupList.forEach((group) => {
                if (group.id === groupId) inGroupBefore = true;
            });
            if (!inGroupBefore) {
                const res = await axios.patch(`${groupsAPIPath}/${userDbId}/join/${groupId}`);
                // ensure group exists
                if (res.status === 200) {
                    const targetGroup = (await axios.get(`${groupsAPIPath}/${groupId}`)).data;
                    dispatch(addGroupList(targetGroup));
                    setGroupId('');
                } else if (res.status === 204) {
                    setInvalidGroupId(true);
                }
            } else {
                alert('Bạn đã tham gia nhóm trước đó!');
            }
        } else {
            setInvalidGroupId(true);
        }
        setDisableJoin(false);
    };

    return (
        <div className="mx-3 mb-5 mt-3">
            <label htmlFor="entry" className="mb-2 mt-1 text-lg font-medium">
                Tham gia nhóm chat
            </label>
            <div className="flex items-end gap-2">
                <TextField
                    value={groupId}
                    onChange={(e) => setGroupId(e.target.value)}
                    css={styles.input}
                    className="flex-grow"
                    id="entry"
                    label="Nhập ID nhóm"
                    variant="standard"
                />
                <Button
                    css={disableJoin ? styles.buttonDisbaled : styles.button}
                    variant="contained"
                    onClick={!disableJoin ? handleJoinGroup : () => {}}
                >
                    Tham gia
                </Button>
            </div>
            {invalidGroupId && (
                <div className="mt-2 flex gap-2 items-center">
                    <div className="text-red-600 text-sm italic font-bold">ID không hợp lệ!</div>
                    <div onClick={() => setInvalidGroupId(false)}>
                        <CloseIcon css={styles.closeBtn} />
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    input: css`
        label {
            color: var(--secondary-color);
            font-size: 14px;
        }
        input {
            color: var(--text-color);
            font-size: 13px;
        }
        div::before {
            border-color: var(--secondary-color) !important;
        }
    `,
    button: css`
        text-transform: capitalize;
        border-radius: 20px;
        color: #fff;
        background: var(--primary-color);
    `,
    buttonDisbaled: css`
        text-transform: capitalize;
        border-radius: 20px;
        color: var(--text-color);
        background: var(--primary-color);
        opacity: 0.5;
        cursor: default;
    `,
    closeBtn: css`
        font-size: 20px;
        cursor: pointer;
    `,
};

export default JoinGroup;
