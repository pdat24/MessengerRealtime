/** @jsxImportSource @emotion/react */
import clsx from 'clsx';
import SearchIcon from '@mui/icons-material/Search';
import style from '../../layouts/layout.module.scss';
import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';
import ProposedUser from '~/components/UserProposed';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { IFriendInfo } from '~/utils/types';
import { setFriendList } from '~/utils/redux/rootSlice';
import { CircularProgress } from '@mui/material';
import UserSentRequest from '~/components/UserSentRequest';

interface ImatchedUsers {
    username: string;
    avatarUrl: string;
    userDbId: string;
}

function MakeFriend() {
    const dispatch = useDispatch();
    const searchWrapper = useRef<HTMLDivElement>(null);
    const bodyDOM = useRef<HTMLDivElement>(null);
    const userAPIPath = useSelector(({ root }) => root.APIs.user);
    const friendsAPIPath = useSelector(({ root }) => root.APIs.friends);
    const friendRequestsAPIPath = useSelector(({ root }) => root.APIs.friendRequests);
    const friendList = useSelector(({ root }) => root.friendList) as Array<IFriendInfo>;
    const currentUserDbId = useSelector(({ root }) => root.userDbId);
    const currentUserId = useSelector(({ root }) => root.userId);
    const haveNewFriend = useSelector(({ root }) => root.haveNewFriend);
    const users = useRef<ImatchedUsers[]>([]);
    const [searchName, setSearchName] = useState('');
    const [matchedUsers, setMatchedUsers] = useState<ImatchedUsers[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [friendRequestsReceived, setFriendRequestsReceived] = useState<ImatchedUsers[]>([]);

    useEffect(() => {
        // handle scroll
        bodyDOM.current!.onscroll = () => {
            if (bodyDOM.current!.scrollTop > 0) {
                searchWrapper.current?.classList.add('border-b', 'border-solid', 'border-color');
            } else {
                searchWrapper.current?.classList.remove('border-b', 'border-solid', 'border-color');
            }
        };

        // user fetching
        (async () => {
            const friendIds: string[] = [];
            if (friendList.length === 0 || haveNewFriend) {
                const temp = await axios.get(`${friendsAPIPath}/${currentUserId}`);
                dispatch(setFriendList(temp.data));
                temp.data.forEach((info: IFriendInfo) => friendIds.push(info.id));
            } else {
                friendList.forEach((info) => friendIds.push(info.id));
            }
            const res = await axios.get(`${userAPIPath}/all`);
            users.current = res.data.filter((user: ImatchedUsers) => {
                return user.userDbId != currentUserDbId && !friendIds.includes(user.userDbId);
            });
            const _friendRequestsReceived = (await axios.get(`${friendRequestsAPIPath}/${currentUserId}/received`))
                .data;
            setFriendRequestsReceived(_friendRequestsReceived);
            setIsLoading(false);
            setMatchedUsers(users.current);
        })();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        if (text.length === 0) setMatchedUsers(users.current);
        else {
            const newMatchedUsers = users.current.filter((user) =>
                user.username.toLowerCase().includes(text.toLowerCase())
            );
            setMatchedUsers(newMatchedUsers);
        }
        setSearchName(text);
    };

    return (
        <div className={clsx(style.chatContainer, 'border-r border-solid border-color')}>
            <div className={style.header}>
                <h3 css={styles.title}>Kết bạn</h3>
                <div className="mx-3 pb-3" ref={searchWrapper}>
                    <div className={style.searchBar}>
                        <SearchIcon css={styles.searchIcon} />
                        <input
                            value={searchName}
                            onChange={handleSearch}
                            className="bg-transparent px-2 border-0 outline-0 flex-grow text-sm"
                            type="search"
                            placeholder="Nhập tên để tìm kiếm"
                            autoFocus
                        />
                    </div>
                </div>
            </div>
            <div className={style.body} ref={bodyDOM}>
                <div className="p-1.5">
                    {searchName.length !== 0 ? (
                        matchedUsers.length === 0 ? (
                            <div className="mb-7">
                                <p className="text-center text-sm italic mt-5">Không tìm thấy người dùng!</p>
                            </div>
                        ) : (
                            <div>
                                <h5 className="mx-3 mb-2 mt-1 text-lg font-medium">Kết quả</h5>
                                <div>
                                    {matchedUsers.map((matchedUser, index) => {
                                        const isSentRequest =
                                            matchedUser.userDbId === friendRequestsReceived[index]?.userDbId;
                                        return isSentRequest ? (
                                            <UserSentRequest
                                                key={index}
                                                userDbId={matchedUser.userDbId}
                                                username={matchedUser.username}
                                                avatarUrl={matchedUser.avatarUrl}
                                            />
                                        ) : (
                                            <ProposedUser
                                                key={index}
                                                userDbId={matchedUser.userDbId}
                                                username={matchedUser.username}
                                                avatarUrl={matchedUser.avatarUrl}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )
                    ) : (
                        <div>
                            <h5 className="mx-3 mb-2 mt-1 text-lg font-medium">Đề xuất</h5>
                            {isLoading ? (
                                <div className="flex justify-center my-4">
                                    <CircularProgress />
                                </div>
                            ) : matchedUsers.length === 0 ? (
                                <div className="mb-7">
                                    <p className="text-center text-sm italic mt-5">Không có người dùng đề xuất!</p>
                                </div>
                            ) : (
                                <div>
                                    {matchedUsers.map((matchedUser, index) => {
                                        const isSentRequest =
                                            matchedUser.userDbId === friendRequestsReceived[index]?.userDbId;
                                        return isSentRequest ? (
                                            <UserSentRequest
                                                key={index}
                                                userDbId={matchedUser.userDbId}
                                                username={matchedUser.username}
                                                avatarUrl={matchedUser.avatarUrl}
                                            />
                                        ) : (
                                            <ProposedUser
                                                key={index}
                                                userDbId={matchedUser.userDbId}
                                                username={matchedUser.username}
                                                avatarUrl={matchedUser.avatarUrl}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    title: css`
        font-weight: 500;
        margin: 10px;
        margin-left: 24px;
        font-size: 24px;
    `,
    searchIcon: css`
        font-size: 20px;
    `,
};

export default MakeFriend;
