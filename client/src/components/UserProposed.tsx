/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Button } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useState } from 'react';
import { IUsers } from '~/utils/types';
import { setFriendRequestsSent } from '~/utils/redux/rootSlice';

interface ImatchedUsers {
    username: string;
    avatarUrl: string;
    userDbId: string;
}

function ProposedUser({ username, avatarUrl, userDbId }: ImatchedUsers) {
    const dispatch = useDispatch();
    const friendRequestsSent = useSelector(({ root }) => root.friendRequestsSent) as IUsers[];
    const friendRequestsAPIPath = useSelector(({ root }) => root.APIs.friendRequests);
    const userId = useSelector(({ root }) => root.userId);
    const currentUserDbId = useSelector(({ root }) => root.userDbId);
    const [sentRequest, setSentRequest] = useState(false);
    const [removed, setRemoved] = useState(false);

    const handleSendRequest = () => {
        setSentRequest(true);
        dispatch(setFriendRequestsSent([...friendRequestsSent, { username, avatarUrl, userDbId }]));
        axios.patch(`${friendRequestsAPIPath}/${userId}/sent/${userDbId}`);
        axios.patch(`${friendRequestsAPIPath}/${userDbId}/received/${currentUserDbId}`);
    };
    const handleUnsendRequest = () => {
        setSentRequest(false);
        dispatch(setFriendRequestsSent(friendRequestsSent.filter((request) => request.userDbId !== userDbId)));
        axios.delete(`${friendRequestsAPIPath}/${userId}/sent/${userDbId}`);
        axios.delete(`${friendRequestsAPIPath}/${userDbId}/received/${currentUserDbId}`);
    };

    useMemo(() => {
        (async () => {
            let ids: string[] = [];
            if (friendRequestsSent.length === 0) {
                const res = await axios.get(`${friendRequestsAPIPath}/${userId}/sent`);
                const usersSent = res.data as Array<IUsers>;
                ids = usersSent.map((user) => user.userDbId);
            } else {
                ids = friendRequestsSent.map((user) => user.userDbId);
            }
            ids.includes(userDbId) && setSentRequest(true);
        })();
    }, []);

    return (
        !removed && (
            <div css={styles.container} className="my-1">
                <div className="w-full">
                    <div className="flex gap-2 items-center">
                        <img src={avatarUrl} alt="avatar" css={styles.avatar} />
                        <h6 css={styles.name}>{username}</h6>
                    </div>
                    <div css={styles.btnsContainer}>
                        {sentRequest ? (
                            <Button variant="contained" css={styles.rejectBtn} onClick={handleUnsendRequest}>
                                <CloseIcon css={styles.addFriensIcon} />
                                <span css={styles.btnText}>Hủy yêu cầu</span>
                            </Button>
                        ) : (
                            <Button variant="contained" css={styles.acceptbtn} onClick={handleSendRequest}>
                                <PersonAddIcon css={styles.sentRequestIcon} />
                                <span css={styles.sentRequestText}>Gửi yêu cầu</span>
                            </Button>
                        )}
                        {!sentRequest && (
                            <Button variant="contained" css={styles.rejectBtn} onClick={() => setRemoved(true)}>
                                <CloseIcon css={styles.addFriensIcon} />
                                <span css={styles.btnText}>Gỡ</span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        )
    );
}

const styles = {
    container: css`
        border-radius: 8px;
        transition: all 0.15s ease;
        display: flex;
        align-items: center;
        padding: 8px;
        justify-content: space-between;
        background-color: var(--bg-hover);
        margin: 0 12px 16px;
        border: 1px solid var(--secondary-color2);
    `,
    avatar: css`
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: 1px solid #bbbbbb;
    `,
    name: css`
        font-size: 15px;
        line-height: 20px;
    `,
    acceptbtn: css`
        padding: 8px 14px;
        background-color: var(--primary-color);
        box-shadow: none !important;
    `,
    addFriensIcon: css`
        font-size: 16px;
        margin-right: 4px;
    `,
    btnsContainer: css`
        margin-top: 4px;
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-right: 12px;
    `,
    rejectBtn: css`
        padding: 8px 14px;
        background-color: var(--secondary-color2);
        box-shadow: none !important;

        &:hover {
            background: var(--secondary-color3) !important;
        }
    `,
    btnText: css`
        font-weight: bold;
        font-size: 10px !important;
    `,
    sentRequestText: css`
        font-weight: bold;
        font-size: 10px !important;
        color: #fff;
    `,
    sentRequestIcon: css`
        font-size: 16px;
        margin-right: 4px;
        path {
            color: #fff !important;
        }
    `,
};

export default ProposedUser;
