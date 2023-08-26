/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { CircularProgress } from '@mui/material';
import axios from 'axios';
import { useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { IUsers } from '~/utils/types';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

interface IMember {
    username: string;
    avatarUrl: string;
}

function MemberItem({ username, avatarUrl }: IMember) {
    return (
        <div css={styles.container} className="my-1">
            <div className="w-full">
                <div className="flex gap-2 items-center">
                    <img src={avatarUrl} alt="avatar" css={styles.avatar} />
                    <h6 css={styles.name}>{username}</h6>
                </div>
            </div>
        </div>
    );
}

function MemberList({ memberIds }: { memberIds: string[] }) {
    const [drop, setDrop] = useState(false);
    const [members, setMembers] = useState<IUsers[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const usersAPIPath = useSelector(({ root }) => root.APIs.user);
    const userDbId = useSelector(({ root }) => root.userDbId);
    const firstRender = useRef(true);

    const fetchMemberList = () => {
        setIsLoading(true);
        axios.post(`${usersAPIPath}/arrayUserIds`, { UserIds: memberIds }).then((res) => {
            setMembers(res.data);
            setIsLoading(false);
        });
    };
    useMemo(() => {
        if (!firstRender.current) {
            fetchMemberList();
            firstRender.current = false;
        }
    }, [memberIds]);
    const handelDrop = () => {
        if (!drop) {
            setDrop(true);
            members.length === 0 && fetchMemberList();
        } else setDrop(false);
    };

    return (
        <div>
            <div css={styles.chatInfo} onClick={handelDrop}>
                <span className="font-bold flex-grow">Danh sách thành viên</span>
                {drop ? <KeyboardArrowDownIcon /> : <ChevronRightRoundedIcon />}
            </div>
            {drop &&
                (isLoading ? (
                    <div className="flex justify-center my-4">
                        <CircularProgress />
                    </div>
                ) : (
                    <div className="mt-2">
                        {members.map((member, index) =>
                            userDbId === member.userDbId ? (
                                <MemberItem
                                    key={index}
                                    username={member.username + ' (tôi)'}
                                    avatarUrl={member.avatarUrl}
                                />
                            ) : (
                                <MemberItem key={index} username={member.username} avatarUrl={member.avatarUrl} />
                            )
                        )}
                    </div>
                ))}
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
        margin: 0 12px 8px;
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
};

export default MemberList;
