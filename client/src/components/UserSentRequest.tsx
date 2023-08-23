/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Button } from '@mui/material';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { setFefreshFriendList } from '~/utils/redux/rootSlice';
import { useState } from 'react';
import ProposedUser from './UserProposed';

interface ImatchedUsers {
    username: string;
    avatarUrl: string;
    userDbId: string;
}

function UserSentRequest({ username, avatarUrl, userDbId }: ImatchedUsers) {
    const dispatch = useDispatch();
    const friendRequestsAPIPath = useSelector(({ root }) => root.APIs.friendRequests);
    const currentUserDbId = useSelector(({ root }) => root.userDbId);
    const [rejected, setRejected] = useState(false);
    const [accepted, setAccepted] = useState(false);

    const handleAccept = () => {
        dispatch(setFefreshFriendList(true));
        setAccepted(true);
        axios.post(`${friendRequestsAPIPath}/${currentUserDbId}/accept/${userDbId}`);
    };
    const handleReject = () => {
        setRejected(true);
        axios.delete(`${friendRequestsAPIPath}/${currentUserDbId}/reject/${userDbId}`);
    };

    return rejected ? (
        <ProposedUser username={username} avatarUrl={avatarUrl} userDbId={userDbId} />
    ) : (
        <div css={styles.container} className="my-1">
            <div className="w-full">
                <div className="flex gap-2 items-center">
                    <img src={avatarUrl} alt="avatar" css={styles.avatar} />
                    <h6 css={styles.name}>{username}</h6>
                </div>
                <div css={styles.btnsContainer}>
                    {accepted ? (
                        <Button variant="contained" css={styles.rejectBtn} disabled>
                            <DoneAllIcon css={styles.DoneIcon} />
                            <span css={styles.btnText}>Các bạn đã là bạn bè</span>
                        </Button>
                    ) : (
                        <>
                            <Button variant="contained" css={styles.acceptbtn} onClick={handleAccept}>
                                <span css={styles.sentRequestText}>Chấp nhận</span>
                            </Button>
                            <Button variant="contained" css={styles.rejectBtn} onClick={handleReject}>
                                <span css={styles.btnText}>Từ chối</span>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
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
    DoneIcon: css`
        font-size: 16px;
        margin-right: 4px;
        path {
            color: var(--active-color);
        }
    `,
};

export default UserSentRequest;
